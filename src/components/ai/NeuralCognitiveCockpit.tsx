import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Zap,
  Terminal,
  Activity,
  Play,
  RotateCcw,
  Sparkles,
  Cpu,
  Eye,
  Radio,
  Copy,
  Check,
  Flame,
  Layers,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Gauge,
  Workflow,
  Sliders,
} from "lucide-react";
import { useOnScreen } from "@/hooks/useOnScreen";

interface Scenario {
  id: string;
  badge: string;
  model: string;
  provider: string;
  icon: React.ComponentType<{ className?: string }>;
  prompt: string;
  color: string;
  glow: string;
  speedTokSec: number;
  latencyMs: number;
  thoughts: { time: string; text: string; tag: string }[];
  code: string;
  lang: string;
  previewType: "circuit" | "cluster" | "shader" | "voice";
}

const SCENARIOS: Scenario[] = [
  {
    id: "reasoning",
    badge: "QUANTUM REASONING",
    model: "Neura DeepMind",
    provider: "Reasoning Cluster",
    icon: Brain,
    prompt: "Prove P ≠ NP under relativized oracle constraints and derive quantum lower bounds",
    color: "#6ee7ff",
    glow: "rgba(110, 231, 255, 0.45)",
    speedTokSec: 135,
    latencyMs: 14,
    thoughts: [
      { time: "0.12s", text: "Ingesting complexity theory ontology. Parsing Baker-Gill-Solovay oracle theorem.", tag: "EMBED" },
      { time: "0.38s", text: "Constructing oracle A (P^A = NP^A) and oracle B (P^B ≠ NP^B) via diagonalization.", tag: "THEORY" },
      { time: "0.74s", text: "Evaluating non-relativizing barriers: Algebrization & Natural Proofs (Razborov-Rudich).", tag: "PRUNING" },
      { time: "1.15s", text: "Deriving quantum polynomial-time query bounds: Ω(√N) Grover optimality confirmed.", tag: "QUANTUM" },
      { time: "1.42s", text: "Consensus locked: Relativized separation proven; unconditional bounds require circuit depth > O(log n).", tag: "VERIFIED" },
    ],
    code: `// Quantum Relativized Oracle Verification
import { QuantumOracle, CircuitBound } from '@neura/complexity';

export async function verifySeparation() {
  const oracle = new QuantumOracle({ querySpace: 'Hilbert_2^n' });
  const result = await oracle.diagonalize({
    bgsTheorem: true,
    algebrizationCheck: true,
    groverBound: 'Ω(√N)'
  });
  
  return {
    status: 'SEPARATION_VERIFIED',
    confidence: 0.9998,
    lowerBound: CircuitBound.SUPER_POLYNOMIAL
  };
}`,
    lang: "typescript",
    previewType: "circuit",
  },
  {
    id: "swarm",
    badge: "AUTONOMOUS AGENTS",
    model: "Neura Ultra Core",
    provider: "Swarm Orchestrator",
    icon: Workflow,
    prompt: "Deploy an autonomous 5-node distributed microservice with zero-downtime canary rollback",
    color: "#c084fc",
    glow: "rgba(192, 132, 252, 0.45)",
    speedTokSec: 185,
    latencyMs: 19,
    thoughts: [
      { time: "0.08s", text: "Initializing distributed actor hierarchy: Spawning 5 autonomous agent workers.", tag: "SPAWN" },
      { time: "0.26s", text: "Syncing Raft consensus protocol: Node quorum verified (5/5 healthy).", tag: "CONSENSUS" },
      { time: "0.55s", text: "Simulating chaos failure on Node #3: Automatic self-healing reroute in 4.2ms.", tag: "HEALING" },
      { time: "0.88s", text: "Executing blue-green canary switchover: Traffic shifted 10% → 50% → 100%.", tag: "DEPLOY" },
      { time: "1.10s", text: "Telemetry healthy: 0.000% error rate across all regions. Canary locked.", tag: "ONLINE" },
    ],
    code: `// Autonomous Agent Swarm Pipeline
import { AgentMesh, HealthMonitor } from '@neura/swarm';

export const cluster = new AgentMesh({
  topology: 'self-healing-ring',
  nodes: 5,
  consensus: 'raft-v3',
  canary: {
    stepIntervalMs: 250,
    rollbackOnAnomaly: true,
    telemetryLatencyThreshold: 15
  }
});

await cluster.deploy();
console.log('Swarm alive at 0.000% packet loss.');`,
    lang: "typescript",
    previewType: "cluster",
  },
  {
    id: "shader",
    badge: "NEURAL VISUAL SHADER",
    model: "Neura Omni Matrix",
    provider: "Vision & GPU Synthesis",
    icon: Eye,
    prompt: "Synthesize a real-time reactive black-hole accretion disk with gravitational lensing",
    color: "#34d399",
    glow: "rgba(52, 211, 153, 0.45)",
    speedTokSec: 142,
    latencyMs: 18,
    thoughts: [
      { time: "0.09s", text: "Formulating Schwarzschild metric tensor: ds² = -(1 - 2M/r)dt² + (1 - 2M/r)⁻¹dr².", tag: "METRIC" },
      { time: "0.42s", text: "Raymarching photon geodesics around critical photon sphere (r = 3M).", tag: "OPTICS" },
      { time: "0.78s", text: "Computing Doppler relativistic beaming for retrograde accretion velocity.", tag: "RELATIVITY" },
      { time: "1.08s", text: "Compiling WebGL fragment shader: SIMD loop unrolling with 60fps guarantee.", tag: "GPU_COMPILED" },
    ],
    code: `// Accretion Disk Raymarching Shader
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;
  float r = length(uv);
  float lens = 0.28 / (r + 0.02);
  vec3 col = vec3(
    sin(lens * 4.0 + u_time * 2.0) * 0.5 + 0.5,
    cos(lens * 3.0 - u_time) * 0.4 + 0.3,
    sin(lens * 6.0) * 0.7 + 0.6
  );
  gl_FragColor = vec4(col * smoothstep(0.08, 0.4, r), 1.0);
}`,
    lang: "glsl",
    previewType: "shader",
  },
  {
    id: "stream",
    badge: "LIGHTSPEED STREAM",
    model: "Neura Hyper-Speed LPU",
    provider: "LPU Tensor Cluster",
    icon: Zap,
    prompt: "Stream full-duplex conversational voice with sub-80ms emotional prosody modulation",
    color: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.45)",
    speedTokSec: 425,
    latencyMs: 6,
    thoughts: [
      { time: "0.02s", text: "Neura LPU Array warm: TTFT 6.2ms. Phoneme stream received.", tag: "RAW_SPEED" },
      { time: "0.15s", text: "Phonetic emotional prosody synthesis: Empathy quotient 0.94.", tag: "PROSODY" },
      { time: "0.28s", text: "Synthesizing 48kHz float32 vocoder frames at 425 tokens per second.", tag: "AUDIO_SYNTH" },
      { time: "0.41s", text: "Zero-wait packet dispatch over direct UDP socket. Latency target achieved.", tag: "DELIVERED" },
    ],
    code: `// Neura LPU Voice Streaming Core
import { NeuraLPU, VoiceDuplex } from '@neura/voice';

const session = await NeuraLPU.createDuplexStream({
  model: 'neura-voice-duplex-v3',
  hardware: 'NeuraRack-LPU',
  audio: {
    sampleRate: 48000,
    emotionalCadence: 'adaptive',
    maxLatencyMs: 80
  }
});

session.pipe(audioOutputDevice);`,
    lang: "typescript",
    previewType: "voice",
  },
];

