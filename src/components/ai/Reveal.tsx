import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { usePerfTier } from "@/hooks/usePerfTier";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { coarsePointer, reducedMotion } = usePerfTier();
  const lightweight = coarsePointer || reducedMotion;
  const hidden = { opacity: 0, y: reducedMotion ? 0 : Math.min(y, 16) };
  const shown = { opacity: 1, y: 0 };

  return (
    <motion.div
      ref={ref}
      className={["mobile-reveal", className].filter(Boolean).join(" ")}
      initial={hidden}
      animate={inView ? shown : hidden}
      style={{ willChange: "transform, opacity" }}
      transition={{ duration: lightweight ? 0.35 : 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function RevealText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="mobile-reveal-word inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 1,
              delay: delay + i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
