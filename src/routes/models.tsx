import { createFileRoute, Link } from "@tanstack/react-router";
import { canonical } from "@/lib/site";
import { SmoothScroll } from "@/components/ai/SmoothScroll";
import { Cursor } from "@/components/ai/Cursor";
import { Nav } from "@/components/ai/Nav";
import { Models } from "@/components/ai/Models";
import { WhyUs } from "@/components/ai/WhyUs";
import { Footer } from "@/components/ai/Footer";
import { Reveal } from "@/components/ai/Reveal";
import { MagneticButton } from "@/components/ai/MagneticButton";
import { HiCpuChip, HiArrowRight, HiBolt } from "react-icons/hi2";

const title = "Model Mesh & Dynamic Routing — NEURA - TECH";
const description =
  "Explore Neura's dynamic multi-tier neural mesh: Neura Ultra, Neura DeepMind, Neura Omni Vision, Hyper-Speed LPUs, and private WebGPU in-browser inference.";

export const Route = createFileRoute("/models")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/models") }],
  }),
  component: ModelsPage,
});

function ModelsPage() {
  return (
    <SmoothScroll>
      <Cursor />
      <Nav />
      <main id="main-content" className="relative min-h-screen pt-16 sm:pt-20">
        {/* Ambient Top Aurora Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[800px] -translate-x-1/2 rounded-full blur-[160px] opacity-25"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(110,231,255,0.25) 50%, transparent 80%)",
          }}
        />

        {/* Page Hero Header */}
        <section className="relative mx-auto max-w-5xl px-6 text-center mb-12">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-6 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <HiCpuChip className="h-3.5 w-3.5" />
              <span>PAGE 3 OF 5 · MULTI-MODEL MESH & CLUSTERS</span>
            </div>

            <h1 className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold tracking-tight leading-[1.05]">
              The Right Model for Every Prompt.{" "}
              <span className="text-gradient">Automatically.</span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
              Why settle for one LLM when you can harness the best of all worlds? Neura dynamically routes
              each request based on required latency, context length, and mathematical reasoning depth.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/app"
                onClick={() => localStorage.setItem("neura_demo_session", "true")}
              >
                <MagneticButton className="px-6 py-3 font-semibold text-sm">
                  Test Model Mesh Live
                </MagneticButton>
              </Link>
              <Link to="/pricing">
                <MagneticButton variant="ghost" className="px-5 py-3 text-xs text-muted-foreground hover:text-white">
                  <span>View Pricing & Tiers</span>
                  <HiArrowRight className="ml-1 text-xs" />
                </MagneticButton>
              </Link>
            </div>
          </Reveal>
        </section>

        {/* Multi-Model Cards Section */}
        <Models />

        {/* WhyUs & Architecture Benchmarks Section */}
        <WhyUs />

        {/* Bottom Conversion Banner */}
        <section className="relative mx-auto max-w-5xl px-6 py-24">
          <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-b from-white/[0.04] to-black/60 p-8 sm:p-14 text-center backdrop-blur-xl shadow-[0_0_50px_rgba(168,85,247,0.1)]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-4">
              <HiBolt className="h-3.5 w-3.5" />
              <span>SUB-SECOND TOKEN GENERATION</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Switch models mid-conversation with zero friction
            </h2>
            <p className="max-w-xl mx-auto text-sm text-muted-foreground mb-8">
              Start with sub-second Neura Hyper-Speed LPUs for quick brainstorming, switch seamlessly to Neura Ultra Deep Core
              for complex math proofs, and keep your full memory intact.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/app"
                onClick={() => localStorage.setItem("neura_demo_session", "true")}
              >
                <MagneticButton className="px-8 py-3.5 text-sm font-bold bg-gradient-to-r from-purple-500 to-cyan-400 text-black">
                  Launch Neura Assistant
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
