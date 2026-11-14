import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { dbFail, fail } from "./api-error";

/** GET /api/conversations (optionally scoped to a workspace) */
export const listConversations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ workspaceId: z.string().uuid().optional() }).parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    let query = context.supabase
      .from("conversations")
      .select("id, workspace_id, title, created_at, updated_at")
      .order("updated_at", { ascending: false });
    if (data.workspaceId) query = query.eq("workspace_id", data.workspaceId);

    const { data: rows, error } = await query;
    if (error) dbFail("listConversations", error);
    return rows ?? [];
  });

/** GET /api/conversations/:id — RLS restricts to the workspace owner. */
export const getConversation = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("conversations")
      .select("id, workspace_id, title, created_at, updated_at")
      .eq("id", data.id)
      .maybeSingle();
    if (error) dbFail("getConversation", error);
    if (!row) fail("Conversation not found.", 404);
    return row;
  });

/** POST /api/conversations */
export const createConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        workspaceId: z.string().uuid().optional(),
        title: z.string().trim().min(1).max(120).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    let wsId = data.workspaceId;
    if (!wsId) {
      const { data: ws } = await context.supabase
        .from("workspaces")
        .select("id")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      wsId = ws?.id;
    }
    if (!wsId) {
      const { data: newWs, error: wsErr } = await context.supabase
        .from("workspaces")
        .insert({ name: "Personal Workspace", user_id: context.userId })
        .select("id")
        .single();
      if (wsErr) dbFail("createConversation.createWorkspace", wsErr);
      wsId = newWs.id;
    }

    const { data: created, error } = await context.supabase
      .from("conversations")
      .insert({
        workspace_id: wsId,
        title: data.title ?? "New conversation",
      })
      .select("*")
      .single();
    if (error) dbFail("createConversation", error);
    return created;
  });

/** PUT /api/conversations/:id */
export const updateConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        title: z.string().trim().min(1).max(120).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const patch: { title?: string } = {};
    if (data.title !== undefined) patch.title = data.title;
    if (Object.keys(patch).length === 0) fail("Nothing to update.");
    const { data: updated, error } = await context.supabase
      .from("conversations")
      .update(patch)
      .eq("id", data.id)
      .select("*")
      .maybeSingle();
    if (error) dbFail("updateConversation", error);
    if (!updated) fail("Conversation not found.", 404);
    return updated;
  });

/** DELETE /api/conversations/:id */
export const deleteConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        conversationId: z.string().uuid().optional(),
      })
      .refine((d) => d.id || d.conversationId, {
        message: "Must provide either id or conversationId",
      })
      .transform((d) => ({ id: (d.id ?? d.conversationId)! }))
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("conversations").delete().eq("id", data.id);
    if (error) dbFail("deleteConversation", error);
    return { ok: true };
  });
