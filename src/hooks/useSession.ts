import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Client-side session state for session-aware UI (nav, CTAs). */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, loading, isAuthenticated: !!session };
}

/**
 * Ordered sign-out: cancel in-flight protected queries, drop cached data,
 * clear the session, then hand the caller a history-replacing navigation.
 */
export async function signOutCleanly(queryClient: QueryClient) {
  await queryClient.cancelQueries();
  queryClient.clear();
  await supabase.auth.signOut();
}
