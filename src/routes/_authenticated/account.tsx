import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getProfile, updateProfile, changePlan, deleteAccount } from "@/lib/account.functions";
import { getUsageStatus } from "@/lib/usage.functions";
import { errorMessage } from "@/lib/api-error";
import { signOutCleanly } from "@/hooks/useSession";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "Account & plan — Neura" },
      { name: "description", content: "Manage your Neura profile, plan and monthly usage." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <h1 className="font-display text-xl font-semibold">Account unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't load your account right now. Please refresh.
        </p>
        <Link to="/app" className="mt-6 inline-block text-sm text-primary underline">
          Back to the assistant
        </Link>
      </div>
    </div>
  ),
});

const planCopy: Record<string, { label: string; price: string }> = {
  free: { label: "Free", price: "$0" },
  pro: { label: "Pro", price: "$12 / month · $120 / year" },
  enterprise: { label: "Enterprise", price: "Custom" },
};

function AccountPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const profileFn = useServerFn(getProfile);
  const usageFn = useServerFn(getUsageStatus);
  const updateProfileFn = useServerFn(updateProfile);
  const changePlanFn = useServerFn(changePlan);
  const deleteAccountFn = useServerFn(deleteAccount);

  const [name, setName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isDemo, setIsDemo] = useState(false);
  const [demoTier, setDemoTier] = useState<"free" | "pro" | "enterprise">("pro");
  const [demoName, setDemoName] = useState<string>("Rakshit Sapariya");
  const [demoEmail, setDemoEmail] = useState<string>("demo.explorer@neura.ai");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const demoFlag = localStorage.getItem("neura_demo_session") === "true";
      setIsDemo(demoFlag);
      const savedUser = localStorage.getItem("neura_demo_user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.email) setDemoEmail(parsed.email);
          if (parsed.fullName) setDemoName(parsed.fullName);
        } catch {}
      }
    }
  }, []);

  const profile = useQuery({ queryKey: ["profile"], queryFn: () => profileFn(), enabled: !isDemo });
  const usage = useQuery({ queryKey: ["usage-status"], queryFn: () => usageFn(), enabled: !isDemo });

  const saveName = useMutation({
    mutationFn: (full_name: string) => updateProfileFn({ data: { full_name } }),
    onSuccess: () => {
      setMessage("Profile updated.");
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e) => setError(errorMessage(e)),
  });

  const plan = useMutation({
    mutationFn: (tier: "free" | "pro" | "enterprise") => changePlanFn({ data: { tier } }),
    onSuccess: () => {
      setMessage("Plan updated.");
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["usage-status"] });
    },
    onError: (e) => setError(errorMessage(e)),
  });

  const removeAccount = useMutation({
    mutationFn: () => deleteAccountFn(),
    onSuccess: async () => {
      await signOutCleanly(qc);
      navigate({ to: "/", replace: true });
    },
    onError: (e) => setError(errorMessage(e)),
  });

  const handleSaveName = (value: string) => {
    setError(null);
    setMessage(null);
    if (isDemo) {
      setDemoName(value);
      setMessage("Profile updated.");
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "neura_demo_user",
          JSON.stringify({ email: demoEmail, fullName: value }),
        );
      }
      return;
    }
    saveName.mutate(value);
  };

  const handlePlanChange = (targetTier: "free" | "pro" | "enterprise") => {
    setError(null);
    setMessage(null);
    if (isDemo) {
      setDemoTier(targetTier);
      setMessage("Plan updated.");
      return;
    }
    plan.mutate(targetTier);
  };

  const handleRemoveAccount = async () => {
    if (isDemo) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("neura_demo_session");
        localStorage.removeItem("neura_demo_user");
      }
      await signOutCleanly(qc);
      navigate({ to: "/", replace: true });
      return;
    }
    removeAccount.mutate();
  };

  const tier = isDemo ? demoTier : (profile.data?.subscription_tier ?? "free");
  const limit = isDemo ? 555 : (usage.data?.messageLimit ?? 555);
  const used = isDemo ? 42 : (usage.data?.messagesUsed ?? 0);
  const unlimited = limit < 0;
  const pct = unlimited ? 0 : Math.min(100, Math.round((used / Math.max(limit, 1)) * 100));

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-14">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Account &amp; plan</h1>
        <Link to="/app" className="text-sm text-muted-foreground hover:text-foreground">
          Back to assistant
        </Link>
      </div>

      <div aria-live="polite">
        {message && <p className="mb-6 text-sm text-primary">{message}</p>}
      </div>
      {error && (
        <p role="alert" className="mb-6 text-sm text-destructive">
          {error}
        </p>
      )}

      <section className="glass mb-6 rounded-3xl p-7">
        <h2 className="font-display text-sm tracking-[0.2em] text-muted-foreground uppercase">
          Profile
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          {!isDemo && profile.isLoading ? "Loading your profile…" : (isDemo ? demoEmail : (profile.data?.email ?? "—"))}
        </p>
        <label className="mt-5 block text-xs text-muted-foreground" htmlFor="full-name">
          Full name
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="full-name"
            value={name ?? (isDemo ? demoName : (profile.data?.full_name ?? ""))}
            onChange={(e) => setName(e.target.value)}
            disabled={!isDemo && profile.isLoading}
            className="flex-1 rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary/60 disabled:opacity-60"
            placeholder="Ada Lovelace"
          />
          <button
            onClick={() => {
              const value = (name ?? (isDemo ? demoName : (profile.data?.full_name ?? ""))).trim();
              if (value) handleSaveName(value);
            }}
            disabled={
              saveName.isPending ||
              (!isDemo && profile.isLoading) ||
              (name ?? (isDemo ? demoName : (profile.data?.full_name ?? ""))).trim().length === 0
            }
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {saveName.isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </section>

      <section className="glass mb-6 rounded-3xl p-7">
        <h2 className="font-display text-sm tracking-[0.2em] text-muted-foreground uppercase">
          Usage this month
        </h2>
        {!isDemo && usage.isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading usage…</p>
        ) : (
          <p className="mt-4 text-sm">
            <span className="font-display text-3xl font-bold">{used}</span>{" "}
            <span className="text-muted-foreground">
              / {unlimited ? "unlimited" : limit} messages
            </span>
          </p>
        )}

        {!unlimited && (
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-foreground/10">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
        )}
      </section>

      <section className="glass rounded-3xl p-7">
        <h2 className="font-display text-sm tracking-[0.2em] text-muted-foreground uppercase">
          Plan
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          You are on the <span className="text-foreground">{planCopy[tier]?.label ?? tier}</span>{" "}
          plan ({planCopy[tier]?.price ?? "—"}).
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Billing isn't connected yet, so paid plans can't be activated from here. You can cancel
          down to the free plan at any time.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {tier !== "pro" && (
            <button
              onClick={() => handlePlanChange("pro")}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Switch to Pro (Preview)
            </button>
          )}
          {tier !== "free" && (
            <button
              onClick={() => handlePlanChange("free")}
              disabled={plan.isPending}
              className="rounded-xl border border-border px-5 py-3 text-sm disabled:opacity-50"
            >
              {plan.isPending ? "Switching…" : "Switch to Free"}
            </button>
          )}
          <a
            href="mailto:sales@neura.ai?subject=Neura%20Enterprise"
            className="rounded-xl border border-border px-5 py-3 text-sm"
          >
            Talk to sales
          </a>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6">
          <button
            onClick={() => {
              setError(null);
              if (
                window.confirm("Delete your account and all conversations? This cannot be undone.")
              ) {
                handleRemoveAccount();
              }
            }}
            disabled={removeAccount.isPending}
            className="text-sm text-destructive underline underline-offset-4 disabled:opacity-50"
          >
            {removeAccount.isPending ? "Deleting…" : "Delete my account"}
          </button>
        </div>
      </section>
    </main>
  );
}
