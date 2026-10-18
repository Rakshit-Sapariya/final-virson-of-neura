import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { errorMessage } from "@/lib/api-error";

const title = "Reset your password — Neura";
const description = "Request a reset link or choose a new password for your Neura account.";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  // Supabase puts the user in a recovery session when they follow the email link.
  const [recovery, setRecovery] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && window.location.hash.includes("type=recovery")) setRecovery(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const requestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      setNotice("If that email has an account, a reset link is on its way.");
    } catch (err) {
      setError(errorMessage(err, "We couldn't send that reset link. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  const setNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setNotice("Password updated. Redirecting…");
      navigate({ to: "/app", replace: true });
    } catch (err) {
      setError(errorMessage(err, "We couldn't update your password. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/10 blur-[140px]" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-md bg-primary/15">
            <span className="h-2.5 w-2.5 rounded-full bg-primary glow-ring" />
          </span>
          <span className="font-display text-sm font-semibold tracking-[0.22em]">NEURA</span>
        </Link>

        <div className="glass rounded-3xl p-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            {recovery ? "Choose a new password" : "Reset your password"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {recovery
              ? "Pick something you haven't used before."
              : "We'll email you a secure link to set a new password."}
          </p>

          <form onSubmit={recovery ? setNewPassword : requestLink} className="mt-6 space-y-4">
            {recovery ? (
              <div>
                <label
                  className="mb-1.5 block text-xs text-muted-foreground"
                  htmlFor="new-password"
                >
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
            ) : (
              <div>
                <label className="mb-1.5 block text-xs text-muted-foreground" htmlFor="reset-email">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@company.com"
                />
              </div>
            )}

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <div aria-live="polite">
              {notice && <p className="text-sm text-primary">{notice}</p>}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Please wait…" : recovery ? "Update password" : "Send reset link"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/auth" className="text-foreground underline underline-offset-4">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
