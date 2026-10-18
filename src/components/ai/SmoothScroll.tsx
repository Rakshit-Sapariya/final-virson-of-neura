import { useEffect, type ReactNode } from "react";
import { usePerfTier } from "@/hooks/usePerfTier";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const { tier, reducedMotion, coarsePointer, saveData, probing } = usePerfTier();

  // Lenis hijacks scrolling with a per-frame rAF loop. On touch devices and
  // low-end hardware native scrolling is both smoother and far cheaper, so we
  // only enable it for pointer-driven mid/high tier devices.
  const enabled =
    !probing &&
    !reducedMotion &&
    !coarsePointer &&
    !saveData &&
    (tier === "mid" || tier === "high");

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let frame = 0;
    let destroy: (() => void) | undefined;

    // Code-split: the smooth-scroll library never reaches low-end bundles.
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      const raf = (time: number) => {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
      destroy = () => {
        cancelAnimationFrame(frame);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [enabled]);

  return <>{children}</>;
}
