import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { usePerfTier } from "@/hooks/usePerfTier";
import {
  TrendingUp,
  Zap,
  Globe,
  Clock,
  Sparkles,
  Cpu,
  Layers,
} from "lucide-react";

const stats = [
  {
    value: 4.2,
    suffix: "M",
    label: "Tasks automated weekly",
    subtext: "Across enterprise engineering pipelines",
    icon: TrendingUp,
  },
  {
    value: 89,
    suffix: "ms",
    label: "Median first-token latency",
    subtext: "Streaming response time worldwide",
    icon: Zap,
  },
  {
    value: 99.99,
    suffix: "%",
    label: "Uptime across 19 regions",
    subtext: "Multi-cloud redundant failover",
    icon: Globe,
  },
  {
    value: 62,
    suffix: "%",
    label: "Average time saved per team",
    subtext: "Measured over 10,000+ developer sprints",
    icon: Clock,
  },
];

const timeline = [
  {
    badge: "ALPHA FOUNDATION",
    year: "Private beta",
    title: "Built for depth, not demos",
    body: "Neura started as an internal reasoning engine for research teams handling million-token corpora.",
    tags: ["Million-Token Corpora", "Internal Reasoning Engine", "Pure Determinism"],
    icon: Cpu,
  },
  {
    badge: "INFRASTRUCTURE LEAP",
    year: "Scale phase",
    title: "Edge inference everywhere",
    body: "We rebuilt serving on custom kernels, cutting latency 7x and cost 4x without quality loss.",
    tags: ["Custom CUDA Kernels", "7x Latency Cut", "Edge Routing"],
    icon: Layers,
  },
  {
    badge: "PRODUCTION RUNTIME",
    year: "Today",
    title: "One assistant, every surface",
    body: "Voice, code, vision and agents share one persistent memory so context never has to be repeated.",
    tags: ["Unified Shared Memory", "Cross-Modal Reflexes", "Autonomous Agents"],
    icon: Sparkles,
    current: true,
  },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { is2GBorLower, coarsePointer } = usePerfTier();
  const isLowEnd = is2GBorLower || coarsePointer;
  const [display, setDisplay] = useState(isLowEnd ? value : 0);

  useEffect(() => {
    if (!inView || isLowEnd) return;
    const duration = 1200;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, isLowEnd]);

  const decimals = value % 1 !== 0 ? 2 : 0;

  return (
    <span
      ref={ref}
      className="font-display text-[clamp(2.4rem,4.2vw,3.4rem)] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400"
    >
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function WhyUs() {
  return (
    <section id="why" className="relative overflow-hidden py-32 bg-[#030712]/50">
      {/* 2D Background Cyber Grid & Floating Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(rgba(110, 231, 255, 0.4) 1px, transparent 1px), radial-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        }}
      />
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px] animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[28rem] w-[28rem] rounded-full bg-violet-600/10 blur-[130px] animate-pulse" style={{ animationDuration: "10s" }} />

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono tracking-wider text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            WHY NEURA
          </div>
          <h2 className="mt-4 text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.08] text-white">
            Engineered for teams that <span className="text-gradient">ship</span>
          </h2>
          <p className="mt-3 text-sm text-slate-300/80 max-w-xl">
            Reliability benchmarks and architectural milestones designed to run continuously in production.
          </p>
        </Reveal>

        {/* 2D Animated Glass Stat Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(110,231,255,0.12)]"
              >
                {/* Top Animated Shimmer Highlight */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-400 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10 transition-colors">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                    LIVE TELEMETRY
                  </span>
                </div>

                <div className="mt-6">
                  <Counter value={s.value} suffix={s.suffix} />
                  <p className="mt-2 text-sm font-semibold text-white/90">{s.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.subtext}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Architectural Milestones (Clean 3-column grid without vertical line) */}
        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {timeline.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(110,231,255,0.1)] h-full"
              >
                {/* Top Accent Shimmer */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-400 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10 transition-colors">
                      <t.icon className="h-5 w-5" />
                    </div>
                    {t.current ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE NOW
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-mono tracking-wider text-white/50">
                        {t.badge}
                      </span>
                    )}
                  </div>

                  <span className="font-mono text-xs tracking-wider text-cyan-400 font-semibold uppercase">
                    {t.year}
                  </span>

                  <h3 className="mt-2 font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {t.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-300/80">
                    {t.body}
                  </p>
                </div>

                {/* Feature Highlight Tags */}
                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-xs text-slate-300/80 group-hover:border-cyan-400/20 transition-colors"
                    >
                      <span className="h-1 w-1 rounded-full bg-cyan-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
