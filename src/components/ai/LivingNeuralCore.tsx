import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePerfTier } from "@/hooks/usePerfTier";
import { useOnScreen } from "@/hooks/useOnScreen";
import {
  Brain,
  Cpu,
  Sparkles,
  Zap,
  Activity,
  Eye,
  Code2,
  Radio,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

interface ModelNode {
  id: string;
  name: string;
  provider: string;
  specialty: string;
  color: string;
  glowColor: string;
  x: number; // percentage in SVG coordinate space (0-100)
  y: number;
  icon: React.ComponentType<{ className?: string }>;
  latency: string;
  tokensPerSec: string;
  accuracy: string;
  description: string;
}

const EXPERT_MODELS: ModelNode[] = [
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    provider: "Reasoning Engine",
    specialty: "Mathematical Logic & Deep Reasoning",
    color: "#6ee7ff",
    glowColor: "rgba(110, 231, 255, 0.4)",
    x: 78,
    y: 24,
    icon: Brain,
    latency: "14ms",
    tokensPerSec: "128 t/s",
    accuracy: "98.4%",
    description: "Multi-head latent attention reasoning cluster synthesizing complex multi-step deductions.",
  },
  {
    id: "claude-3-7",
    name: "Claude 3.7",
    provider: "Code Architecture",
    specialty: "Full-Stack & Systems Engineering",
    color: "#c084fc",
    glowColor: "rgba(192, 132, 252, 0.4)",
    x: 78,
    y: 74,
    icon: Code2,
    latency: "22ms",
    tokensPerSec: "95 t/s",
    accuracy: "99.1%",
    description: "Deep code analysis, semantic refactoring, and AST verification with extended context.",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o Omni",
    provider: "Multimodal Vision",
    specialty: "Spatial, Video & Audio Perception",
    color: "#34d399",
    glowColor: "rgba(52, 211, 153, 0.4)",
    x: 22,
    y: 74,
    icon: Eye,
    latency: "19ms",
    tokensPerSec: "140 t/s",
    accuracy: "97.8%",
    description: "Real-time cross-modal sensory fusion bridging vision, audio waveforms, and token streams.",
  },
  {
    id: "groq-llama",
    name: "Groq Llama 3.3",
    provider: "Hyper-Router",
    specialty: "Ultra-Fast Inference & Routing",
    color: "#fbbf24",
    glowColor: "rgba(251, 191, 36, 0.4)",
    x: 22,
    y: 24,
    icon: Zap,
    latency: "6ms",
    tokensPerSec: "385 t/s",
    accuracy: "96.2%",
    description: "LPUs executing zero-wait dispatch with deterministic token streaming at lightspeed.",
  },
  {
    id: "neura-lite",
    name: "Neura Lite",
    provider: "WebGPU Local Core",
    specialty: "On-Device Zero-Cloud Privacy",
    color: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.4)",
    x: 50,
    y: 14,
    icon: Cpu,
    latency: "0ms",
    tokensPerSec: "82 t/s",
    accuracy: "94.5%",
    description: "Locally compiled shaders running directly on your machine's GPU without internet connection.",
  },
];

