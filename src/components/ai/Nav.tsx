import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { MagneticButton } from "./MagneticButton";
import { useSession } from "@/hooks/useSession";

const links: Array<{ label: string; to: string }> = [
  { label: "Overview", to: "/" },
  { label: "Capabilities", to: "/features" },
  { label: "Models", to: "/models" },
  { label: "Pricing", to: "/pricing" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 bottom-5 z-50 flex flex-col-reverse items-center px-4 pointer-events-none">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:mb-2 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground pointer-events-auto"
      >
        Skip to content
      </a>
      <nav
        aria-label="Main"
        className={`pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full px-5 py-3 transition-all duration-300 glass shadow-[0_12px_45px_rgba(0,0,0,0.7)] border border-white/10 backdrop-blur-2xl`}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="NEURA - TECH" className="h-7 w-7 rounded-md" />
          <span className="font-display text-sm font-semibold tracking-[0.22em]">NEURA - TECH</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-cyan-400 font-semibold" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/account"
                className="rounded-full border border-border px-3.5 py-1.5 text-xs text-foreground transition-colors hover:bg-accent inline-block"
              >
                Account
              </Link>
              <Link to="/app">
                <MagneticButton className="px-4 py-2 text-xs" strength={0.2}>
                  Open assistant
                </MagneticButton>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="rounded-full border border-border/80 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-cyan-400/40 hover:bg-white/[0.08] inline-block"
              >
                Sign in
              </Link>
              <Link
                to="/app"
                onClick={() => localStorage.setItem("neura_demo_session", "true")}
              >
                <MagneticButton className="px-4 py-2 text-xs" strength={0.2}>
                  Launch AI
                </MagneticButton>
              </Link>
            </>
          )}

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground md:hidden"
          >
            {open ? <HiXMark /> : <HiBars3 />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="pointer-events-auto glass mb-3 w-full max-w-5xl rounded-3xl p-4 md:hidden shadow-[0_-12px_45px_rgba(0,0,0,0.7)] border border-white/10 backdrop-blur-2xl">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                  activeProps={{ className: "text-cyan-400 font-semibold bg-white/[0.05]" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 mt-2 border-t border-white/10 flex gap-2">
              <Link
                to={isAuthenticated ? "/account" : "/auth"}
                onClick={() => setOpen(false)}
                className="flex-1 text-center rounded-xl border border-white/15 px-3 py-2 text-xs font-medium text-foreground"
              >
                {isAuthenticated ? "Account & plan" : "Sign in"}
              </Link>
              <Link
                to="/app"
                onClick={() => {
                  setOpen(false);
                  localStorage.setItem("neura_demo_session", "true");
                }}
                className="flex-1 text-center rounded-xl bg-cyan-400 px-3 py-2 text-xs font-bold text-black"
              >
                Launch AI
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
