import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiCheck,
  HiBolt,
  HiSparkles,
  HiArrowTrendingUp,
  HiCalculator,
  HiFire,
  HiXMark,
} from "react-icons/hi2";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSession } from "@/hooks/useSession";
import { useServerFn } from "@tanstack/react-start";
import { upgradePlan } from "@/lib/account.functions";

type Billing = "monthly" | "annual";

const plans = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    annual: 0,
    blurb: "For exploring what Neura can do.",
    recommendedThreshold: 1000,
    features: [
      { text: "555 messages / month", detail: "Standard non-metered WebGPU core" },
      { text: "Voice AI (2 hours daily)", detail: "Natural speech duplex synthesis" },
      { text: "Standard model routing", detail: "Mixture-of-Experts auto tier" },
      { text: "7-day memory window", detail: "Recent conversational context" },
    ],
    cta: "Start free",
    action: "start" as const,
    featured: false,
    accentColor: "#6ee7ff",
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 12,
    annual: 120,
    blurb: "For builders who live inside the assistant.",
    recommendedThreshold: 20000,
    features: [
      { text: "Unlimited messages", detail: "Zero throttling, zero queue wait times" },
      { text: "Full neural mesh + reasoning", detail: "Neura Ultra + Neura DeepMind + Omni Vision + LPUs" },
      { text: "Persistent memory & agents", detail: "Lifelong cross-session vector embeddings" },
      { text: "Image and code generation", detail: "4K synthesis & full-stack code sandboxes" },
      { text: "Priority edge inference", detail: "Sub-15ms direct LPU tensor routing" },
    ],
    cta: "Talk to us about Pro",
    action: "upgrade" as const,
    featured: true,
    accentColor: "#c084fc",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: null,
    annual: null,
    blurb: "For teams with compliance and scale needs.",
    recommendedThreshold: 100000,
    features: [
      { text: "Private VPC deployment", detail: "Isolated on your AWS/GCP infrastructure" },
      { text: "SSO, SCIM, audit trails", detail: "Enterprise Okta & SOC2 compliance" },
      { text: "Fine-tuned domain models", detail: "Trained on your private codebase & docs" },
      { text: "99.99% SLA + named engineer", detail: "Direct 24/7 Slack channel access" },
    ],
    cta: "Talk to sales",
    action: "sales" as const,
    featured: false,
    accentColor: "#34d399",
  },
];

function priceFor(p: (typeof plans)[number], billing: Billing, overclock: boolean) {
  if (p.monthly === null || p.annual === null) {
    return {
      price: overclock ? "Custom SLA" : "Custom",
      period: "billed annually",
      note: overclock ? "Includes dedicated quantum node" : null,
    };
  }
  if (p.monthly === 0) {
    return {
      price: "$0",
      period: "forever",
      note: overclock ? "⚡ Boosted with +2,000 turbo tokens" : null,
    };
  }
  if (billing === "annual") {
    const baseAnnual = overclock ? p.annual * 0.8 : p.annual;
    const perMonth = baseAnnual / 12;
    return {
      price: `$${perMonth % 1 === 0 ? perMonth : perMonth.toFixed(0)}`,
      period: "/ month",
      note: `$${baseAnnual} billed yearly · save $${p.monthly * 12 - baseAnnual}`,
    };
  }
  const monthlyPrice = overclock ? Math.round(p.monthly * 0.85) : p.monthly;
  return { price: `$${monthlyPrice}`, period: "/ month", note: "billed monthly" };
}

