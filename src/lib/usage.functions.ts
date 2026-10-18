import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { dbFail } from "./api-error";

export const currentMonth = () => {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-01`;
};

/** GET /api/usage/current */
export const getCurrentUsage = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const month = currentMonth();

    // Usage rows are written only by the security-definer meter; read-only here.
    const { data, error } = await supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", userId)
      .eq("current_month", month)
      .maybeSingle();
    if (error) dbFail("getCurrentUsage", error);
    return (
      data ?? {
        user_id: userId,
        current_month: month,
        messages_count: 0,
        voice_minutes_used: 0,
        images_generated: 0,
        code_generations: 0,
      }
    );
  });

const metrics = [
  "messages_count",
  "voice_minutes_used",
  "images_generated",
  "code_generations",
] as const;

/** GET /api/usage/status — plan tier, monthly allowance and consumption. */
export const getUsageStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("usage_status");
    if (error) dbFail("getUsageStatus", error);
    const row = data?.[0];
    return {
      tier: row?.tier ?? "free",
      messageLimit: row?.message_limit ?? 555,
      messagesUsed: row?.messages_used ?? 0,
      voiceDailyMinutes: row?.voice_daily_minutes ?? 0,
    };
  });

/** POST /api/usage/track — atomic increment, safe under concurrency. */
export const trackUsage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ metric: z.enum(metrics), amount: z.number().int().min(1).max(600) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    // The increment routine is privileged (service_role only) so signed-in
    // users can't call it directly through the Data API. The caller is already
    // authenticated by the middleware and can only affect their own row.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: updated, error } = await supabaseAdmin.rpc("increment_usage", {
      _uid: context.userId,
      _metric: data.metric,
      _amount: data.amount,
    });
    if (error) dbFail("trackUsage", error);
    return updated;
  });
