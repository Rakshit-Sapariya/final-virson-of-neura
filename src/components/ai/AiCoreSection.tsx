import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Reveal } from "./Reveal";
import { SceneCanvas } from "./SceneCanvas";
import { LivingNeuralCore } from "./LivingNeuralCore";
import { usePerfTier } from "@/hooks/usePerfTier";
import { Cpu, Layers, Zap, Activity, Radio, Sparkles } from "lucide-react";

interface SpecItem {
  k: string;
  v: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TierData {
  id: string;
  label: string;
  badge: string;
  specs: SpecItem[];
}

const TIERS: TierData[] = [
  {
    id: "lite",
    label: "Lite Tier",
    badge: "ON-DEVICE",
    specs: [
      { k: "Model footprint", v: "596M params", sub: "WebGPU zero-cloud local core", icon: Cpu },
      { k: "Context window", v: "32,768 tokens", sub: "Accelerated on-chip KV cache", icon: Layers },
      { k: "Monthly allowance", v: "555 msgs/mo", sub: "Free tier, unlimited local calls", icon: Zap },
      { k: "Stream throughput", v: "2,000 tokens", sub: "Instant edge token emission", icon: Activity },
    ],
  },
  {
    id: "pro",
    label: "Pro MoE",
    badge: "DISTRIBUTED",
    specs: [
      { k: "Model footprint", v: "70B MoE", sub: "DeepSeek + Claude hybrid mesh", icon: Cpu },
      { k: "Context window", v: "128,000 tokens", sub: "Full code repository memory", icon: Layers },
      { k: "Monthly allowance", v: "Unlimited", sub: "Priority high-throughput pipe", icon: Zap },
      { k: "Stream throughput", v: "8,192 tokens", sub: "Parallel expert generation", icon: Activity },
    ],
  },
  {
    id: "ultra",
    label: "Ultra Neura",
    badge: "DEEP THINK",
    specs: [
      { k: "Model footprint", v: "200B+ MoE", sub: "Multi-pass recursive reasoning", icon: Cpu },
      { k: "Context window", v: "1,000,000 tokens", sub: "Massive multimodal enterprise corpora", icon: Layers },
      { k: "Monthly allowance", v: "High Priority", sub: "Dedicated private GPU allocation", icon: Zap },
      { k: "Stream throughput", v: "32,000 tokens", sub: "Exhaustive reasoning chain buffer", icon: Activity },
    ],
  },
];

export function AiCoreSection() {
  const ref = useRef<HTMLElement>(null);
  const [activeTier, setActiveTier] = useState<string>("lite");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.86, 1.04, 0.9]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  const { coarsePointer, reducedMotion, tier } = usePerfTier();
  const animateScene = !coarsePointer && !reducedMotion;

  const currentTierData = TIERS.find((t) => t.id === activeTier) ?? TIERS[0]!;

  return (
    <section id="core" ref={ref} className="relative min-h-[130svh] w-full">
      <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden py-12">
        {/* Ambient Neural Particle Canvas (Only on capable hardware) */}
        {tier !== "very-low" && tier !== "low" && (
          <motion.div style={animateScene ? { scale, rotate } : {}} className="absolute inset-0">
            <SceneCanvas compact />
          </motion.div>
        )}

        {/* Subtle section background gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Narrative, Interactive Tier Tabs & Telemetry Metrics */}
            <div className="lg:col-span-5 max-w-xl">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-4 shadow-[0_0_15px_rgba(110,231,255,0.2)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-300" />
                  </span>
                  <span>AUTONOMOUS ROUTING MESH</span>
                </div>

                <h2 className="text-[clamp(2.2rem,4.4vw,3.6rem)] font-bold leading-[1.05] text-white">
                  A living <span className="text-gradient">neural core</span>
                </h2>

                <p className="mt-4 text-muted-foreground text-base leading-relaxed">
                  Every request pulses through a self-balancing mesh of expert models. Move your
                  cursor — the core reacts to you in realtime, exactly as the assistant does.
                </p>

                {/* Interactive Tier Switcher Tabs */}
                <div className="mt-6 flex p-1 rounded-xl bg-white/[0.04] border border-white/10 relative">
                  {TIERS.map((tier) => {
                    const isActive = tier.id === activeTier;
                    return (
                      <motion.button
                        key={tier.id}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setActiveTier(tier.id)}
                        className={`relative z-10 flex-1 py-2 px-3 text-xs font-medium tracking-wide transition-colors duration-200 ${
                          isActive ? "text-white font-semibold" : "text-white/50 hover:text-white/80"
                        }`}
                      >
                        {tier.label}
                        {isActive && (
                          <motion.div
                            layoutId="activeCoreTier"
                            className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/25 via-blue-500/20 to-violet-500/25 border border-cyan-400/40 shadow-[0_0_15px_rgba(110,231,255,0.2)] -z-10"
                            transition={{ type: "spring", stiffness: 450, damping: 32 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </Reveal>

              {/* 2x2 Interactive Telemetry Grid with Animated Crossfade */}
              <Reveal delay={0.15} className="mt-6">
                <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/20 via-white/10 to-violet-500/20 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTierData.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-2 gap-px bg-white/[0.06] rounded-2xl overflow-hidden"
                    >
                      {currentTierData.specs.map((s, idx) => (
                        <div
                          key={s.k}
                          className="group relative bg-[#060914]/95 p-5 backdrop-blur-xl transition-all duration-300 hover:bg-[#0a0f24]"
                        >
                          {/* Top Laser Accent on Hover */}
                          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-mono tracking-wider text-muted-foreground uppercase">
                              {s.k}
                            </p>
                            <s.icon className="h-4 w-4 text-cyan-400/70 group-hover:text-cyan-300 transition-colors" />
                          </div>

                          <p className="mt-2.5 font-display text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
                            {s.v}
                          </p>

                          <p className="mt-1 text-[11px] text-muted-foreground/80 leading-relaxed truncate">
                            {s.sub}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Real-time Telemetry Status Bar */}
                <div className="mt-4 flex items-center justify-between px-2 text-xs font-mono text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-emerald-400/90 font-medium">SYNAPTIC DISPATCH OPTIMAL</span>
                  </div>
                  <span className="text-[11px] text-white/40">TIER: {currentTierData.badge}</span>
                </div>
              </Reveal>
            </div>

            {/* Right Column: The Creative Interactive Neural Core Showcase */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end">
              <Reveal delay={0.25} className="w-full flex justify-center lg:justify-end">
                <LivingNeuralCore />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