export function LivingNeuralCore() {
  const [containerRef, onScreen] = useOnScreen<HTMLDivElement>("150px");
  const { tier, coarsePointer } = usePerfTier();
  const isLowEnd = tier === "very-low" || tier === "low";

  const [activeModelId, setActiveModelId] = useState<string>("deepseek-r1");
  const [isPulsing, setIsPulsing] = useState<boolean>(false);
  const [pulseCount, setPulseCount] = useState<number>(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const activeModel =
    EXPERT_MODELS.find((m) => m.id === activeModelId) || EXPERT_MODELS[0];

  // Mouse parallax (only on desktop/capable hardware)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLowEnd || coarsePointer || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: x * 14, y: y * 14 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Trigger quantum pulse
  const triggerPulse = () => {
    if (isPulsing) return;
    setIsPulsing(true);
    setPulseCount((prev) => prev + 1);
    setTimeout(() => {
      setIsPulsing(false);
    }, 1200);
  };

  // Automatic gentle pulse every 9 seconds only if on-screen and idle
  useEffect(() => {
    if (!onScreen || isLowEnd) return;
    const timer = setInterval(() => {
      if (!isPulsing) {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 1200);
      }
    }, 9000);
    return () => clearInterval(timer);
  }, [isPulsing, onScreen, isLowEnd]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[620px] select-none perspective-1000"
    >
      {/* 3D Tilting Frame */}
      <motion.div
        animate={
          isLowEnd || coarsePointer
            ? {}
            : {
                rotateX: -mouseOffset.y,
                rotateY: mouseOffset.x,
              }
        }
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="relative rounded-3xl border border-white/10 bg-[#070c12]/90 p-6 md:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(110,231,255,0.06)]"
      >
        {/* Top Header HUD Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            <span className="text-xs font-mono font-medium tracking-wider text-primary uppercase">
              NEURAL_MESH_ONLINE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/5">
              ACTIVE_DISPATCH v2.4
            </span>
          </div>

          <button
            onClick={triggerPulse}
            className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/50 hover:border-cyan-400/60 transition-all cursor-pointer shadow-[0_0_15px_rgba(110,231,255,0.15)] active:scale-95"
          >
            <RefreshCw
              className={`w-3 h-3 text-cyan-400 ${isPulsing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
            />
            <span>Pulse Core</span>
          </button>
        </div>

        {/* The Central Visualizer Canvas Area */}
        <div className="relative h-[360px] md:h-[400px] w-full my-2 overflow-hidden flex items-center justify-center">
          {/* Ambient Cyber Grid inside viewport */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #6ee7ff 1px, transparent 1px), linear-gradient(to bottom, #6ee7ff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* SVG Neural Synapse Beams without CPU raster blur filters */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="coreBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6ee7ff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Connecting lines from Center (50%, 50%) to each Model Node */}
            {EXPERT_MODELS.map((node) => {
              const isActive = activeModelId === node.id;
              return (
                <g key={node.id}>
                  {/* Static guide wire */}
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`${node.x}%`}
                    y2={`${node.y}%`}
                    stroke={node.color}
                    strokeOpacity={isActive ? 0.35 : 0.12}
                    strokeWidth={isActive ? 1.8 : 1}
                    strokeDasharray={isActive ? "none" : "4 4"}
                  />

                  {/* Pulsing Synapse Laser Packet (rendered only when onScreen) */}
                  {onScreen && (
                    <motion.line
                      x1="50%"
                      y1="50%"
                      x2={`${node.x}%`}
                      y2={`${node.y}%`}
                      stroke={node.color}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      strokeOpacity={isActive ? 0.95 : 0.4}
                      strokeDasharray="18 120"
                      animate={{
                        strokeDashoffset: [0, -138],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: isActive ? 1.6 : 3.2,
                        ease: "linear",
                      }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Concentric Telemetry Orbital Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Outer Slow Telemetry Ring */}
            <div
              className={`absolute w-[290px] h-[290px] md:w-[330px] md:h-[330px] rounded-full border border-dashed border-cyan-400/20 ${onScreen && !isLowEnd ? "animate-spin" : ""}`}
              style={{ animationDuration: "50s" }}
            />

            {/* Middle Reverse Ring with Tick Marks */}
            <div
              className={`absolute w-[220px] h-[220px] md:w-[250px] md:h-[250px] rounded-full border border-violet-400/25 ${onScreen && !isLowEnd ? "animate-spin" : ""}`}
              style={{ animationDuration: "28s", animationDirection: "reverse" }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-violet-400" />
            </div>

            {/* Inner Precision Crosshairs Ring */}
            <div
              className={`absolute w-[150px] h-[150px] md:w-[170px] md:h-[170px] rounded-full border border-cyan-400/35 ${onScreen && !isLowEnd ? "animate-spin" : ""}`}
              style={{ animationDuration: "16s" }}
            />

            {/* Expanding Shockwave Waves when Pulsing */}
            <AnimatePresence>
              {isPulsing && (
                <>
                  <motion.div
                    key={`pulse1-${pulseCount}`}
                    initial={{ scale: 0.4, opacity: 0.9 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="absolute w-44 h-44 rounded-full border-2 border-cyan-400 shadow-[0_0_30px_#6ee7ff]"
                  />
                  <motion.div
                    key={`pulse2-${pulseCount}`}
                    initial={{ scale: 0.3, opacity: 0.7 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
                    className="absolute w-44 h-44 rounded-full border-2 border-purple-500 shadow-[0_0_35px_#a855f7]"
                  />
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Central Holographic Singularity (Core Reactor) */}
          <div
            onClick={triggerPulse}
            className="group relative z-20 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
            title="Click to pulse the Neural Core"
          >
            {/* Luminous Halo */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-400/30 via-violet-500/30 to-sky-400/30 blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />

            {/* Outer Reactor Shell */}
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-[#6ee7ff]/40 via-[#07131d] to-[#a855f7]/40 p-[1.5px] shadow-[0_0_40px_rgba(110,231,255,0.4)]">
              <div className="w-full h-full rounded-full bg-[#05090e]/90 backdrop-blur-md flex flex-col items-center justify-center border border-white/10 group-hover:border-cyan-400/60 transition-colors">
                {/* Rotating Core Glyph */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 rounded-full bg-cyan-400/20 blur-md animate-ping" />
                  <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-[0_0_20px_#6ee7ff]">
                    <Brain className="w-6 h-6 text-white animate-pulse" />
                  </div>
                </div>

                <span className="mt-1 text-[9px] font-mono tracking-tighter text-cyan-300 font-bold">
                  NEURA
                </span>
              </div>
            </div>

            {/* Click Pulse Tooltip Hint */}
            <span className="absolute -bottom-6 text-[10px] font-mono text-cyan-400/70 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Click to Pulse
            </span>
          </div>

          {/* The 5 Orbiting Model Nodes */}
          {EXPERT_MODELS.map((node) => {
            const isActive = activeModelId === node.id;
            const IconComponent = node.icon;

            return (
              <motion.div
                key={node.id}
                onClick={() => setActiveModelId(node.id)}
                onMouseEnter={() => setActiveModelId(node.id)}
                whileHover={{ scale: 1.08 }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
              >
                <div
                  className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-[#0b1622]/95 border shadow-lg"
                      : "bg-[#070e17]/80 hover:bg-[#0c1926]/90 border border-white/10 hover:border-white/20"
                  }`}
                  style={{
                    borderColor: isActive ? node.color : undefined,
                    boxShadow: isActive ? `0 0 25px ${node.glowColor}` : undefined,
                  }}
                >
                  {/* Glowing Node Icon */}
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `${node.color}20`,
                      color: node.color,
                    }}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Node Label & Spec */}
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground tracking-tight">
                        {node.name}
                      </span>
                      {isActive && (
                        <span
                          className="h-1.5 w-1.5 rounded-full animate-ping"
                          style={{ backgroundColor: node.color }}
                        />
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {node.tokensPerSec}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Active Model Telemetry Card */}
        <motion.div
          key={activeModel.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="relative mt-2 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-3 h-3 rounded-full shadow-[0_0_10px]"
                style={{
                  backgroundColor: activeModel.color,
                  boxShadow: `0 0 10px ${activeModel.color}`,
                }}
              />
              <span className="text-sm font-bold text-foreground">
                {activeModel.name}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-muted-foreground">
                {activeModel.provider}
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-cyan-300">
                <Activity className="w-3.5 h-3.5" />
                <span>{activeModel.latency}</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-300">
                <Zap className="w-3.5 h-3.5" />
                <span>{activeModel.tokensPerSec}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{activeModel.accuracy} Acc</span>
              </div>
            </div>
          </div>

          {/* Description & Realtime Equalizer */}
          <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-muted-foreground">
            <p className="max-w-md leading-relaxed">
              {activeModel.description}
            </p>

            {/* Realtime Cyber Audio/Neural Spectrum Equalizer Bars */}
            <div className="flex items-end gap-1 h-6 shrink-0 self-end md:self-auto">
              {[40, 75, 30, 95, 60, 85, 45, 100, 50, 70, 90, 65].map((val, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-t"
                  style={{
                    backgroundColor: i % 2 === 0 ? activeModel.color : "#c084fc",
                  }}
                  animate={
                    onScreen && !isLowEnd
                      ? {
                          height: isPulsing
                            ? ["20%", "100%", "30%", "90%", "40%"]
                            : [`${Math.max(15, val * 0.4)}%`, `${val}%`, `${Math.max(15, val * 0.3)}%`],
                        }
                      : { height: `${val * 0.6}%` }
                  }
                  transition={
                    onScreen && !isLowEnd
                      ? {
                          repeat: Infinity,
                          duration: isPulsing ? 0.35 : 0.8 + (i % 4) * 0.2,
                          ease: "easeInOut",
                          delay: i * 0.05,
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
