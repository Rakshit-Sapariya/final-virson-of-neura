import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { dbFail, fail } from "./api-error";




/** GET /api/conversations/:id/messages — RLS scopes rows to the workspace owner. */
export const listMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ conversationId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("messages")
      .select("id, conversation_id, role, content, model, created_at")
      .eq("conversation_id", data.conversationId)
      .order("created_at", { ascending: true });
    if (error) dbFail("listMessages", error);
    return rows ?? [];
  });

/**
 * POST /api/conversations/:id/messages
 * Persists the user message, calls the AI provider server-side, persists the reply.
 */
export const sendMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        conversationId: z.string().uuid(),
        content: z.string().trim().min(1).max(8000),
        /** User-facing response mode; "auto" defers to intent detection. */
        mode: z.enum(["auto", "fast", "balanced", "deep"]).optional(),
        /**
         * Retry of an already-persisted user turn whose AI reply failed.
         * When set, the existing row is reused instead of inserting a duplicate.
         */
        retryUserMessageId: z.string().uuid().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("id, title")
      .eq("id", data.conversationId)
      .maybeSingle();
    if (convError) dbFail("sendMessage.conversation", convError);
    if (!conversation) fail("Conversation not found.", 404);


    // Plan enforcement — a limit of -1 means unlimited.
    const { data: statusRows, error: statusError } = await supabase.rpc("usage_status");
    if (statusError) dbFail("sendMessage.usageStatus", statusError);
    const status = statusRows?.[0];
    if (status && status.message_limit >= 0 && status.messages_used >= status.message_limit) {
      return {
        userMessage: null,
        assistantMessage: null,
        error: `You've used all ${status.message_limit} messages on the ${status.tier} plan this month. Upgrade to keep chatting.`,
        limitReached: true,
        intent: null,
        route: null,
      };
    }

    let userMessage;
    if (data.retryUserMessageId) {
      // Retry of a turn whose reply failed: reuse the stored row (RLS scopes it
      // to the owner) so the same question is never persisted twice.
      const { data: existing, error: existingError } = await supabase
        .from("messages")
        .select("id, conversation_id, role, content, model, created_at")
        .eq("id", data.retryUserMessageId)
        .eq("conversation_id", data.conversationId)
        .eq("role", "user")
        .maybeSingle();
      if (existingError) dbFail("sendMessage.retryLookup", existingError);
      if (!existing) fail("Message not found.", 404);
      userMessage = existing;
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("messages")
        .insert({ conversation_id: data.conversationId, role: "user", content: data.content })
        .select("id, conversation_id, role, content, model, created_at")
        .single();
      if (insertError) dbFail("sendMessage.insertUser", insertError);
      userMessage = inserted;
    }

    // Newest 12 turns (rows are re-ordered chronologically below): taking the
    // oldest rows would drop the actual question on long threads.
    const { data: history, error: historyError } = await supabase
      .from("messages")
      .select("role, content, created_at")
      .eq("conversation_id", data.conversationId)
      .order("created_at", { ascending: false })
      .limit(12);
    if (historyError) dbFail("sendMessage.history", historyError);

    // Trust boundary: rows are writable through the Data API by the owner, so
    // only user/assistant turns are replayed and the system prompt is always
    // ours. Content is also clamped so stored rows can't blow up the prompt.
    const MAX_CHARS = 4000;
    // Token-cost control: keep the most recent turns within a small prompt budget.
    const MAX_CONTEXT_CHARS = 6000;
    const ctx: Array<{ role: "user" | "assistant"; content: string }> = [];
    let budget = MAX_CONTEXT_CHARS;
    for (const m of history ?? []) {
      if (m.role !== "user" && m.role !== "assistant") continue;
      const content = m.content.slice(0, MAX_CHARS);
      if (ctx.length > 0 && budget - content.length < 0) break;
      budget -= content.length;
      ctx.push({ role: m.role as "user" | "assistant", content });
    }
    const turns = ctx.reverse();

    const { createCompletion, classifyIntent, routeForIntent, systemPromptFor } =
      await import("./ai.server");
    // Intent-aware routing: heuristic (no extra model call), overridable by the
    // user's explicit mode. The tier still falls back across configured models.
    const intent = classifyIntent(data.content);
    const route = data.mode && data.mode !== "auto" ? data.mode : routeForIntent(intent);
    const result = await createCompletion(
      [{ role: "system" as const, content: systemPromptFor(intent) }, ...turns],
      undefined,
      route,
    );

    if (!result.ok) {
      return {
        userMessage,
        assistantMessage: null,
        error: result.message,
        limitReached: false,
        intent,
        route,
      };
    }

    const { data: assistantMessage, error: assistantError } = await supabase
      .from("messages")
      .insert({
        conversation_id: data.conversationId,
        role: "assistant",
        content: result.content.slice(0, 20000),
        model: result.model,
      })
      .select("id, conversation_id, role, content, model, created_at")
      .single();
    if (assistantError) dbFail("sendMessage.insertAssistant", assistantError);

    // Touch the conversation, and auto-title it from the first user message.
    const patch: { updated_at: string; title?: string } = { updated_at: new Date().toISOString() };
    if (conversation.title === "New conversation") {
      patch.title = data.content.slice(0, 60);
    }
    await supabase.from("conversations").update(patch).eq("id", data.conversationId);

    // Atomic monthly metering (safe under concurrent sends). The routine is
    // service_role-only so it can't be invoked directly by signed-in users.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.rpc("increment_usage", {
      _uid: context.userId,
      _metric: "messages_count",
      _amount: 1,
    });

    return {
      userMessage,
      assistantMessage,
      error: null as string | null,
      limitReached: false,
      intent,
      route,
    };
  });
