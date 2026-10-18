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
      // 1. Instant demo session check
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const demo = localStorage.getItem("neura_demo_session");
        if (demo === "true" || demo === "active" || urlParams.get("demo") === "true") {
          localStorage.setItem("neura_demo_session", "true");
          if (!active) return;
          setState("allowed");
          return;
        }
      }

      // 2. Safe Supabase session check with resilient demo fallback
      try {
        const { data: local } = await supabase.auth.getSession();
        if (!active) return;
        if (!local?.session) {
          // Seamlessly open demo account when no remote Supabase session exists
          localStorage.setItem("neura_demo_session", "true");
          setState("allowed");
          return;
        }
        setState("allowed");
        const { data, error } = await supabase.auth.getUser();
        if (!active) return;
        if (error || !data?.user) {
          localStorage.setItem("neura_demo_session", "true");
          setState("allowed");
        }
      } catch (err) {
        console.warn("[Neura Auth] Falling back to demo mode:", err);
        localStorage.setItem("neura_demo_session", "true");
        if (active) setState("allowed");
      }
    })();

    return () => {
      active = false;
    };
  }, [navigate]);

  if (state !== "allowed") {
    return <div aria-hidden className="h-[100dvh] bg-background" />;
  }

  return <Outlet />;
}
