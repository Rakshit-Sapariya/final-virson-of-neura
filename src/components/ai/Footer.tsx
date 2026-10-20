import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";
import { MagneticButton } from "./MagneticButton";
import { Reveal } from "./Reveal";
import { Link } from "@tanstack/react-router";

const socials = [
  { icon: FiTwitter, label: "X / Twitter", href: "https://x.com" },
  { icon: FiGithub, label: "GitHub", href: "https://github.com/mnfst/awesome-free-llm-apis" },
  { icon: FiLinkedin, label: "LinkedIn", href: "https://linkedin.com" },
];

type FooterLink = { label: string; href?: string; to?: "/" | "/features" | "/models" | "/pricing" | "/auth" | "/app" | "/account" };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Overview", to: "/" as const },
      { label: "Capabilities", to: "/features" as const },
      { label: "Models & Mesh", to: "/models" as const },
      { label: "Pricing & Plans", to: "/pricing" as const },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Multi-Model Router", to: "/models" as const },
      { label: "Commercial SLA", to: "/pricing" as const },
      { label: "Contact Engineering", href: "mailto:hello@neura.ai" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", to: "/auth" as const },
      { label: "Open assistant", to: "/app" as const },
      { label: "Plans & usage", to: "/account" as const },
      { label: "Support", href: "mailto:support@neura.ai" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-foreground/5 pt-28">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-foreground/50"
            style={{
              width: i % 5 === 0 ? 2 : 1,
              height: i % 5 === 0 ? 2 : 1,
              left: `${(i * 43) % 100}%`,
              top: `${(i * 29) % 100}%`,
              opacity: 0.15 + (i % 5) / 10,
              animation: `pulse-glow ${4 + (i % 5)}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-[clamp(2.2rem,5.5vw,4.2rem)] font-bold leading-[1]">
            Meet the assistant that <span className="text-gradient">keeps up with you</span>
          </h2>
          <div className="mt-10 flex justify-center">
            <Link
              to="/app"
              onClick={() => localStorage.setItem("neura_demo_session", "true")}
            >
              <MagneticButton>Launch AI</MagneticButton>
            </Link>
          </div>
        </Reveal>

        <div className="mt-24 grid gap-12 border-t border-foreground/5 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/favicon.svg" alt="NEURA - TECH" className="h-7 w-7 rounded-md" />
              <span className="font-display text-sm font-semibold tracking-[0.22em]">NEURA - TECH</span>
            </div>
            <p className="mt-5 max-w-xs text-sm text-muted-foreground">
              An intelligence layer for voice, code, vision and reasoning — built for people who
              make things.
            </p>

            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full glass text-muted-foreground hover:text-cyan-400 hover:border-cyan-500/30 hover:scale-105 transition-all"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((c) => (
            <div key={c.title}>
              <p className="font-display text-xs tracking-[0.3em] text-muted-foreground">
                {c.title.toUpperCase()}
              </p>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link
                        to={l.to}
                        className="text-sm text-foreground/80 transition-colors hover:text-primary"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        className="text-sm text-foreground/80 transition-colors hover:text-primary"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-foreground/5 pt-8 pb-28 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Neura Intelligence. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
