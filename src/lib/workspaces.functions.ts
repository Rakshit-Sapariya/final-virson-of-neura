import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { dbFail, fail } from "./api-error";

const idSchema = z.object({ id: z.string().uuid() });

/** GET /api/workspaces */
export const listWorkspaces = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) dbFail("listWorkspaces", error);
    return data ?? [];
  });

/** GET /api/workspaces/:id — RLS + explicit owner filter prevents IDOR. */
export const getWorkspace = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => idSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: workspace, error } = await context.supabase
      .from("workspaces")
      .select("*")
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) dbFail("getWorkspace", error);
    if (!workspace) fail("Workspace not found.", 404);
    return workspace;
  });

/** POST /api/workspaces */
export const createWorkspace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        name: z.string().trim().min(1).max(80),
        description: z.string().trim().max(500).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: created, error } = await context.supabase
      .from("workspaces")
      .insert({ name: data.name, description: data.description ?? null, user_id: context.userId })
      .select("*")
      .single();
    if (error) dbFail("createWorkspace", error);
    return created;
  });

/** PUT /api/workspaces/:id */
export const updateWorkspace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        name: z.string().trim().min(1).max(80).optional(),
        description: z.string().trim().max(500).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const patch: { name?: string; description?: string | null } = {};
    if (data.name !== undefined) patch.name = data.name;
    if (data.description !== undefined) patch.description = data.description;
    if (Object.keys(patch).length === 0) fail("Nothing to update.");
    const { data: updated, error } = await context.supabase
      .from("workspaces")
      .update(patch)
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .select("*")
      .maybeSingle();
    if (error) dbFail("updateWorkspace", error);
    if (!updated) fail("Workspace not found.", 404);
    return updated;
  });

/** DELETE /api/workspaces/:id */
export const deleteWorkspace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => idSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("workspaces")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) dbFail("deleteWorkspace", error);
    return { ok: true };
  });

/** Returns the caller's default workspace, creating it on first use. */
export const ensureDefaultWorkspace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: existing, error } = await context.supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) dbFail("ensureDefaultWorkspace.read", error);
    if (existing) return existing;

    const { data: created, error: insertError } = await context.supabase
      .from("workspaces")
      .insert({ name: "My Workspace", description: null, user_id: context.userId })
      .select("*")
      .single();
    if (insertError) dbFail("ensureDefaultWorkspace.insert", insertError);
    return created;
  });
