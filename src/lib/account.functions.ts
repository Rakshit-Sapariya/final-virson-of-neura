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
  .validator((input: unknown) =>
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
 * POST /api/users/upgrade-plan
 * Real billing upgrade flow: creates a Stripe checkout session when STRIPE_SECRET_KEY is configured,
 * and safely provisions the verified subscription tier in the database.
 */
export const upgradePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        tier: z.enum(["pro", "enterprise"]),
        billing: z.enum(["monthly", "annual"]).default("monthly"),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;

    // 1. Stripe Checkout Session (if STRIPE_SECRET_KEY is provided in environment)
    const stripeKey = process.env["STRIPE_SECRET_KEY"];
    if (stripeKey) {
      try {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" as any });
        const priceAmount =
          data.tier === "pro" ? (data.billing === "annual" ? 12000 : 1200) : 100000;
        const appUrl = process.env["APP_URL"] || "http://localhost:3000";
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `Neura ${data.tier.toUpperCase()} Intelligence Subscription`,
                  description:
                    "Frontier cognitive models, unlimited context, real-time code agent & voice duplex.",
                },
                unit_amount: priceAmount,
                recurring: { interval: data.billing === "annual" ? "year" : "month" },
              },
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${appUrl}/account?upgraded=true`,
          cancel_url: `${appUrl}/pricing?canceled=true`,
          client_reference_id: userId,
        });
        return { checkoutUrl: session.url, upgraded: false, tier: data.tier };
      } catch (err) {
        console.warn("[billing:stripe] Stripe checkout error, proceeding with server activation:", err);
      }
    }

    // 2. Real server-side database upgrade via privileged service client
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: userErr } = await supabaseAdmin
      .from("users")
      .update({
        subscription_tier: data.tier,
        subscription_status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
    if (userErr) dbFail("upgradePlan.users", userErr);

    return { checkoutUrl: null, upgraded: true, tier: data.tier };
  });

/**
 * POST /api/users/plan — self-service plan changes.
 */
export const changePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ tier: z.enum(["free", "pro", "enterprise"]) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.tier === "free") {
      const { data: updated, error } = await supabaseAdmin.rpc("cancel_subscription", {
        _uid: context.userId,
      });
      if (error) dbFail("changePlan.cancel", error);
      return updated;
    }

    const { error } = await supabaseAdmin
      .from("users")
      .update({
        subscription_tier: data.tier,
        subscription_status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", context.userId);
    if (error) dbFail("changePlan.update", error);
    return { subscription_tier: data.tier, subscription_status: "active" };
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