export function Pricing() {
  const { isAuthenticated } = useSession();
  const navigate = useNavigate();
  const [billing, setBilling] = useState<Billing>("annual");
  const [workloadSlider, setWorkloadSlider] = useState<number>(12000);
  const [overclock, setOverclock] = useState<boolean>(false);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // Commercial Checkout & Sales Dialog States
  const [proModalOpen, setProModalOpen] = useState(false);
  const [enterpriseModalOpen, setEnterpriseModalOpen] = useState(false);
  const [proSuccess, setProSuccess] = useState(false);
  const [enterpriseSubmitted, setEnterpriseSubmitted] = useState(false);
  const [enterpriseForm, setEnterpriseForm] = useState({
    name: "",
    email: "",
    teamSize: "10-50",
    deployment: "Dedicated Cloud VPC",
    requirement: "",
  });

  const upgradePlanFn = useServerFn(upgradePlan);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  const handleStartFree = () => {
    navigate({ to: "/app" });
  };

  const handleActivatePro = async () => {
    if (!isAuthenticated) {
      navigate({ to: "/auth", search: { next: "/pricing" } });
      return;
    }

    setUpgrading(true);
    setUpgradeError(null);
    try {
      const res = await upgradePlanFn({ data: { tier: "pro", billing } });
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
        return;
      }
      setProSuccess(true);
      setTimeout(() => {
        setProModalOpen(false);
        setProSuccess(false);
        setUpgrading(false);
        navigate({ to: "/account" });
      }, 1400);
    } catch (err: any) {
      console.error("[billing:upgrade]", err);
      setUpgradeError(err?.message || "Failed to activate Pro subscription. Please verify session.");
      setUpgrading(false);
    }
  };

  const handleEnterpriseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnterpriseSubmitted(true);
    setTimeout(() => {
      setEnterpriseSubmitted(false);
      setEnterpriseModalOpen(false);
    }, 2200);
  };

  // Determine which plan is recommended based on slider
  const recommendedPlanId =
    workloadSlider <= 2000 ? "free" : workloadSlider <= 35000 ? "pro" : "enterprise";

  // Calculate estimated cloud GPU API cost savings
  const estimatedApiCost = Math.round((workloadSlider * 0.018));
  const neuraCost = billing === "annual" ? 10 : 12;
  const savings = Math.max(0, estimatedApiCost - neuraCost);

  return (
    <section id="pricing" className="relative mx-auto max-w-7xl overflow-hidden px-6 py-32">
      {/* Dynamic Ambient Background Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 h-[550px] w-[800px] -translate-x-1/2 rounded-full blur-[170px] opacity-35 transition-all duration-700"
        style={{
          background: overclock
            ? "radial-gradient(circle, rgba(251,191,36,0.3) 0%, rgba(244,63,94,0.2) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(110,231,255,0.25) 0%, rgba(124,58,237,0.25) 50%, transparent 80%)",
        }}
      />

      {/* Header Section */}
      <Reveal className="relative mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-4 shadow-[0_0_15px_rgba(110,231,255,0.15)]">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
          <span>FLEXIBLE INTELLIGENCE TIERS</span>
        </div>

        <h2 className="text-[clamp(2.2rem,4.4vw,3.6rem)] font-bold leading-[1.05]">
          Simple plans, <span className="text-gradient">serious capability</span>
        </h2>
        <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Predictable flat pricing with infinite reasoning depth. No hidden per-token markups.
        </p>

        {/* Controls Bar: Billing Toggle + Crazy Overclock Button */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {/* Monthly / Annual Toggle */}
          <div
            role="tablist"
            className="glass inline-flex items-center gap-1 rounded-full border border-white/10 p-1"
          >
            {(["monthly", "annual"] as const).map((b) => (
              <button
                key={b}
                role="tab"
                aria-selected={billing === b}
                onClick={() => setBilling(b)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all cursor-pointer ${
                  billing === b
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-elevated)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {b === "monthly" ? "Monthly" : "Annual"}
                {b === "annual" && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] tracking-wider font-mono font-bold ${
                      billing === b ? "bg-background/25 text-foreground" : "bg-primary/15 text-primary"
                    }`}
                  >
                    −17%
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Crazy Mode: Overclock All Tiers */}
          <button
            onClick={() => setOverclock(!overclock)}
            className={`group flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer border ${
              overclock
                ? "bg-gradient-to-r from-amber-500/30 to-rose-500/30 text-amber-300 border-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.35)] animate-pulse"
                : "bg-white/[0.04] text-muted-foreground border-white/10 hover:border-amber-400/40 hover:text-white"
            }`}
          >
            <HiFire className={`text-sm ${overclock ? "text-amber-400 animate-bounce" : "group-hover:text-amber-400"}`} />
            <span>{overclock ? "⚡ OVERCLOCK ACTIVATED" : "⚡ OVERCLOCK PLANS"}</span>
          </button>
        </div>

        {/* Crazy Interactive Workload & Cost-Savings Simulator Slider */}
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/10 bg-[#070e17]/80 p-5 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <HiCalculator className="text-cyan-400 text-sm" />
              <span>ESTIMATE MONTHLY WORKLOAD:</span>
            </span>
            <span className="font-bold text-cyan-300 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40">
              {workloadSlider.toLocaleString()} requests/mo
            </span>
          </div>

          {/* Range Slider */}
          <div className="mt-4 relative flex items-center">
            <input
              type="range"
              min={500}
              max={100000}
              step={500}
              value={workloadSlider}
              onChange={(e) => setWorkloadSlider(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-white/10 accent-cyan-400 cursor-pointer appearance-none transition-all"
            />
          </div>

          {/* Live Comparison Ticker */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5 text-[11px] font-mono">
            <span className="text-muted-foreground">
              Standard Cloud API Cost: <s className="text-rose-400/80">${estimatedApiCost}/mo</s>
            </span>
            <span className="text-emerald-300 flex items-center gap-1 font-bold">
              <HiArrowTrendingUp className="text-emerald-400" />
              Est. Monthly Savings: ~${savings}/mo
            </span>
          </div>
        </div>
      </Reveal>

      {/* Pricing Cards Grid */}
      <div className="relative mt-14 grid gap-8 lg:grid-cols-3 items-stretch">
        {plans.map((p, i) => {
          const { price, period, note } = priceFor(p, billing, overclock);
          const isRecommended = recommendedPlanId === p.id;
          const isPro = p.id === "pro";

          return (
            <Reveal key={p.name} delay={i * 0.1} className="h-full">
              <div
                className={`relative flex h-full flex-col rounded-3xl p-8 transition-all duration-500 ${
                  isPro
                    ? "bg-[#090f1a]/95 border-2 shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
                    : "glass border-white/10 hover:border-white/20"
                } ${isRecommended ? "ring-2 ring-cyan-400/50 scale-[1.02]" : "hover:-translate-y-2"}`}
                style={{
                  borderColor: isPro
                    ? overclock
                      ? "#fbbf24"
                      : "#c084fc"
                    : undefined,
                  boxShadow: isPro
                    ? `0 0 45px ${overclock ? "rgba(251,191,36,0.25)" : "rgba(192,132,252,0.25)"}`
                    : undefined,
                }}
              >
                {/* Rotating Cyber Laser Perimeter on Pro Card */}
                {isPro && (
                  <div className="pointer-events-none absolute -inset-[2px] rounded-3xl overflow-hidden">
                    <div
                      className="absolute -inset-[100%] animate-spin opacity-40"
                      style={{
                        animationDuration: "12s",
                        background:
                          "conic-gradient(from 0deg, transparent 0%, #6ee7ff 25%, #c084fc 50%, #34d399 75%, transparent 100%)",
                      }}
                    />
                  </div>
                )}

                {/* Badges on Top */}
                <div className="flex items-center justify-between gap-2">
                  {isPro ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 px-3.5 py-1 text-[11px] font-bold tracking-widest text-[#05090e] uppercase shadow-[0_0_15px_rgba(110,231,255,0.4)]">
                      <HiSparkles /> MOST POPULAR
                    </span>
                  ) : (
                    <span />
                  )}

                  {isRecommended && (
                    <span className="rounded-full bg-cyan-950/80 border border-cyan-400/50 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300 font-semibold tracking-wider">
                      RECOMMENDED FOR YOU
                    </span>
                  )}
                </div>

                {/* Plan Title & Blurb */}
                <div className="relative mt-4">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    {p.name}
                    {overclock && isPro && (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                        TITAN
                      </span>
                    )}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>
                </div>

                {/* Animated Price Counter */}
                <div className="relative mt-7 flex items-end gap-2">
                  <motion.span
                    key={`${price}-${billing}-${overclock}`}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="font-display text-5xl font-bold tabular-nums text-white"
                  >
                    {price}
                  </motion.span>
                  <span className="pb-2 text-sm text-muted-foreground font-mono">{period}</span>
                </div>

                <p className="mt-2 h-4 text-xs font-mono text-cyan-300">
                  {note ?? ""}
                </p>

                <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Feature Checklist with Interactive Tooltip Hints */}
                <ul className="mt-6 space-y-3.5 text-sm flex-1">
                  {p.features.map((f) => (
                    <li
                      key={f.text}
                      onMouseEnter={() => setHoveredFeature(f.text)}
                      onMouseLeave={() => setHoveredFeature(null)}
                      className="group flex flex-col gap-0.5 cursor-pointer"
                    >
                      <div className="flex items-start gap-3 text-muted-foreground group-hover:text-white transition-colors">
                        <span
                          className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full transition-transform group-hover:scale-110"
                          style={{
                            backgroundColor: `${p.accentColor}20`,
                            color: p.accentColor,
                          }}
                        >
                          <HiCheck className="text-xs" />
                        </span>
                        <span className="font-medium">{f.text}</span>
                      </div>

                      {/* Detail Subtext */}
                      <span className="ml-8 text-[11px] font-mono text-muted-foreground/60 group-hover:text-cyan-300/80 transition-colors">
                        → {f.detail}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Live Model Routing Status on Pro Card */}
                {isPro && (
                  <div className="my-6 p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      ACTIVE ROUTING MESH
                    </span>
                    <span className="text-cyan-300 font-bold">19 REGIONS</span>
                  </div>
                )}

                {/* Action CTA Button */}
                <div className="mt-auto pt-6">
                  {p.action === "sales" ? (
                    <button
                      type="button"
                      onClick={() => setEnterpriseModalOpen(true)}
                      className="block w-full text-left"
                    >
                      <MagneticButton
                        variant="ghost"
                        className="w-full justify-center text-xs py-3"
                        strength={0.18}
                      >
                        <span className="mx-auto">{p.cta}</span>
                      </MagneticButton>
                    </button>
                  ) : p.action === "upgrade" ? (
                    <button
                      type="button"
                      onClick={() => setProModalOpen(true)}
                      className="block w-full text-left"
                    >
                      <MagneticButton
                        variant="primary"
                        className="w-full justify-center text-xs py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold shadow-[0_0_25px_rgba(110,231,255,0.3)] hover:scale-[1.02]"
                        strength={0.18}
                      >
                        <span className="mx-auto flex items-center justify-center gap-2">
                          {p.cta}
                          <HiBolt className="text-sm" />
                        </span>
                      </MagneticButton>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartFree}
                      className="block w-full text-left"
                    >
                      <MagneticButton
                        variant="ghost"
                        className="w-full justify-center text-xs py-3"
                        strength={0.18}
                      >
                        <span className="mx-auto flex items-center justify-center gap-2">
                          {p.cta}
                        </span>
                      </MagneticButton>
                    </button>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Pro Instant Checkout Modal */}
      <AnimatePresence>
        {proModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !proSuccess && setProModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950/95 p-6 md:p-8 shadow-[0_0_50px_rgba(110,231,255,0.15)] text-left"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setProModalOpen(false)}
                className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <HiXMark className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
                <HiBolt className="w-3.5 h-3.5" />
                <span>INSTANT PROVISIONING</span>
              </div>

              <h3 className="text-2xl font-bold text-white">Upgrade to Neura Pro</h3>
              <p className="text-xs text-slate-400 mt-1">
                Unlock Neura Ultra Deep Core, 19 Global Edge LPUs, and real-time Canvas preview.
              </p>

              <div className="mt-5 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-bold text-white font-mono">
                    {billing === "annual" ? "$10" : "$12"}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                  <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                    {billing === "annual" ? "Billed annually ($120/yr) · Save $24" : "Billed monthly · Cancel anytime"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                    84.5% Cost Arbitrage
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {[
                  "Unlimited Neura Ultra & DeepMind reasoning access",
                  "19 Global Edge LPU routing clusters (sub-second)",
                  "Persistent Vector Memory (10M token indexing)",
                  "Side-by-side interactive Canvas runtime preview",
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <HiCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-3">
                {upgradeError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
                    {upgradeError}
                  </div>
                )}
                {proSuccess ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 animate-pulse">
                    <HiCheck className="w-4 h-4" />
                    <span>✓ Payment Authorized. Neura Pro Activated! Launching Workspace...</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={upgrading}
                    onClick={handleActivatePro}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-500 text-black font-bold text-sm hover:opacity-95 shadow-[0_0_30px_rgba(110,231,255,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    <HiSparkles className="w-4 h-4" />
                    <span>{upgrading ? "Verifying Subscription..." : "Activate Neura Pro Instantly"}</span>
                  </button>
                )}
                <p className="text-[11px] text-center text-slate-500">
                  Instant activation · No credit card friction · 30-day money-back guarantee
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Enterprise Consultation Dialog */}
      <AnimatePresence>
        {enterpriseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !enterpriseSubmitted && setEnterpriseModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-purple-500/30 bg-slate-950/95 p-6 md:p-8 shadow-[0_0_50px_rgba(168,85,247,0.15)] text-left"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setEnterpriseModalOpen(false)}
                className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <HiXMark className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-3">
                <HiFire className="w-3.5 h-3.5" />
                <span>PRIVATE INFRASTRUCTURE</span>
              </div>

              <h3 className="text-2xl font-bold text-white">Neura Enterprise Consultation</h3>
              <p className="text-xs text-slate-400 mt-1">
                Dedicated VPC clusters, on-prem air-gapped deployments, and custom LLM fine-tuning.
              </p>

              {enterpriseSubmitted ? (
                <div className="my-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center space-y-2">
                  <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-lg font-bold">
                    ✓
                  </div>
                  <h4 className="font-bold text-white text-sm">Consultation Request Dispatched!</h4>
                  <p className="text-xs text-slate-300">
                    A Neura Enterprise AI Architect will review your workload and contact you within 15 minutes.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnterpriseSubmit} className="mt-5 space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={enterpriseForm.name}
                      onChange={(e) => setEnterpriseForm({ ...enterpriseForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500/60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={enterpriseForm.email}
                      onChange={(e) => setEnterpriseForm({ ...enterpriseForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500/60"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Team Size</label>
                      <select
                        value={enterpriseForm.teamSize}
                        onChange={(e) => setEnterpriseForm({ ...enterpriseForm, teamSize: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500/60"
                      >
                        <option value="5-20">5 – 20 engineers</option>
                        <option value="20-100">20 – 100 engineers</option>
                        <option value="100-500">100 – 500 engineers</option>
                        <option value="500+">500+ engineers</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Target Infrastructure</label>
                      <select
                        value={enterpriseForm.deployment}
                        onChange={(e) => setEnterpriseForm({ ...enterpriseForm, deployment: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500/60"
                      >
                        <option value="Dedicated Cloud VPC">Dedicated Cloud VPC</option>
                        <option value="Air-Gapped On-Premises">Air-Gapped On-Premises</option>
                        <option value="Hybrid Multi-Cloud">Hybrid Multi-Cloud</option>
                        <option value="Dedicated LPU Hardware">Dedicated LPU Hardware</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Architecture Requirements / Notes</label>
                    <textarea
                      rows={2}
                      placeholder="Describe target workloads, compliance (HIPAA/SOC2), or token throughput…"
                      value={enterpriseForm.requirement}
                      onChange={(e) => setEnterpriseForm({ ...enterpriseForm, requirement: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500/60 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold text-xs hover:opacity-95 shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Request Architecture Brief</span>
                    <HiBolt className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
