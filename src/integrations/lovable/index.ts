import { supabase } from "../supabase/client";

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

export const lovable = {
  auth: {
    signInWithOAuth: async (
      provider: "google" | "apple" | "microsoft" | "lovable",
      opts?: SignInOptions,
    ) => {
      const actualProvider = provider === "lovable" ? "google" : provider;
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: actualProvider,
          options: {
            redirectTo: opts?.redirect_uri || window.location.origin,
            queryParams: opts?.extraParams,
          },
        });
        if (error) return { error };
        return { redirected: true, data };
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
    },
  },
};
