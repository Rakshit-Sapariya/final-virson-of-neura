import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { dbFail, fail } from "./api-error";

const currentMonth = () => {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-01`;
};

/** GET /api/auth/me + GET /api/users/profile — ensures a profile row exists. */
export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId, claims } = context;

    const { data, error } = await supabase.from("users").select("*").eq("id", userId).maybeSingle();
    if (error) dbFail("getProfile", error);

    if (data) return data;

    // Self-heal for accounts created before provisioning (never trusts client input).
    const email = String((claims as { email?: string }).email ?? "");
    const { data: created, error: insertError } = await supabase
      .from("users")
      .insert({ id: userId, email, full_name: "" })
      .select("*")
      .single();
    if (insertError) dbFail("getProfile.insert", insertError);

    await supabase.from("user_usage").insert({ user_id: userId, current_month: currentMonth() });
    return created;
  });

/** PUT /api/users/profile */
export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        full_name: z.string().trim().min(1).max(80).optional(),
        avatar_url: z.string().url().max(500).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const patch: { full_name?: string; avatar_url?: string | null } = {};
    if (data.full_name !== undefined) patch.full_name = data.full_name;
    if (data.avatar_url !== undefined) patch.avatar_url = data.avatar_url;
    if (Object.keys(patch).length === 0) fail("Nothing to update.");
    const { data: updated, error } = await context.supabase
      .from("users")
      .update(patch)
      .eq("id", context.userId)
      .select("*")
      .single();
    if (error) dbFail("updateProfile", error);
    return updated;
  });

/**
 * POST /api/users/plan — self-service plan changes.
 * Paid tiers can NEVER be self-granted: billing is not connected, so this
 * endpoint only allows cancelling down to the free tier. Upgrades must be
 * applied server-side by a verified payment flow.
 */
export const changePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ tier: z.enum(["free", "pro", "enterprise"]) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    if (data.tier !== "free") {
      fail("Paid plans can't be activated yet — billing isn't connected. Contact sales.", 403);
    }
    // Tier columns are not writable by the authenticated role; the downgrade
    // runs through a privileged routine that is service_role-only and scoped
    // to the already-authenticated caller's own id.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: updated, error } = await supabaseAdmin.rpc("cancel_subscription", {
      _uid: context.userId,
    });
    if (error) dbFail("changePlan", error);
    return updated;
  });

/** DELETE /api/users/account */
export const deleteAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase.from("users").delete().eq("id", context.userId);
    if (error) dbFail("deleteAccount", error);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(context.userId);
    if (authError) {
      console.error("[auth:deleteAccount]", authError);
      fail("We couldn't fully delete your account. Please contact support.", 500);
    }
    return { ok: true };
  });
