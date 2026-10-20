import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { errorMessage } from "@/lib/api-error";
import { FcGoogle } from "react-icons/fc";
import {
  Mail,
  Lock,
  User,
  ShieldCheck,
  Sparkles,
  Cpu,
  ArrowRight,
  Eye,
  EyeOff,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { OtpCard } from "@/components/auth/OtpCard";

const title = "Sign in — NEURA - TECH";
const description =
  "Sign in or create your Neura account to launch the intelligent assistant workspace.";

/** Only same-origin relative paths may be used as a post-login redirect. */
const safeNext = (value: unknown): string | undefined => {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//"))
    return undefined;
  return value;
};

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => {
    const next = safeNext(s["next"]);
    return next ? { next } : {};
  },
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
  component: AuthPage,
});

type Step = "credentials" | "otp";
type OtpStatus = "idle" | "verifying" | "error" | "success";

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch() as { next?: string };
  const next = search.next;
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [otpStatus, setOtpStatus] = useState<OtpStatus>("idle");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Where providers should send the user back to; preserves a pending `next`.
  const authReturnUrl =
    typeof window === "undefined"
      ? "/auth"
      : `${window.location.origin}/auth${next ? `?next=${encodeURIComponent(next)}` : ""}`;

  useEffect(() => {
    // A `next` path (e.g. an OAuth consent request) must survive the sign-in round-trip.
    const goHome = () => {
      if (next) window.location.replace(next);
      else {
        try {
          localStorage.setItem("neura_just_onboarded", "true");
        } catch {}
        navigate({ to: "/integrations", search: { onboard: "true" } });
      }
    };
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) goHome();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) goHome();
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate, next]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = (seconds = 45) => {
    setResendSeconds(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendSeconds((s) => {
        if (s <= 1 && timerRef.current) clearInterval(timerRef.current);
        return Math.max(0, s - 1);
      });
    }, 1000);
  };

  const handleInstantDemo = (targetEmail?: string) => {
    if (typeof window !== "undefined") {
      const emailToUse =
        (typeof targetEmail === "string" && targetEmail.trim()) ||
        email.trim() ||
        "demo.explorer@neura.ai";
      const nameToUse = fullName.trim() || "Rakshit Sapariya";
      localStorage.setItem("neura_demo_session", "true");
      localStorage.setItem(
        "neura_demo_user",
        JSON.stringify({
          email: emailToUse,
          fullName: nameToUse,
        }),
      );
      if (next) window.location.replace(next);
      else {
        try {
          localStorage.setItem("neura_just_onboarded", "true");
        } catch {}
        navigate({ to: "/integrations", search: { onboard: "true" } });
      }
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: authReturnUrl,
            data: { full_name: fullName },
          },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          // Supabase sends a confirmation email; when the template carries a
          // token, the same code works in the verification step below.
          setStep("otp");
          setOtpStatus("idle");
          setOtpNotice("We emailed you a confirmation code.");
          startCountdown();
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(
            "Account not found or password incorrect. You can click 'Instant Demo Access' below to enter immediately.",
          );
          setBusy(false);
          return;
        }
      }
    } catch (err) {
      setError(errorMessage(err, "We couldn't complete that. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  const sendCode = async () => {
    if (!email) {
      setError("Enter your email first.");
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const { error: otpSendError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: mode === "signup",
          emailRedirectTo: authReturnUrl,
        },
      });
      if (otpSendError) {
        if (/signups not allowed/i.test(otpSendError.message)) {
          throw new Error("No Neura account uses that email. Create an account first.");
        }
        throw otpSendError;
      }
      setStep("otp");
      setOtpStatus("idle");
      setOtpError(null);
      setOtpNotice(
        "Check your inbox. Enter the 6-digit code — if the email contains a sign-in link instead, opening it signs you in too.",
      );
      startCountdown();
    } catch (err) {
      setError(errorMessage(err, "We couldn't send a code right now."));
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (code: string) => {
    setOtpStatus("verifying");
    setOtpError(null);
    setOtpNotice(null);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });
      if (verifyError) throw verifyError;
      setOtpStatus("success");
      if (next) window.location.replace(next);
      else {
        try {
          localStorage.setItem("neura_just_onboarded", "true");
        } catch {}
        navigate({ to: "/integrations", search: { onboard: "true" } });
      }
    } catch (err) {
      setOtpStatus("error");
      setOtpError(errorMessage(err, "That code didn't work. Request a new one."));
      setTimeout(() => setOtpStatus((s) => (s === "error" ? "idle" : s)), 1200);
    }
  };

  const signInWithGoogle = async () => {
    setBusy(true);
    setError(null);
    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: authReturnUrl,
        },
      });
      if (oauthError) {
        setError(errorMessage(oauthError, "Google sign-in failed. Please try again."));
        setBusy(false);
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        if (next) window.location.replace(next);
        else navigate({ to: "/app" });
      }
    } catch (err) {
      setError(errorMessage(err, "Google sign-in failed. Please try again."));
      setBusy(false);
    }
  };


  const fieldClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-cyan-400/60 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(110,231,255,0.18)]";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] px-4 py-12 sm:py-16 selection:bg-cyan-500/20">
      {/* Dynamic 2D Cyber Grid & Radial Aura */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `radial-gradient(rgba(110, 231, 255, 0.4) 1px, transparent 1px), radial-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
          backgroundPosition: "0 0, 18px 18px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, #000 60%, transparent 100%)",
        }}
      />

      {/* Atmospheric 2D Glow Orbs */}
      <div
        className="pointer-events-none absolute -top-40 left-1/4 h-[36rem] w-[36rem] rounded-full bg-cyan-500/15 blur-[140px] animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-1/4 h-[36rem] w-[36rem] rounded-full bg-violet-600/15 blur-[160px] animate-pulse"
        style={{ animationDuration: "10s" }}
      />

      <div className="relative z-10 w-full max-w-5xl">
        {/* Brand Header */}
        <Link
          to="/"
          className="group mb-8 flex items-center justify-center gap-3 transition-transform duration-300 hover:scale-105"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/30 bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-violet-500/20 shadow-[0_0_15px_rgba(110,231,255,0.3)]">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#6ee7ff] animate-ping" />
            <span className="absolute h-2 w-2 rounded-full bg-cyan-300" />
          </div>
          <span className="font-display text-sm font-bold tracking-[0.28em] text-white transition-colors group-hover:text-cyan-400">
            NEURA
          </span>
        </Link>

        {step === "otp" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto w-full max-w-md"
          >
            <OtpCard
              email={email}
              status={otpStatus}
              error={otpError}
              notice={otpNotice}
              onVerify={verifyCode}
              onResend={sendCode}
              onBack={() => {
                setStep("credentials");
                setOtpError(null);
                setOtpNotice(null);
                setOtpStatus("idle");
              }}
              resendSeconds={resendSeconds}
              resending={busy}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto rounded-3xl p-[1px] bg-gradient-to-br from-cyan-400/25 via-white/10 to-violet-500/25 shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(110,231,255,0.06)]"
          >
            <div className="grid overflow-hidden rounded-3xl bg-[#060914]/90 backdrop-blur-3xl divide-y md:divide-y-0 md:divide-x divide-white/[0.06] md:grid-cols-[1.1fr_1fr]">
              {/* Left Panel: Clean, Simple & 100% 2D Animated AI Visual */}
              <aside className="relative hidden overflow-hidden p-10 md:flex md:flex-col md:justify-between bg-gradient-to-b from-[#080d1e]/80 via-[#070b18]/60 to-[#04060f]/90">
                {/* Soft 2D Ambient Glows */}
                <div
                  className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"
                  style={{ animationDuration: "6s" }}
                />
                <div
                  className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl animate-pulse"
                  style={{ animationDuration: "8s" }}
                />

                {/* Minimal Header Tag */}
                <div className="relative z-10 flex items-center gap-2 text-xs text-white/60">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                  </span>
                  <span className="font-mono text-[11px] tracking-wider text-cyan-300/80">
                    NEURA COGNITIVE CORE
                  </span>
                </div>

                {/* 2D Animated Concentric Ambient Core (Zero 3D) */}
                <div className="relative my-auto flex items-center justify-center py-10 select-none">
                  {/* Outer Breathing Radial Halo */}
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute h-56 w-56 rounded-full bg-gradient-to-tr from-cyan-500/25 via-blue-500/15 to-violet-500/25 blur-2xl"
                  />

                  {/* 2D Rotating Dashed Ring */}
                  <div className="absolute h-48 w-48 rounded-full border border-dashed border-cyan-400/25 animate-[spin_35s_linear_infinite]" />

                  {/* 2D Counter-Rotating Ring with Orbiting Node */}
                  <div className="absolute h-36 w-36 rounded-full border border-violet-400/30 animate-[spin_22s_linear_infinite_reverse]">
                    <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_8px_#6ee7ff]" />
                  </div>

                  {/* 2D Inner Pulsing Ring */}
                  <motion.div
                    animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.35, 0.7, 0.35] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute h-28 w-28 rounded-full border border-cyan-300/35"
                  />

                  {/* Center Glowing 2D Core Orb */}
                  <motion.div
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-violet-600 p-[1.5px] shadow-[0_0_35px_rgba(110,231,255,0.4)]"
                  >
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#070b19]">
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-violet-600/30 animate-pulse"
                        style={{ animationDuration: "2.5s" }}
                      />
                      <Sparkles className="relative h-7 w-7 text-cyan-300/90 filter drop-shadow-[0_0_6px_rgba(110,231,255,0.6)]" />
                    </div>
                  </motion.div>
                </div>

                {/* Clean, Elegant Copy */}
                <div className="relative z-10 space-y-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold tracking-tight text-white">
                      The intelligence layer behind your work.
                    </h2>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300/80">
                      Voice, code, vision and reasoning — one assistant that adapts to how you think.
                    </p>
                  </div>

                  <ul className="space-y-2.5 pt-1 text-xs text-slate-300/90">
                    <li className="flex items-center gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span>Encrypted, per-account workspace isolation</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Sparkles className="h-4 w-4 text-violet-400 shrink-0" />
                      <span>Adaptive multi-model cognitive routing</span>
                    </li>
                  </ul>
                </div>
              </aside>

              {/* Right Panel: Interactive Form with Rich 2D Animations & Effects */}
              <div className="p-8 sm:p-10 flex flex-col justify-center bg-black/40 backdrop-blur-xl relative">
                {/* Mode Switcher Tabs with Animated Indicator */}
                <div className="flex p-1 mb-6 rounded-2xl bg-white/[0.04] border border-white/10 relative">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setError(null);
                      setNotice(null);
                    }}
                    className={`relative z-10 flex-1 py-2 text-xs font-semibold tracking-wider uppercase transition-colors duration-200 ${
                      mode === "signin" ? "text-white" : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    Sign In
                    {mode === "signin" && (
                      <motion.div
                        layoutId="authModeIndicator"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/25 via-blue-500/20 to-violet-500/25 border border-cyan-400/50 shadow-[0_0_15px_rgba(110,231,255,0.25)] -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setError(null);
                      setNotice(null);
                    }}
                    className={`relative z-10 flex-1 py-2 text-xs font-semibold tracking-wider uppercase transition-colors duration-200 ${
                      mode === "signup" ? "text-white" : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    Create Account
                    {mode === "signup" && (
                      <motion.div
                        layoutId="authModeIndicator"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/25 via-blue-500/20 to-violet-500/25 border border-cyan-400/50 shadow-[0_0_15px_rgba(110,231,255,0.25)] -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                  </motion.button>
                </div>

                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                    {mode === "signin" ? "Welcome back" : "Create your account"}
                  </h1>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {mode === "signin"
                      ? "Sign in to access your intelligence layer & neural sessions."
                      : "A few seconds and your AI assistant is primed and live."}
                  </p>
                </div>

                {/* Google Sign In with animated hover & sheen sweep */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={signInWithGoogle}
                  disabled={busy}
                  className="group relative mt-6 flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(110,231,255,0.15)] disabled:opacity-50"
                >
                  <FcGoogle className="text-xl transition-transform duration-200 group-hover:scale-110" />
                  <span className="font-medium text-white/90">Continue with Google</span>
                  {/* Subtle sheen sweep on hover */}
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                </motion.button>

                {/* Divider */}
                <div className="my-5 flex items-center gap-4 text-[11px] font-mono uppercase tracking-wider text-muted-foreground/60">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                  <span>or continue with email</span>
                  <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-3.5">
                  <AnimatePresence initial={false}>
                    {mode === "signup" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -8 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        <label className="mb-1.5 block text-xs font-medium text-white/70" htmlFor="name">
                          Full name
                        </label>
                        <div className="relative group">
                          <User
                            className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${
                              focusedField === "name"
                                ? "text-cyan-400 drop-shadow-[0_0_6px_rgba(110,231,255,0.7)]"
                                : "text-white/40"
                            }`}
                          />
                          <input
                            id="name"
                            value={fullName}
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => setFullName(e.target.value)}
                            autoComplete="name"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-cyan-400 focus:bg-white/[0.06] focus:ring-1 focus:ring-cyan-400/40 focus:shadow-[0_0_20px_rgba(110,231,255,0.2)]"
                            placeholder="Ada Lovelace"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/70" htmlFor="email">
                      Email
                    </label>
                    <div className="relative group">
                      <Mail
                        className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${
                          focusedField === "email"
                            ? "text-cyan-400 drop-shadow-[0_0_6px_rgba(110,231,255,0.7)]"
                            : "text-white/40"
                        }`}
                      />
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-cyan-400 focus:bg-white/[0.06] focus:ring-1 focus:ring-cyan-400/40 focus:shadow-[0_0_20px_rgba(110,231,255,0.2)]"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="block text-xs font-medium text-white/70" htmlFor="password">
                        Password
                      </label>
                      {mode === "signin" && (
                        <Link
                          to="/reset-password"
                          className="text-xs text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock
                        className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${
                          focusedField === "password"
                            ? "text-cyan-400 drop-shadow-[0_0_6px_rgba(110,231,255,0.7)]"
                            : "text-white/40"
                        }`}
                      />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={mode === "signin" ? "current-password" : "new-password"}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-11 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-cyan-400 focus:bg-white/[0.06] focus:ring-1 focus:ring-cyan-400/40 focus:shadow-[0_0_20px_rgba(110,231,255,0.2)]"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-cyan-400"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="alert"
                      className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                    >
                      {error}
                    </motion.div>
                  )}
                  {notice && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      aria-live="polite"
                      className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-xs text-cyan-300 shadow-[0_0_15px_rgba(110,231,255,0.15)]"
                    >
                      {notice}
                    </motion.div>
                  )}

                  {/* Primary Submit Button with animated glow & sheen */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={busy}
                    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(110,231,255,0.35)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(110,231,255,0.6)] disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {busy ? "Processing…" : mode === "signin" ? "Sign In" : "Launch Account"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                    </span>
                    {/* Light beam sheen sweep across button */}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                  </motion.button>

                  {/* One-time code button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={sendCode}
                    disabled={busy}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs font-medium text-white/70 transition-all duration-200 hover:border-cyan-400/40 hover:bg-white/[0.06] hover:text-white hover:shadow-[0_0_15px_rgba(110,231,255,0.1)] disabled:opacity-50"
                  >
                    Email me a one-time code
                  </motion.button>

                  {/* Instant Demo Access Divider & Button */}
                  <div className="relative my-3 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <span className="relative bg-[#060914] px-3 font-mono text-[10px] uppercase tracking-wider text-white/40">
                      or explore immediately
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => handleInstantDemo()}
                    className="group relative flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 via-cyan-400/15 to-violet-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-300 shadow-[0_0_20px_rgba(110,231,255,0.1)] transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(110,231,255,0.3)] hover:text-white"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400 transition-transform duration-300 group-hover:rotate-12" />
                    <span>Instant Demo Access (Preview Interface)</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-70 transition-transform duration-200 group-hover:translate-x-1" />
                  </motion.button>
                </form>

                <p className="mt-5 text-center text-xs text-muted-foreground">
                  {mode === "signin" ? "New to Neura?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "signin" ? "signup" : "signin");
                      setError(null);
                      setNotice(null);
                    }}
                    className="font-medium text-cyan-400 transition-colors hover:text-cyan-300 underline underline-offset-4"
                  >
                    {mode === "signin" ? "Create an account" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
