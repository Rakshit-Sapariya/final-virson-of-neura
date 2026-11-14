import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { dbFail, fail } from "./api-error";




/** GET /api/conversations/:id/messages — RLS scopes rows to the workspace owner. */
export const listMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ conversationId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("messages")
      .select("id, conversation_id, role, content, model, token_count, created_at")
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
  .validator((input: unknown) =>
    z
      .object({
        conversationId: z.string().uuid().optional(),
        workspaceId: z.string().uuid().optional(),
        content: z.string().trim().min(1).max(25000),
        /** User-facing response mode; "auto" defers to intent detection. */
        mode: z.enum(["auto", "fast", "balanced", "deep"]).optional(),
        /** Explicit model tag from picker (e.g. groq/llama-3.3-70b, gemini/gemini-2.5-flash). */
        model: z.string().optional(),
        /**
         * Retry of an already-persisted user turn whose AI reply failed.
         * When set, the existing row is reused instead of inserting a duplicate.
         */
        retryUserMessageId: z.string().uuid().optional(),
        retryMessageId: z.string().uuid().optional(),
        webSearch: z.boolean().optional(),
        thinking: z.boolean().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    // Resolve or automatically create conversation if not yet created (e.g. first turn in new chat)
    let conversationId = data.conversationId;
    let conversation: { id: string; title: string } | null = null;

    if (conversationId) {
      const { data: conv, error: convError } = await supabase
        .from("conversations")
        .select("id, title")
        .eq("id", conversationId)
        .maybeSingle();
      if (convError) dbFail("sendMessage.conversation", convError);
      if (!conv) fail("Conversation not found.", 404);
      conversation = conv;
    } else {
      let wsId = data.workspaceId;
      if (!wsId) {
        const { data: ws } = await supabase
          .from("workspaces")
          .select("id")
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();
        wsId = ws?.id;
      }
      if (!wsId) {
        const { data: newWs, error: wsErr } = await supabase
          .from("workspaces")
          .insert({ name: "Personal Workspace", user_id: context.userId })
          .select("id")
          .single();
        if (wsErr) dbFail("sendMessage.createWorkspace", wsErr);
        wsId = newWs.id;
      }

      const initialTitle = data.content.slice(0, 50).trim() || "New conversation";
      const { data: newConv, error: newConvErr } = await supabase
        .from("conversations")
        .insert({ workspace_id: wsId, title: initialTitle })
        .select("id, title")
        .single();
      if (newConvErr) dbFail("sendMessage.createConversation", newConvErr);
      conversation = newConv;
      conversationId = newConv.id;
    }

    // Plan enforcement — a limit of -1 means unlimited.
    const { data: statusRows, error: statusError } = await supabase.rpc("usage_status");
    if (statusError) dbFail("sendMessage.usageStatus", statusError);
    const status = statusRows?.[0];
    if (status && status.message_limit >= 0 && status.messages_used >= status.message_limit) {
      return {
        conversationId,
        userMessage: null,
        assistantMessage: null,
        error: `You've used all ${status.message_limit} messages on the ${status.tier} plan this month. Upgrade to keep chatting.`,
        limitReached: true,
        intent: null,
        route: null,
        tokensUsed: 0,
      };
    }

    const effectiveRetryId = data.retryUserMessageId ?? data.retryMessageId;
    let userMessage;
    const userTokens = Math.max(1, Math.ceil(data.content.length / 3.8));

    if (effectiveRetryId) {
      // Retry of a turn whose reply failed: reuse the stored row (RLS scopes it
      // to the owner) so the same question is never persisted twice.
      const { data: existing, error: existingError } = await supabase
        .from("messages")
        .select("id, conversation_id, role, content, model, token_count, created_at")
        .eq("id", effectiveRetryId)
        .eq("conversation_id", conversationId)
        .eq("role", "user")
        .maybeSingle();
      if (existingError) dbFail("sendMessage.retryLookup", existingError);
      if (!existing) fail("Message not found.", 404);
      userMessage = existing;
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          role: "user",
          content: data.content,
          token_count: userTokens,
        })
        .select("id, conversation_id, role, content, model, token_count, created_at")
        .single();
      if (insertError) dbFail("sendMessage.insertUser", insertError);
      userMessage = inserted;
    }

    // Newest 12 turns (rows are re-ordered chronologically below): taking the
    // oldest rows would drop the actual question on long threads.
    const { data: history, error: historyError } = await supabase
      .from("messages")
      .select("role, content, created_at")
      .eq("conversation_id", conversationId)
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

    let systemPrompt = systemPromptFor(intent);
    if (data.thinking) {
      systemPrompt +=
        " Deep reasoning enabled: Wrap your preliminary scratchpad, step-by-step logic, or verification enclosed between <thinking> and </thinking> tags before your final response.";
    }
    if (data.webSearch) {
      systemPrompt +=
        " Web search grounding enabled: Ensure facts, technical packages, and citations are verified and up-to-date.";
    }

    const result = await createCompletion(
      [{ role: "system" as const, content: systemPrompt }, ...turns],
      data.model,
      route,
    );

    if (!result.ok) {
      return {
        conversationId,
        userMessage,
        assistantMessage: null,
        error: result.message,
        limitReached: false,
        intent,
        route,
        tokensUsed: userTokens,
      };
    }

    const assistantTokens = Math.max(1, Math.ceil(result.content.length / 3.8));
    const { data: assistantMessage, error: assistantError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role: "assistant",
        content: result.content.slice(0, 20000),
        model: result.model,
        token_count: assistantTokens,
      })
      .select("id, conversation_id, role, content, model, token_count, created_at")
      .single();
    if (assistantError) dbFail("sendMessage.insertAssistant", assistantError);

    // Touch the conversation, and auto-title it from the first user message.
    const patch: { updated_at: string; title?: string } = { updated_at: new Date().toISOString() };
    if (conversation.title === "New conversation") {
      patch.title = data.content.slice(0, 60);
    }
    await supabase.from("conversations").update(patch).eq("id", conversationId);

    // Atomic monthly metering (safe under concurrent sends). The routine is
    // service_role-only so it can't be invoked directly by signed-in users.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.rpc("increment_usage", {
      _uid: context.userId,
      _metric: "messages_count",
      _amount: 1,
    });

    return {
      conversationId,
      userMessage,
      assistantMessage,
      error: null as string | null,
      limitReached: false,
      intent,
      route,
      tokensUsed: userTokens + assistantTokens,
    };
  });
