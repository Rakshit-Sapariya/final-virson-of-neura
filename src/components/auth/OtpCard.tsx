import { useEffect, useMemo, useRef, useState } from "react";

const LENGTH = 6;

type Status = "idle" | "verifying" | "error" | "success";

interface OtpCardProps {
  email: string;
  status: Status;
  error?: string | null;
  notice?: string | null;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
  resendSeconds: number;
  resending?: boolean;
}

/**
 * Verification card: dark rounded panel, top handle, animated security ring,
 * segmented code entry and a resend action with countdown.
 * Purely presentational — verification is handled by Supabase auth upstream.
 */
export function OtpCard({
  email,
  status,
  error,
  notice,
  onVerify,
  onResend,
  onBack,
  resendSeconds,
  resending,
}: OtpCardProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(LENGTH).fill(""));
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const code = useMemo(() => digits.join(""), [digits]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (code.length === LENGTH && status === "idle") onVerify(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const setAt = (index: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleChange = (index: number, raw: string) => {
    const clean = raw.replace(/\D/g, "");
    if (!clean) {
      setAt(index, "");
      return;
    }
    if (clean.length > 1) {
      setDigits((prev) => {
        const next = [...prev];
        for (let i = 0; i < clean.length && index + i < LENGTH; i += 1) {
          next[index + i] = clean[i]!;
        }
        return next;
      });
      refs.current[Math.min(index + clean.length, LENGTH - 1)]?.focus();
      return;
    }
    setAt(index, clean);
    refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
      setAt(index - 1, "");
    }
    if (e.key === "ArrowLeft") refs.current[index - 1]?.focus();
    if (e.key === "ArrowRight") refs.current[index + 1]?.focus();
  };

  const statusText =
    status === "verifying"
      ? "Verifying your code…"
      : status === "success"
        ? "Verified — taking you in"
        : status === "error"
          ? "That code didn't match"
          : "Enter the code we sent";

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-8">
      <span
        className="mx-auto mb-6 block h-1 w-12 rounded-full bg-foreground/20"
        aria-hidden="true"
      />

      <div className="flex justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-primary/25" />
          <span
            className={`absolute inset-0 rounded-full border-2 border-transparent border-t-primary ${
              status === "verifying" ? "animate-spin" : ""
            }`}
          />
          <span
            className={`h-9 w-9 rounded-full bg-primary/15 ${status === "success" ? "glow-ring" : ""}`}
          />
          <span className="absolute h-2.5 w-2.5 rounded-full bg-primary" />
        </div>
      </div>

      <h1 className="mt-6 text-center font-display text-2xl font-semibold tracking-tight text-foreground">
        Verification
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {statusText} — sent to <span className="text-foreground">{email}</span>
      </p>

      <div className="mt-7 flex justify-center gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={LENGTH}
            aria-label={`Digit ${index + 1}`}
            disabled={status === "verifying" || status === "success"}
            className={`h-13 w-11 rounded-xl border bg-background/50 py-3 text-center font-display text-lg text-foreground outline-none transition-colors sm:w-12 ${
              status === "error" ? "border-destructive/60" : "border-border focus:border-primary/70"
            } disabled:opacity-60`}
          />
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-center text-sm text-destructive">
          {error}
        </p>
      )}
      <div aria-live="polite">
        {notice && <p className="mt-4 text-center text-sm text-primary">{notice}</p>}
      </div>

      <button
        type="button"
        onClick={() => onVerify(code)}
        disabled={code.length !== LENGTH || status === "verifying" || status === "success"}
        className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "verifying" ? "Verifying…" : "Verify code"}
      </button>

      <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
        <button type="button" onClick={onBack} className="underline underline-offset-4">
          Use another method
        </button>
        <button
          type="button"
          onClick={onResend}
          disabled={resendSeconds > 0 || !!resending}
          className="underline underline-offset-4 disabled:no-underline disabled:opacity-60"
        >
          {resendSeconds > 0
            ? `Resend in ${resendSeconds}s`
            : resending
              ? "Sending…"
              : "Resend code"}
        </button>
      </div>
    </div>
  );
}
