import { useEffect, useRef, useState } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...target };
    let hovering = false;
    let frame = 0;
    let running = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target as HTMLElement | null;
      hovering = !!el?.closest("a,button,[data-cursor='hover']");
      start();
    };

    const loop = () => {
      const dx = target.x - ring.x;
      const dy = target.y - ring.y;
      ring.x += dx * 0.14;
      ring.y += dy * 0.14;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x - 3}px, ${target.y - 3}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x - 20}px, ${ring.y - 20}px, 0) scale(${hovering ? 1.6 : 1})`;
        ringRef.current.style.opacity = hovering ? "1" : "0.55";
      }
      // Idle: stop the rAF loop entirely instead of burning a frame forever.
      if (Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-10 w-10 rounded-full border border-primary/60 transition-[opacity] duration-300"
        style={{ boxShadow: "var(--shadow-glow)" }}
      />
      <div ref={dotRef} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-primary" />
    </div>
  );
}
