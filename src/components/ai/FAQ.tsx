import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight, MessageSquare, ShieldCheck, Zap, Cpu, HardDrive } from "lucide-react";
import { Reveal } from "./Reveal";
import { Link } from "@tanstack/react-router";

interface FAQItem {
  id: string;
  category: "all" | "architecture" | "security" | "performance";
  categoryLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  q: string;
  a: string;
  highlights: string[];
}

const faqs: FAQItem[] = [
  {
    id: "routing",
    category: "architecture",
    categoryLabel: "ROUTING",
    icon: Cpu,
    q: "How does model routing actually work?",
    a: "Every request is scored in real time on intent, token length, required modality, and latency tolerance. Neura then dispatches it to the model that historically benchmarks best on that exact profile, with instantaneous failover if a provider degrades.",
    highlights: ["Sub-15ms router dispatch", "Automatic provider failover", "Zero manual model switching"],
  },
  {
    id: "security",
    category: "security",
    categoryLabel: "SECURITY",
    icon: ShieldCheck,
    q: "Is my data used for model training?",
    a: "No. Your conversations, codebase files, and memory embeddings are encrypted at rest with AES-256, isolated per workspace, and strictly excluded from all LLM provider training by enterprise agreement. Enterprise plans can run 100% inside your own AWS/GCP VPC.",
    highlights: ["Zero training data retention", "Isolated workspace encryption", "Available private VPC deployment"],
  },
  {
    id: "memory",
    category: "architecture",
    categoryLabel: "MEMORY",
    icon: HardDrive,
    q: "What does persistent memory remember?",
    a: "Preferences, architectural decisions, conversational tone, project context, and prior code outputs. You have full transparency to inspect, edit, or purge any vector memory record at any time, or scope memory per repository.",
    highlights: ["Cross-session vector retrieval", "Granular user purge controls", "Per-project contextual scoping"],
  },
  {
    id: "agents",
    category: "performance",
    categoryLabel: "AGENTS",
    icon: Zap,
    q: "Can Neura take actions in my tools?",
    a: "Yes. Autonomous agents connect to 300+ integrations with tightly scoped OAuth permissions. Every automated action is logged in a tamper-evident audit trail with human-in-the-loop approvals before sensitive steps execute.",
    highlights: ["300+ native tool integrations", "Reversible execution trail", "Optional manual human approval"],
  },
  {
    id: "latency",
    category: "performance",
    categoryLabel: "LATENCY",
    icon: Zap,
    q: "How fast is voice mode?",
    a: "Median first-audio packet latency is 190ms with full natural interruption handling, streamed over low-latency WebSockets from the nearest of 19 global edge inference clusters.",
    highlights: ["190ms median audio latency", "Full conversational barge-in", "19 distributed edge regions"],
  },
];

const categories = [
  { id: "all", label: "All Questions" },
  { id: "architecture", label: "Architecture" },
  { id: "security", label: "Security & Privacy" },
  { id: "performance", label: "Performance" },
] as const;

export function FAQ() {
  const [openIds, setOpenIds] = useState<string[]>(["routing"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const toggleOpen = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs =
    selectedCategory === "all"
      ? faqs
      : faqs.filter((f) => f.category === selectedCategory);

  return (
    <section id="faq" className="relative mx-auto max-w-7xl px-6 py-32">
      {/* Subtle Ambient Radial Glow */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px] opacity-40" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Sticky Section Heading & Quick Help Box */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-4 shadow-[0_0_15px_rgba(110,231,255,0.15)]">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              <span>FREQUENTLY ASKED</span>
            </div>

            <h2 className="text-[clamp(2.2rem,4vw,3.4rem)] font-bold leading-[1.05]">
              Questions, <span className="text-gradient">answered</span>
            </h2>

            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              Everything you need to know about Neura's autonomous architecture, enterprise privacy,
              and real-time inference guarantees.
            </p>
          </Reveal>

          {/* Clean Support Contact Card */}
          <Reveal delay={0.15} className="mt-10">
            <div className="rounded-3xl border border-white/10 bg-[#070e17]/80 p-6 backdrop-blur-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white">Have a specific question?</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Our core engineering team answers questions directly in our community channel.
              </p>
              <div className="mt-5">
                <Link
                  to="/app"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 hover:text-cyan-200 transition-colors"
                >
                  <span>Chat with Neura directly</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right Column: Category Filter & Interactive Accordion */}
        <div className="lg:col-span-7">
          {/* Minimal Category Filter Pills */}
          <Reveal delay={0.1} className="mb-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer border ${
                  selectedCategory === c.id
                    ? "bg-white/10 text-white border-white/20 shadow-sm"
                    : "bg-white/[0.02] text-muted-foreground border-white/5 hover:border-white/10 hover:text-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </Reveal>

          {/* Questions Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.map((f, i) => {
              const isOpen = openIds.includes(f.id);
              const Icon = f.icon;

              return (
                <Reveal key={f.id} delay={0.1 + i * 0.05}>
                  <div
                    className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "bg-[#09111c]/90 border-cyan-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
                        : "bg-white/[0.02] hover:bg-white/[0.04] border-white/10 hover:border-white/20"
                    }`}
                  >
                    {/* Left Accent Indicator Bar when expanded */}
                    {isOpen && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-cyan-400 to-purple-500" />
                    )}

                    {/* Question Header Button */}
                    <button
                      onClick={() => toggleOpen(f.id)}
                      className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        {/* Number Index */}
                        <span className="font-mono text-xs font-bold text-muted-foreground/60 pt-0.5">
                          0{i + 1}
                        </span>

                        <div className="min-w-0">
                          {/* Category Tag */}
                          <span className="text-[10px] font-mono tracking-widest text-primary font-semibold uppercase block mb-1">
                            {f.categoryLabel}
                          </span>
                          {/* Question Text */}
                          <h3 className="font-display text-base sm:text-lg font-semibold text-white tracking-tight leading-snug">
                            {f.q}
                          </h3>
                        </div>
                      </div>

                      {/* Smooth Rotating Toggle Icon */}
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                          isOpen
                            ? "bg-primary/20 border-primary/40 text-primary rotate-45"
                            : "bg-white/[0.04] border-white/10 text-muted-foreground"
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                      </div>
                    </button>

                    {/* Expandable Answer Body */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-white/5">
                            <p className="pl-7">{f.a}</p>

                            {/* Quick Technical Highlights */}
                            <div className="pl-7 mt-4 flex flex-wrap gap-2">
                              {f.highlights.map((h) => (
                                <span
                                  key={h}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/10 text-[11px] font-mono text-cyan-300/90"
                                >
                                  <span className="h-1 w-1 rounded-full bg-cyan-400" />
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
