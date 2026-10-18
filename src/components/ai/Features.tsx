import { Link } from "@tanstack/react-router";
import {
  HiMicrophone,
  HiCodeBracket,
  HiPhoto,
  HiBolt,
  HiSparkles,
  HiCircleStack,
  HiCpuChip,
  HiSignal,
} from "react-icons/hi2";
import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { useOnScreen } from "@/hooks/useOnScreen";
import { usePerfTier } from "@/hooks/usePerfTier";

const features = [
  {
    icon: HiMicrophone,
    title: "Voice AI",
    body: "Sub-200ms natural speech with interruption handling and 42 languages, streamed end to end.",
    color: "#6ee7ff",
  },
  {
    icon: HiCodeBracket,
    title: "Code Generation",
    body: "Repository-aware engineering: refactors, tests and migrations that compile on the first run.",
    color: "#818cf8",
  },
  {
    icon: HiPhoto,
    title: "Image Generation",
    body: "Brand-locked visual synthesis with style memory, layout control and 4K upscaling.",
    color: "#f472b6",
  },
  {
    icon: HiBolt,
    title: "Automation",
    body: "Trigger-based workflows across 300+ tools — Neura writes, runs and repairs the pipeline.",
    color: "#fbbf24",
  },
  {
    icon: HiSparkles,
    title: "Reasoning",
    body: "Multi-step deliberation with verifiable chains, self-critique and confidence scoring.",
    color: "#34d399",
  },
  {
    icon: HiCircleStack,
    title: "Memory",
    body: "Persistent vector memory that recalls decisions, tone and context across every session.",
    color: "#38bdf8",
  },
  {
    icon: HiCpuChip,
    title: "Agents",
    body: "Spawn specialised agents that plan, delegate and report back with auditable traces.",
    color: "#c084fc",
  },
  {
    icon: HiSignal,
    title: "Realtime Responses",
    body: "Edge inference in 19 regions keeps first-token latency under 90ms worldwide.",
    color: "#fb7185",
  },
];

function FeatureCard({ f, i }: { f: (typeof features)[number]; i: number }) {
  return (
    <div className="w-[300px] shrink-0 sm:w-[330px]">
      <TiltCard className="h-full relative group">
        {/* Dynamic Colored Ambient Radial Glow on Hover */}
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(280px circle at var(--mx,50%) var(--my,50%), ${f.color}22, transparent 70%)`,
          }}
        />

        {/* Number Watermark Badge */}
        <span className="absolute top-5 right-6 text-[11px] font-mono text-muted-foreground/30 font-bold group-hover:text-muted-foreground/60 transition-colors">
          0{((i % 8) + 1)}
        </span>

        {/* Colored Feature Icon with Entrance Bounce */}
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110"
          style={{
            backgroundColor: `${f.color}15`,
            color: f.color,
            boxShadow: `0 0 20px ${f.color}20`,
          }}
        >
          <f.icon className="text-xl" />
        </div>

        {/* Title & Body */}
        <h3 className="mt-6 font-display text-lg font-semibold tracking-tight text-foreground group-hover:text-white transition-colors">
          {f.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {f.body}
        </p>

        {/* Bottom Subtle Glowing Line Indicator */}
        <div
          className="absolute bottom-0 inset-x-8 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`,
          }}
        />
      </TiltCard>
    </div>
  );
}

function TypewriterHeader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-40px" });
  const { is2GBorLower, coarsePointer } = usePerfTier();

  const fullText = "One assistant. Every modality.";
  const splitPoint = "One assistant. ".length; // 15 characters

  const isLowEnd = is2GBorLower || coarsePointer;
  const [charCount, setCharCount] = useState(isLowEnd ? fullText.length : 0);
  const [done, setDone] = useState(isLowEnd);

  useEffect(() => {
    if (!inView || isLowEnd) return;

    let count = 0;
    const timer = setInterval(() => {
      count++;
      setCharCount(count);
      if (count >= fullText.length) {
        clearInterval(timer);
        setTimeout(() => setDone(true), 1200);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [inView, isLowEnd]);

  const part1 = fullText.slice(0, Math.min(charCount, splitPoint));
  const part2 = charCount > splitPoint ? fullText.slice(splitPoint, charCount) : "";

  return (
    <div ref={containerRef} className="relative mx-auto max-w-2xl px-6 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-4 shadow-[0_0_15px_rgba(110,231,255,0.2)]">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>CAPABILITIES</span>
      </div>

      <h2
        suppressHydrationWarning
        className="text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.05] min-h-[1.25em]"
      >
        <span>{part1}</span>
        <span className="text-gradient">{part2}</span>
        <span
          className={`inline-block w-[3px] h-[0.82em] bg-cyan-400 align-middle ml-1 rounded-full shadow-[0_0_10px_#6ee7ff] transition-opacity duration-500 ${
            done ? "opacity-0" : "animate-pulse"
          }`}
        />
      </h2>

      <p className="mt-5 text-muted-foreground leading-relaxed">
        Neura unifies speech, vision, code and reasoning into a single adaptive system that keeps
        learning from the way you work.
      </p>
    </div>
  );
}

export function Features() {
  const [ref, onScreen] = useOnScreen<HTMLElement>();

  return (
    <section id="features" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      {/* Ambient Radial Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />

      <TypewriterHeader />

      {/* Interactive Horizontal Cards (Mobile Native Touch Swipe or Desktop Marquee) */}
      <div className="relative mt-12 sm:mt-16">
        <div className="hidden sm:block pointer-events-none absolute inset-y-0 left-0 z-10 w-32 md:w-44 bg-gradient-to-r from-background to-transparent" />
        <div className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 z-10 w-32 md:w-44 bg-gradient-to-l from-background to-transparent" />

        {/* Mobile Swipe: 0% CPU, 50% fewer DOM nodes, native touch momentum */}
        <div className="sm:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-4 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
          {features.map((f, i) => (
            <div key={f.title} className="snap-center shrink-0">
              <FeatureCard f={f} i={i} />
            </div>
          ))}
        </div>

        {/* Desktop Smooth Marquee */}
        <div
          className={`hidden sm:flex group w-max gap-5 animate-marquee hover:[animation-play-state:paused] ${
            onScreen ? "[animation-play-state:running]" : "[animation-play-state:paused]"
          }`}
        >
          {[...features, ...features].map((f, i) => (
            <FeatureCard key={`${f.title}-${i}`} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
