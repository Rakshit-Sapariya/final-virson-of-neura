import { createFileRoute, Link } from "@tanstack/react-router";
import { canonical } from "@/lib/site";
import { SmoothScroll } from "@/components/ai/SmoothScroll";
import { Cursor } from "@/components/ai/Cursor";
import { Nav } from "@/components/ai/Nav";
import { Features } from "@/components/ai/Features";
import { Showcase } from "@/components/ai/Showcase";
import { Footer } from "@/components/ai/Footer";
import { Reveal } from "@/components/ai/Reveal";
import { MagneticButton } from "@/components/ai/MagneticButton";
import { HiSparkles, HiArrowRight, HiBolt } from "react-icons/hi2";

const title = "Capabilities & Interactive Runtime — Neura AI";
const description =
  "Deep dive into Neura's multimodal capabilities: adaptive voice duplex, side-by-side code execution canvas, persistent vector memory, and private client inference.";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/features") }],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
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
            background: "radial-gradient(circle, rgba(110,231,255,0.4) 0%, rgba(124,58,237,0.3) 50%, transparent 80%)",
          }}
        />

        {/* Page Hero Header */}
        <section className="relative mx-auto max-w-5xl px-6 text-center mb-12">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-6 shadow-[0_0_20px_rgba(110,231,255,0.15)]">
              <HiSparkles className="h-3.5 w-3.5" />
              <span>PAGE 2 OF 5 · CAPABILITIES & RUNTIME</span>
            </div>

            <h1 className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold tracking-tight leading-[1.05]">
              Intelligence that Speaks, Codes,{" "}
              <span className="text-gradient">Analyzes & Evolves</span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
              Explore how Neura unifies dual-engine speech duplex, side-by-side code execution canvas,
              autonomous vector memory, and private client-side WebGPU acceleration into one adaptive layer.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/app"
                onClick={() => localStorage.setItem("neura_demo_session", "true")}
              >
                <MagneticButton className="px-6 py-3 font-semibold text-sm">
                  Launch Assistant Free
                </MagneticButton>
              </Link>
              <Link to="/models">
                <MagneticButton variant="ghost" className="px-5 py-3 text-xs text-muted-foreground hover:text-white">
                  <span>Explore Model Mesh</span>
                  <HiArrowRight className="ml-1 text-xs" />
                </MagneticButton>
              </Link>
            </div>
          </Reveal>
        </section>

        {/* Core Features Grid Section */}
        <Features />

        {/* Live Interactive Showcase & Terminal Stream */}
        <Showcase />

        {/* Bottom Conversion Banner */}
        <section className="relative mx-auto max-w-5xl px-6 py-24">
          <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-white/[0.04] to-black/60 p-8 sm:p-14 text-center backdrop-blur-xl shadow-[0_0_50px_rgba(110,231,255,0.1)]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-4">
              <HiBolt className="h-3.5 w-3.5" />
              <span>LIVE DEMO AVAILABLE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Ready to experience these capabilities in your browser?
            </h2>
            <p className="max-w-xl mx-auto text-sm text-muted-foreground mb-8">
              No complex setup or credit card required. Launch the Neura workspace and test voice duplex,
              Canvas preview, and fast LPU reasoning immediately.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/app"
                onClick={() => localStorage.setItem("neura_demo_session", "true")}
              >
                <MagneticButton className="px-8 py-3.5 text-sm font-bold">
                  Open Neura AI Workspace
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
