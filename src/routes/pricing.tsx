import { createFileRoute, Link } from "@tanstack/react-router";
import { canonical } from "@/lib/site";
import { SmoothScroll } from "@/components/ai/SmoothScroll";
import { Cursor } from "@/components/ai/Cursor";
import { useSession } from "@/hooks/useSession";
import { Pricing } from "@/components/ai/Pricing";
import { FAQ } from "@/components/ai/FAQ";
import { Footer } from "@/components/ai/Footer";
import { Reveal } from "@/components/ai/Reveal";
import { MagneticButton } from "@/components/ai/MagneticButton";
import { HiCreditCard, HiArrowRight, HiShieldCheck } from "react-icons/hi2";

const title = "Pricing & Intelligence Tiers — Neura AI";
const description =
  "Simple, transparent pricing for individuals, high-output teams, and enterprises. Start free, upgrade to Pro for $12/month, or deploy dedicated private VPC clusters.";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/pricing") }],
  }),
  component: PricingPage,
});

function PricingPage() {
  const { isAuthenticated } = useSession();

  return (
    <SmoothScroll>
      <Cursor />
      {/* Top Header for Pricing Page (Replacing Bottom Dock) */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#05070f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-500/10 shadow-[0_0_12px_rgba(52,211,153,0.25)]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping" />
              <span className="absolute h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            <span className="font-display text-sm font-bold tracking-[0.24em] text-white">
              NEURA
            </span>
            <span className="ml-2 rounded-full border border-emerald-400/30 bg-emerald-950/40 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              PRICING
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link
              to="/"
              className="text-xs font-medium text-white/60 transition-colors hover:text-white"
            >
              Overview
            </Link>
            <Link
              to="/features"
              className="text-xs font-medium text-white/60 transition-colors hover:text-white"
            >
              Capabilities
            </Link>
            <Link
              to="/models"
              className="text-xs font-medium text-white/60 transition-colors hover:text-white"
            >
              Models
            </Link>
            <Link
              to="/integrations"
              className="text-xs font-medium text-white/60 transition-colors hover:text-white"
            >
              Integrations
            </Link>
            <Link
              to="/pricing"
              className="text-xs font-semibold text-emerald-400"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  className="rounded-xl border border-white/10 px-3.5 py-2 text-xs font-medium text-white/80 transition-colors hover:border-emerald-400/40 hover:bg-white/[0.04] hover:text-white"
                >
                  Account
                </Link>
                <Link
                  to="/app"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-xs font-semibold text-black shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all hover:shadow-[0_0_25px_rgba(52,211,153,0.5)]"
                >
                  <span>Open Assistant</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="rounded-xl border border-white/10 px-3.5 py-2 text-xs font-medium text-white/80 transition-colors hover:border-emerald-400/40 hover:bg-white/[0.04] hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/app"
                  onClick={() => localStorage.setItem("neura_demo_session", "true")}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 text-xs font-bold text-black shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all hover:shadow-[0_0_25px_rgba(52,211,153,0.5)]"
                >
                  <span>Launch AI</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main id="main-content" className="relative min-h-screen pt-12 sm:pt-16">
        {/* Ambient Top Aurora Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[800px] -translate-x-1/2 rounded-full blur-[160px] opacity-25"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(110,231,255,0.3) 50%, transparent 80%)",
          }}
        />

        {/* Page Hero Header */}
        <section className="relative mx-auto max-w-5xl px-6 text-center mb-8">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-6 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <HiCreditCard className="h-3.5 w-3.5" />
              <span>PAGE 5 OF 5 · PRICING & COMMERCIAL TIERS</span>
            </div>

            <h1 className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold tracking-tight leading-[1.05]">
              Transparent Intelligence Tiers.{" "}
              <span className="text-gradient">Zero Overages.</span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
              Neura's dynamic multi-model routing passes infrastructure cost savings directly to you.
              Explore our permanent free explorer tier, Pro builder membership, and custom dedicated VPC deployments.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/app"
                onClick={() => localStorage.setItem("neura_demo_session", "true")}
              >
                <MagneticButton className="px-6 py-3 font-semibold text-sm">
                  Start Free Explorer Tier
                </MagneticButton>
              </Link>
              <Link to="/features">
                <MagneticButton variant="ghost" className="px-5 py-3 text-xs text-muted-foreground hover:text-white">
                  <span>Review Features</span>
                  <HiArrowRight className="ml-1 text-xs" />
                </MagneticButton>
              </Link>
            </div>
          </Reveal>
        </section>

        {/* Interactive Pricing Cards with Slider & Modals */}
        <Pricing />

        {/* Interactive FAQ Section */}
        <FAQ />

        {/* Bottom Conversion Banner */}
        <section className="relative mx-auto max-w-5xl px-6 py-24">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-white/[0.04] to-black/60 p-8 sm:p-14 text-center backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.1)]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-4">
              <HiShieldCheck className="h-3.5 w-3.5" />
              <span>ENTERPRISE-GRADE SECURITY & COMPLIANCE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Need custom VPC or dedicated on-premises hardware?
            </h2>
            <p className="max-w-xl mx-auto text-sm text-muted-foreground mb-8">
              We deploy air-gapped private clusters on AWS, GCP, Azure, or bare-metal Groq LPUs with 100% data residency guarantees and zero telemetry.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/app"
                onClick={() => localStorage.setItem("neura_demo_session", "true")}
              >
                <MagneticButton className="px-8 py-3.5 text-sm font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-black">
                  Launch Neura Workspace
                </MagneticButton>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
