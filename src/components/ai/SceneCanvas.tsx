import { useEffect, useRef } from "react";
import { usePerfTier } from "@/hooks/usePerfTier";

export function ScenePoster() {
  return (
    <div aria-hidden className="relative h-full w-full overflow-hidden bg-background pointer-events-none">
      {/* Sleek Ambient Aurora Glows */}
      <div
        className="absolute -top-1/4 left-1/2 h-[70vw] w-[70vw] max-w-[700px] -translate-x-1/2 rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(110, 231, 255, 0.4) 0%, rgba(124, 58, 237, 0.22) 40%, transparent 68%)",
        }}
      />
      <div
        className="absolute top-1/3 left-1/4 h-[45vw] w-[45vw] max-w-[450px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(56, 189, 248, 0.12) 45%, transparent 68%)",
        }}
      />

      {/* Cyber Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Radial vignette fade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 45%, rgba(5, 5, 5, 0.9) 100%)",
        }}
      />

      {/* Static Ultra-Lite Constellation (Pure SVG, 0% CPU, 0% RAM on 2GB devices) */}
      <svg className="absolute inset-0 h-full w-full opacity-60" xmlns="http://www.w3.org/2000/svg">
        <line x1="20%" y1="30%" x2="35%" y2="45%" stroke="#6ee7ff" strokeOpacity="0.25" strokeWidth="1" />
        <line x1="35%" y1="45%" x2="55%" y2="40%" stroke="#38bdf8" strokeOpacity="0.25" strokeWidth="1" />
        <line x1="55%" y1="40%" x2="75%" y2="28%" stroke="#818cf8" strokeOpacity="0.25" strokeWidth="1" />
        <line x1="55%" y1="40%" x2="65%" y2="60%" stroke="#a855f7" strokeOpacity="0.25" strokeWidth="1" />
        <line x1="35%" y1="45%" x2="40%" y2="70%" stroke="#6ee7ff" strokeOpacity="0.25" strokeWidth="1" />
        <line x1="40%" y1="70%" x2="65%" y2="60%" stroke="#818cf8" strokeOpacity="0.25" strokeWidth="1" />
        <line x1="75%" y1="28%" x2="85%" y2="50%" stroke="#a855f7" strokeOpacity="0.25" strokeWidth="1" />

        <circle cx="20%" cy="30%" r="3" fill="#6ee7ff" />
        <circle cx="35%" cy="45%" r="3.5" fill="#38bdf8" />
        <circle cx="55%" cy="40%" r="4" fill="#6ee7ff" />
        <circle cx="75%" cy="28%" r="3" fill="#818cf8" />
        <circle cx="65%" cy="60%" r="3.5" fill="#a855f7" />
        <circle cx="40%" cy="70%" r="2.5" fill="#38bdf8" />
        <circle cx="85%" cy="50%" r="2.5" fill="#a855f7" />
      </svg>
    </div>
  );
}

export function SceneCanvas({ compact = false }: { compact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tier, reducedMotion } = usePerfTier();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number = 0;
    let width = 0;
    let height = 0;
    let isVisible = true;

    // Adapt DPR and particle counts to device capabilities
    const isLowEnd = tier === "very-low" || tier === "low";
    const dpr = isLowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 1.35);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Adaptive particle definition
    const nodeCount = isLowEnd ? (compact ? 12 : 24) : (compact ? 22 : 42);
    const maxDistance = compact ? 85 : 120;
    const maxDistanceSq = maxDistance * maxDistance;

    type Node = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseRadius: number;
      pulseSpeed: number;
      pulse: number;
      color: string;
      glowColor: string;
    };

    const colorConfig = [
      { color: "#6ee7ff", glow: "rgba(110, 231, 255, 0.22)" },
      { color: "#38bdf8", glow: "rgba(56, 189, 248, 0.22)" },
      { color: "#818cf8", glow: "rgba(129, 140, 248, 0.22)" },
      { color: "#a855f7", glow: "rgba(168, 85, 247, 0.22)" },
    ];

    const nodes: Node[] = [];
    const w = width || window.innerWidth || 800;
    const h = height || window.innerHeight || 600;

    for (let i = 0; i < nodeCount; i++) {
      const c = colorConfig[i % colorConfig.length];
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        baseRadius: Math.random() * 1.4 + 1.2,
        pulseSpeed: Math.random() * 0.02 + 0.012,
        pulse: Math.random() * Math.PI,
        color: c.color,
        glowColor: c.glow,
      });
    }

    let mouse = { x: -2000, y: -2000, active: false };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });

    // Pause rendering entirely when scrolled out of view!
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = !!entry?.isIntersecting;
        if (isVisible && !animId) {
          animId = requestAnimationFrame(render);
        }
      },
      { rootMargin: "100px" }
    );
    observer.observe(canvas);

    const render = () => {
      if (!isVisible) {
        animId = 0;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Single batched draw call for all synaptic connection lines
      ctx.beginPath();
      ctx.strokeStyle = "rgba(110, 231, 255, 0.16)";
      ctx.lineWidth = 1;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;

          // Fast bounding box reject before multiplying
          if (Math.abs(dx) > maxDistance || Math.abs(dy) > maxDistance) continue;

          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistanceSq) {
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
          }
        }
      }
      ctx.stroke();

      // Mouse interactive synaptic connections (if pointer active)
      if (mouse.active) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(168, 85, 247, 0.32)";
        ctx.lineWidth = 1.2;
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          const mdx = a.x - mouse.x;
          const mdy = a.y - mouse.y;
          if (Math.abs(mdx) > 170 || Math.abs(mdy) > 170) continue;
          const mdistSq = mdx * mdx + mdy * mdy;
          if (mdistSq < 170 * 170) {
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            // Gentle cursor attraction
            a.x -= (mdx / 170) * 0.2;
            a.y -= (mdy / 170) * 0.2;
          }
        }
        ctx.stroke();
      }

      // Draw nodes: Fast two-pass glow instead of CPU-hogging ctx.shadowBlur
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.pulse += a.pulseSpeed;
        const currentRadius = a.baseRadius + Math.sin(a.pulse) * 0.45;

        // Outer soft glow halo
        ctx.fillStyle = a.glowColor;
        ctx.beginPath();
        ctx.arc(a.x, a.y, currentRadius * 2.4, 0, Math.PI * 2);
        ctx.fill();

        // Inner solid core
        ctx.fillStyle = a.color;
        ctx.beginPath();
        ctx.arc(a.x, a.y, Math.max(0.8, currentRadius), 0, Math.PI * 2);
        ctx.fill();

        // Position update
        a.x += a.vx;
        a.y += a.vy;

        if (a.x < 0) a.x = width;
        else if (a.x > width) a.x = 0;
        if (a.y < 0) a.y = height;
        else if (a.y > height) a.y = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [compact, tier, reducedMotion]);

  return (
    <div className="relative h-full w-full overflow-hidden pointer-events-none">
      {/* Sleek Deep Aurora Ambient Glows without heavy CPU blur */}
      <div
        className="pointer-events-none absolute -top-1/4 left-1/2 h-[70vw] w-[70vw] max-w-[800px] -translate-x-1/2 rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(110, 231, 255, 0.4) 0%, rgba(124, 58, 237, 0.22) 40%, transparent 68%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-1/3 left-1/4 h-[45vw] w-[45vw] max-w-[500px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(56, 189, 248, 0.12) 45%, transparent 68%)",
        }}
      />

      {/* Cyber Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Radial vignette fade around edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 45%, rgba(5, 5, 5, 0.9) 100%)",
        }}
      />

      {/* Interactive Neural Synapse Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />
    </div>
  );
}
