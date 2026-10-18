import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [quick, setQuick] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    // Check if user already loaded Neura this session for instant subsequent loads
    const hasVisited = typeof window !== "undefined" && sessionStorage.getItem("neura_visited");
    const lowEnd =
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(pointer: coarse)").matches ||
        (navigator.hardwareConcurrency ?? 8) <= 4);

    if (hasVisited || lowEnd) {
      setProgress(100);
      setVisible(false);
      doneRef.current();
      return;
    }

    // Call onDone early so Hero and underlying components prepare smoothly in parallel
    doneRef.current();

    const duration = 400; // Snappy 400ms boot pulse instead of 2.4s blocking lag
    const start = Date.now();
    const id = window.setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / duration);
      setProgress(Math.floor(p * 100));
      if (p >= 1) {
        window.clearInterval(id);
        try {
          sessionStorage.setItem("neura_visited", "true");
        } catch {}
        window.setTimeout(() => {
          setVisible(false);
        }, 80);
      }
    }, 40);
    return () => window.clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="mobile-fast-loader fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{ willChange: "opacity" }}
        >
          <div className="absolute inset-0 grid-lines opacity-40" />
          <div className="absolute h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />

          <svg viewBox="0 0 200 200" className="relative h-40 w-40" aria-hidden>
            <defs>
              <linearGradient id="loaderGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--glow)" />
                <stop offset="100%" stopColor="var(--violet)" />
              </linearGradient>
            </defs>
            {[
              [100, 26],
              [164, 63],
              [164, 137],
              [100, 174],
              [36, 137],
              [36, 63],
            ].map(([x, y], i, all) => (
              <g key={i}>
                <motion.line
                  x1={100}
                  y1={100}
                  x2={x}
                  y2={y}
                  stroke="url(#loaderGrad)"
                  strokeWidth={1}
                  initial={{ pathLength: 0, opacity: 0.2 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{
                    duration: 1.1,
                    delay: i * 0.09,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <motion.line
                  x1={x}
                  y1={y}
                  x2={all[(i + 1) % all.length]![0]}
                  y2={all[(i + 1) % all.length]![1]}
                  stroke="url(#loaderGrad)"
                  strokeWidth={0.6}
                  opacity={0.35}
                />
                <motion.circle
                  cx={x}
                  cy={y}
                  r={4}
                  fill="var(--glow)"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.8, delay: i * 0.15, repeat: Infinity }}
                />
              </g>
            ))}
            <motion.circle
              cx={100}
              cy={100}
              r={12}
              fill="url(#loaderGrad)"
              animate={{ scale: [1, 1.16, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              style={{ transformOrigin: "100px 100px" }}
            />
          </svg>

          <div className="relative mt-10 w-56">
            <div className="h-px w-full bg-foreground/10">
              <motion.div
                className="h-px bg-primary"
                style={{ width: `${progress}%`, boxShadow: "var(--shadow-glow)" }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between font-display text-xs tracking-[0.3em] text-muted-foreground">
              <span>INITIALIZING NEURA</span>
              <span className="text-foreground">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
