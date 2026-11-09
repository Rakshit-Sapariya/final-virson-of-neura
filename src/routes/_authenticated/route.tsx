import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});

/**
 * Client-side auth gate. The check runs in an effect rather than `beforeLoad`
 * so an unauthenticated visitor doesn't swap the route tree mid-hydration —
 * doing that made React re-render the whole tree with a hydration mismatch.
 *
 * `getSession()` resolves from local storage without a network round-trip, so
 * visitors with no session bounce to /auth immediately instead of sitting on a
 * loading screen while a remote `getUser()` call completes. The remote check
 * still runs afterwards to reject stale/revoked sessions.
 */
function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [state, setState] = useState<"checking" | "allowed">("checking");

  useEffect(() => {
    let active = true;

    (async () => {
      const isDev = Boolean(import.meta.env.DEV);

      // 1. Explicit dev demo session check (isolated to development environments only)
      if (typeof window !== "undefined" && isDev) {
        const urlParams = new URLSearchParams(window.location.search);
        const demoRequested = urlParams.get("demo") === "true";
        const demoActive = localStorage.getItem("neura_demo_session") === "true";
        if (demoRequested || demoActive) {
          localStorage.setItem("neura_demo_session", "true");
          if (!active) return;
          setState("allowed");
          return;
        }
      }

      // 2. Safe Supabase session verification
      try {
        const { data: local } = await supabase.auth.getSession();
        if (!active) return;
        if (!local?.session) {
          // Unauthenticated visitors redirect to auth page
          navigate({
            to: "/auth",
            search: { next: window.location.pathname },
            replace: true,
          });
          return;
        }

        const { data, error } = await supabase.auth.getUser();
        if (!active) return;
        if (error || !data?.user) {
          navigate({
            to: "/auth",
            search: { next: window.location.pathname },
            replace: true,
          });
          return;
        }

        setState("allowed");
      } catch (err) {
        console.warn("[Neura Auth] Session verification failed:", err);
        navigate({
          to: "/auth",
          search: { next: window.location.pathname },
          replace: true,
        });
      }
    })();

    return () => {
      active = false;
    };
  }, [navigate]);

  if (state !== "allowed") {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-[#05070f] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <span className="text-xs text-white/50 font-mono tracking-widest uppercase">Verifying Session...</span>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