export function NeuralCognitiveCockpit() {
  const [containerRef, onScreen] = useOnScreen<HTMLDivElement>("150px");
  const [selectedId, setSelectedId] = useState<string>("reasoning");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"stream" | "code" | "artifact">("stream");
  const [copied, setCopied] = useState<boolean>(false);
  const [turboMode, setTurboMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [thoughtsExpanded, setThoughtsExpanded] = useState<boolean>(true);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [currentThoughtIndex, setCurrentThoughtIndex] = useState<number>(5);
  const [displayedSpeed, setDisplayedSpeed] = useState<number>(135);
  const [elapsedMs, setElapsedMs] = useState<number>(1420);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scenario = SCENARIOS.find((s) => s.id === selectedId) || SCENARIOS[0];

  // Sound generator using Web Audio API
  const playSciFiSound = (freq = 440, type: OscillatorType = "sine", duration = 0.08) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio context errors if blocked by browser
    }
  };

  // Execution Simulator
  const triggerExecution = (customText?: string) => {
    setIsExecuting(true);
    setCurrentThoughtIndex(0);
    setElapsedMs(0);
    playSciFiSound(880, "triangle", 0.12);

    const baseSpeed = turboMode ? scenario.speedTokSec * 1.8 : scenario.speedTokSec;
    setDisplayedSpeed(0);

    // Speedometer ramp up
    let speedStep = 0;
    const speedInterval = setInterval(() => {
      speedStep += 25;
      if (speedStep >= baseSpeed) {
        setDisplayedSpeed(baseSpeed);
        clearInterval(speedInterval);
      } else {
        setDisplayedSpeed(speedStep);
      }
    }, 40);

    // Step through thoughts
    const totalSteps = scenario.thoughts.length;
    let step = 0;
    const stepInterval = setInterval(() => {
      step += 1;
      setCurrentThoughtIndex(step);
      setElapsedMs((prev) => prev + Math.floor(Math.random() * 220 + 150));
      playSciFiSound(440 + step * 80, "sine", 0.05);

      if (step >= totalSteps) {
        clearInterval(stepInterval);
        setIsExecuting(false);
        playSciFiSound(1040, "sine", 0.18);
      }
    }, turboMode ? 220 : 380);
  };

  // Auto-run once when switching scenario
  useEffect(() => {
    setCurrentThoughtIndex(scenario.thoughts.length);
    setDisplayedSpeed(turboMode ? scenario.speedTokSec * 1.8 : scenario.speedTokSec);
    setElapsedMs(1420);
  }, [selectedId, turboMode]);

  // Interactive Generative Shader Canvas (Active only when visible and on stream tab)
  useEffect(() => {
    if (activeTab !== "stream" || !onScreen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.035;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Draw interactive gravitational lensing / particle distortion
      const rings = scenario.previewType === "circuit" ? 6 : 8;
      for (let i = 1; i <= rings; i++) {
        const radius = i * (w / (rings * 2.3));
        ctx.beginPath();
        ctx.strokeStyle = `${scenario.color}${Math.floor(Math.max(15, (1 - i / rings) * 75)).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = i === 2 || i === 4 ? 2 : 1;

        if (scenario.previewType === "circuit") {
          ctx.arc(cx, cy, radius, time * (i % 2 === 0 ? 0.4 : -0.4), time * (i % 2 === 0 ? 0.4 : -0.4) + Math.PI * 1.5);
        } else {
          // Accretion ripple
          const distortion = Math.sin(time * 2 + i) * 6;
          ctx.ellipse(cx, cy, radius + distortion, (radius + distortion) * 0.45, (time * 0.2 * (i % 2 ? 1 : -1)), 0, Math.PI * 2);
        }
        ctx.stroke();
      }

      // Center singularity
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 28);
      grad.addColorStop(0, scenario.color);
      grad.addColorStop(0.5, "#a855f7");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 28 + Math.sin(time * 3) * 4, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [scenario, activeTab, onScreen]);

  const copyCode = () => {
    navigator.clipboard.writeText(scenario.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-6xl select-none">
      {/* Outer Glow Backdrop */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-[36px] blur-3xl opacity-30 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${scenario.color} 0%, #7c3aed 45%, transparent 70%)`,
        }}
      />

      {/* Futuristic Cockpit Chassis */}
      <div className="relative rounded-[28px] border border-white/15 bg-[#050a10]/95 p-4 md:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_60px_rgba(110,231,255,0.08)] backdrop-blur-2xl">
        {/* Cockpit Top Bar / Telemetry Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
          {/* Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: scenario.color }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: scenario.color }}
                />
              </span>
              <span className="text-[11px] font-mono font-bold tracking-wider text-white uppercase">
                NEURA_COGNITIVE_CORE
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-semibold px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-800/40">
                ACTIVE
              </span>
            </div>

            {/* Overclock Toggle */}
            <button
              onClick={() => {
                setTurboMode(!turboMode);
                playSciFiSound(600, "square", 0.06);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer border ${
                turboMode
                  ? "bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                  : "bg-white/[0.03] text-muted-foreground border-white/10 hover:text-white"
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${turboMode ? "text-amber-400 animate-pulse" : ""}`} />
              <span>OVERCLOCK {turboMode ? "ON" : "OFF"}</span>
            </button>
          </div>

          {/* Sound & Telemetry Quick Stats */}
          <div className="flex items-center gap-4 text-xs font-mono">
            {/* Speedometer Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-cyan-300">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold">{displayedSpeed}</span>
              <span className="text-[10px] text-muted-foreground">tok/s</span>
            </div>

            {/* Latency Jitter */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-purple-300">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-bold">{scenario.latencyMs}ms</span>
              <span className="text-[10px] text-muted-foreground">TTFT</span>
            </div>

            {/* Audio Feedback Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playSciFiSound(520, "sine", 0.1);
              }}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                soundEnabled
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/40"
                  : "bg-white/[0.03] text-muted-foreground border-white/10 hover:text-white"
              }`}
              title={soundEnabled ? "Mute Sci-Fi Audio" : "Enable Sci-Fi Audio Synthesizer"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 4 Scenario Cartridge Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-5">
          {SCENARIOS.map((s) => {
            const isSel = s.id === selectedId;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedId(s.id);
                  playSciFiSound(700, "triangle", 0.08);
                }}
                className={`relative flex items-center gap-2.5 p-3 rounded-2xl text-left transition-all duration-300 cursor-pointer border ${
                  isSel
                    ? "bg-[#0b1622] border-opacity-70 shadow-lg"
                    : "bg-white/[0.02] hover:bg-white/[0.05] border-white/5 hover:border-white/15 text-muted-foreground"
                }`}
                style={{
                  borderColor: isSel ? s.color : undefined,
                  boxShadow: isSel ? `0 0 20px ${s.glow}` : undefined,
                }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${s.color}20`,
                    color: s.color,
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-[10px] font-mono tracking-wider uppercase font-semibold"
                    style={{ color: isSel ? s.color : undefined }}
                  >
                    {s.badge}
                  </p>
                  <p className="text-xs font-bold text-white truncate">{s.model}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Active Prompt Command Bar */}
        <div className="relative mb-5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
                COGNITIVE_PROMPT_INPUT
              </span>
              <p className="text-sm font-medium text-foreground tracking-tight truncate">
                "{scenario.prompt}"
              </p>
            </div>
          </div>

          {/* Trigger Button */}
          <button
            onClick={() => triggerExecution()}
            disabled={isExecuting}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-300 cursor-pointer shadow-lg active:scale-95"
            style={{
              backgroundColor: scenario.color,
              color: "#05090e",
              boxShadow: `0 0 25px ${scenario.glow}`,
            }}
          >
            {isExecuting ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Ignite Synapses</span>
              </>
            )}
          </button>
        </div>

        {/* Main Split Cockpit Body: Left (Thought Engine) | Right (Interactive Canvas & Code) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* LEFT: Live Reasoning Stream (<think>) */}
          <div className="lg:col-span-6 flex flex-col rounded-2xl border border-white/10 bg-[#03070c]/80 p-4 backdrop-blur-xl">
            {/* Header with Thinking Accordion Toggle */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" style={{ color: scenario.color }} />
                <span className="text-xs font-mono font-bold text-white tracking-wider">
                  THOUGHT_TRACE &lt;think&gt;
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-cyan-400">
                  {(elapsedMs / 1000).toFixed(2)}s elapsed
                </span>
              </div>

              <button
                onClick={() => setThoughtsExpanded(!thoughtsExpanded)}
                className="text-muted-foreground hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                {thoughtsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Step-by-Step Chain-of-Thought Stream */}
            <div className="mt-3 space-y-2.5 flex-1 overflow-y-auto max-h-[300px] pr-1 font-mono text-xs">
              {thoughtsExpanded ? (
                scenario.thoughts.slice(0, currentThoughtIndex).map((t, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-2.5 rounded-xl border border-white/5 bg-white/[0.015] hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: scenario.color }}
                        />
                        <span className="font-semibold tracking-wider" style={{ color: scenario.color }}>
                          [{t.tag}]
                        </span>
                      </span>
                      <span>{t.time}</span>
                    </div>
                    <p className="text-muted-foreground/90 leading-relaxed text-[11px] pl-3 border-l border-white/10">
                      {t.text}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Thought stream collapsed. Click expand to inspect raw tokens.
                </div>
              )}

              {isExecuting && (
                <div className="flex items-center gap-2 p-2.5 text-[11px] text-cyan-300 font-mono animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesizing neural weights...</span>
                </div>
              )}
            </div>

            {/* Live Audio / Frequency Waveform at bottom of thought trace */}
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">
                COGNITIVE_FREQUENCY_BAND
              </span>
              <div className="flex items-end gap-1 h-5">
                {[30, 80, 45, 95, 60, 100, 75, 40, 90, 65, 85, 50, 70, 40, 90, 60].map((v, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full"
                    style={{ backgroundColor: scenario.color }}
                    animate={
                      onScreen
                        ? {
                            height: isExecuting
                              ? ["15%", "100%", "25%", "85%"]
                              : [`${Math.max(15, v * 0.35)}%`, `${v}%`, `${Math.max(15, v * 0.25)}%`],
                          }
                        : { height: `${v * 0.5}%` }
                    }
                    transition={
                      onScreen
                        ? {
                            repeat: Infinity,
                            duration: isExecuting ? 0.3 : 0.9 + (i % 3) * 0.2,
                            delay: i * 0.04,
                            ease: "easeInOut",
                          }
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Live Interactive Code Artifact & Visual Matrix */}
          <div className="lg:col-span-6 flex flex-col rounded-2xl border border-white/10 bg-[#03070c]/80 p-4 backdrop-blur-xl">
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-mono">
                <button
                  onClick={() => {
                    setActiveTab("stream");
                    playSciFiSound(500, "sine", 0.05);
                  }}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "stream" ? "bg-white/10 text-white font-bold" : "text-muted-foreground hover:text-white"
                  }`}
                >
                  Interactive Matrix
                </button>
                <button
                  onClick={() => {
                    setActiveTab("code");
                    playSciFiSound(500, "sine", 0.05);
                  }}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "code" ? "bg-white/10 text-white font-bold" : "text-muted-foreground hover:text-white"
                  }`}
                >
                  Generated Code
                </button>
              </div>

              {activeTab === "code" && (
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              )}
            </div>

            {/* View Content */}
            <div className="mt-3 flex-1 flex flex-col items-center justify-center min-h-[290px] overflow-hidden">
              {activeTab === "stream" ? (
                <div className="relative w-full h-[290px] rounded-xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center">
                  {/* Procedural Canvas Simulation */}
                  <canvas ref={canvasRef} width={400} height={290} className="w-full h-full object-cover" />

                  {/* Overlay Interactive Hologram HUD */}
                  <div className="absolute inset-0 p-4 pointer-events-none flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                      <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-cyan-300">
                        SIMULATION_ENGINE: ACTIVE
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10">
                        FPS: 60.0
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono bg-black/70 backdrop-blur-md p-2 rounded-lg border border-white/10">
                      <span className="text-white font-bold">
                        {scenario.badge}
                      </span>
                      <span style={{ color: scenario.color }}>
                        STABILITY: 100.0%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Code View */
                <div className="w-full h-[290px] rounded-xl overflow-auto bg-[#020508] p-3 border border-white/5 font-mono text-[11px] text-cyan-200/90 leading-relaxed">
                  <pre>
                    <code>{scenario.code}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Bottom Output Metrics */}
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <span>OUTPUT_VERIFICATION: 200 OK</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                DETERMINISTIC CONSENSUS
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Custom Prompt Bar: "Type anything to test the core" */}
        <div className="mt-5 pt-5 border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customPrompt.trim()) {
                triggerExecution(customPrompt);
              }
            }}
            className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 focus-within:border-cyan-400/50 transition-colors"
          >
            <div className="pl-3 text-muted-foreground">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Or test your own query: e.g. Synthesize a zero-knowledge proof for distributed voting..."
              className="flex-1 bg-transparent px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none font-sans"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-400/40 text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer active:scale-95"
            >
              Test Query
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
