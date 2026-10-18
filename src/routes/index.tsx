import { createFileRoute, Link } from "@tanstack/react-router";
import { canonical } from "@/lib/site";
import { useState } from "react";
import { SmoothScroll } from "@/components/ai/SmoothScroll";
import { Cursor } from "@/components/ai/Cursor";
import { Loader } from "@/components/ai/Loader";
import { Nav } from "@/components/ai/Nav";
import { Hero } from "@/components/ai/Hero";
import { AiCoreSection } from "@/components/ai/AiCoreSection";
import { Testimonials } from "@/components/ai/Testimonials";
import { Footer } from "@/components/ai/Footer";
import { Reveal } from "@/components/ai/Reveal";
import { MagneticButton } from "@/components/ai/MagneticButton";
import {
  HiSparkles,
  HiCpuChip,
  HiCommandLine,
  HiCreditCard,
  HiArrowRight,
  HiBolt,
} from "react-icons/hi2";

const title = "Neura — The Future of Intelligent Assistants";
const description =
  "Neura is an AI assistant that understands, creates and evolves: realtime voice, code generation, reasoning agents and persistent memory in one adaptive intelligence layer.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/") }],
  }),
  component: Index,
});

const pages = [
  {
    pageNumber: "02",
    title: "Capabilities & Interactive Runtime",
    path: "/features",
    icon: HiSparkles,
    badge: "Voice · Canvas · Memory",
    color: "#6ee7ff",
    description:
      "Deep dive into real-time duplex speech, live side-by-side code execution canvas, and cross-session vector indexing.",
  },
  {
    pageNumber: "03",
    title: "Model Mesh & Cognitive Routing",
    path: "/models",
    icon: HiCpuChip,
    badge: "550B Nemotron · Claude 3.7",
    color: "#c084fc",
    description:
      "Explore dynamic intent routing across 19 global edge clusters, sub-15ms Groq LPUs, and private in-browser WebGPU.",
  },
  {
    pageNumber: "04",
    title: "Developer Tools & Ecosystem",
    path: "/integrations",
    icon: HiCommandLine,
    badge: "15+ Native Tools",
    color: "#38bdf8",
    description:
      "Connect Neura seamlessly with GitHub, VS Code, Supabase, Slack, Docker, Postgres, Discord, and REST OpenAPI webhooks.",
  },
  {
    pageNumber: "05",
    title: "Transparent Pricing & FAQ",
    path: "/pricing",
    icon: HiCreditCard,
    badge: "$0 Free · $12 Pro",
    color: "#34d399",
    description:
      "Fair cost arbitrage pricing with 84.5% GPU efficiency passed to you. Interactive workload slider and comprehensive FAQ.",
  },
];

function Index() {
  const [ready, setReady] = useState(false);

  return (
    <SmoothScroll>
      <Loader onDone={() => setReady(true)} />
      <Cursor />
      <Nav />
      <main id="main-content" className="relative">
        {/* Hero Section */}
        <Hero ready={ready} />

        {/* Neural Core Interactive Cockpit */}
        <AiCoreSection />

        {/* 5-Page Hub & Ecosystem Navigator */}
        <section className="relative mx-auto max-w-7xl px-6 py-28">
          <Reveal className="mx-auto max-w-3xl text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-4 shadow-[0_0_15px_rgba(110,231,255,0.15)]">
              <HiBolt className="h-3.5 w-3.5" />
              <span>EXPLORE THE NEURA PLATFORM</span>
            </div>
            <h2 className="text-[clamp(2.2rem,4.4vw,3.6rem)] font-bold leading-[1.05]">
              Dedicated Architectural <span className="text-gradient">Explorations</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Neura is organized into 5 focused modules. Explore each deep-dive page or launch the AI workspace directly.
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {pages.map((p, idx) => (
              <Reveal key={p.path} delay={idx * 0.1}>
                <Link
                  to={p.path}
                  className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:border-cyan-500/40 hover:bg-white/[0.04] hover:shadow-[0_0_35px_rgba(110,231,255,0.12)]"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="flex items-center gap-2 text-xs font-mono text-muted-foreground group-hover:text-cyan-300 transition-colors">
                      <span className="font-bold text-white/40">PAGE {p.pageNumber}</span>
                      <span>·</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-cyan-300">
                        {p.badge}
                      </span>
                    </span>
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.05] transition-transform duration-300 group-hover:scale-110"
                      style={{ color: p.color }}
                    >
                      <p.icon className="h-5 w-5" />
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {p.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                    {p.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore Page</span>
                    <HiArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Social Proof & Testimonials */}
        <Testimonials />

        {/* Global Launch Callout */}
        <section className="relative mx-auto max-w-5xl px-6 py-20 text-center">
          <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-white/[0.03] to-black/80 p-8 sm:p-14 backdrop-blur-xl">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Step into the intelligence layer today
            </h2>
            <p className="max-w-xl mx-auto text-sm text-muted-foreground mb-8">
              Experience the dual-engine voice model, real-time code generation, and 550B Nemotron-3 Ultra reasoning.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/app"
                onClick={() => localStorage.setItem("neura_demo_session", "true")}
              >
                <MagneticButton className="px-8 py-3.5 text-sm font-bold">
                  Launch Neura AI Free
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
