import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { HiArrowUpRight } from "react-icons/hi2";
import { MagneticButton } from "./MagneticButton";
import { RevealText } from "./Reveal";
import { SceneCanvas, ScenePoster } from "./SceneCanvas";
import { usePerfTier } from "@/hooks/usePerfTier";

export function Hero({ ready = true }: { ready?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { tier, reducedMotion, coarsePointer, is2GBorLower } = usePerfTier();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  // On 2GB phones and very low-end hardware, use the high-efficiency ScenePoster
  const isUltraLite = is2GBorLower || tier === "very-low" || (coarsePointer && tier === "low");
  const parallaxScene = !reducedMotion && !coarsePointer && !isUltraLite && (tier === "mid" || tier === "high");

  return (
    <section id="top" ref={ref} className="relative h-[100svh] w-full overflow-hidden">
      <motion.div style={parallaxScene ? { scale } : {}} className="absolute inset-0">
        {ready ? (isUltraLite ? <ScenePoster /> : <SceneCanvas />) : null}
      </motion.div>

      {/* Subtle bottom fade to blend into the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      {/* light beams */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {[18, 42, 68, 86].map((left, i) => (
          <div
            key={left}
            className="absolute top-[-20%] h-[140%] w-px animate-float-slow bg-gradient-to-b from-transparent via-primary/25 to-transparent"
            style={{ left: `${left}%`, animationDelay: `${i * 1.3}s` }}
          />
        ))}
      </div>

      <motion.div
        style={isUltraLite ? {} : { y, opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >

        <h1 className="max-w-5xl font-display text-[clamp(2.6rem,7.4vw,6.2rem)] font-bold leading-[0.95]">
          <RevealText text="The Future of" />
          <br />
          <span className="text-gradient">
            <RevealText text="Intelligent Assistants" delay={0.25} />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mobile-hero-enter mt-8 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          AI that understands. AI that creates. AI that evolves — a single intelligence layer for
          your work, your voice and your ideas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mobile-hero-enter mt-11 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link to="/app">
            <MagneticButton>
              Launch AI{" "}
              <HiArrowUpRight className="transition-transform group-hover:translate-x-0.5" />
            </MagneticButton>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute inset-x-0 bottom-8 z-10 flex justify-center"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/15 p-1.5">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-primary"
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
