import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle2,
  ExternalLink,
  Zap,
  Terminal,
  Code2,
  Database,
  Cloud,
  Layers,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  Bot,
  ShieldCheck,
  Workflow,
  X,
  Cpu,
} from "lucide-react";
import {
  SiGithub,
  SiDiscord,
  SiNotion,
  SiSupabase,
  SiDocker,
  SiFigma,
  SiLinear,
  SiPostgresql,
  SiRedis,
  SiGooglecloud,
} from "react-icons/si";
import { FaSlack, FaAws } from "react-icons/fa6";
import { VscVscode } from "react-icons/vsc";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations & Ecosystem — Neura AI" },
      {
        name: "description",
        content:
          "Connect Neura with your developer tools, cloud infrastructure, databases, and communication channels.",
      },
    ],
  }),
  component: IntegrationsPage,
});

type Category = "all" | "developer" | "cloud" | "productivity" | "ai";

type Integration = {
  id: string;
  name: string;
  category: "developer" | "cloud" | "productivity" | "ai";
  description: string;
  icon: any;
  accent: string;
  badge?: string;
  tags: string[];
  popular?: boolean;
  connected?: boolean;
  docsUrl: string;
};

const INTEGRATIONS: Integration[] = [
  {
    id: "github",
    name: "GitHub",
    category: "developer",
    description:
      "Automated code review, semantic repository indexing, pull request synthesis, and branch intelligence.",
    icon: SiGithub,
    accent: "#6ee7ff",
    badge: "Official",
    tags: ["Code Review", "PR Synthesis", "Webhooks"],
    popular: true,
    docsUrl: "https://github.com",
  },
  {
    id: "vscode",
    name: "VS Code & Cursor",
    category: "developer",
    description:
      "Context-aware code completion, instant terminal debugging, and multi-file architectural refactoring inside your editor.",
    icon: VscVscode,
    accent: "#007acc",
    badge: "Extension",
    tags: ["Autocomplete", "Diagnostics", "Zero-Latency"],
    popular: true,
    docsUrl: "https://code.visualstudio.com",
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "cloud",
    description:
      "Native pgvector semantic search, edge function triggers, real-time database synchronization, and row-level security.",
    icon: SiSupabase,
    accent: "#3ecf8e",
    badge: "Native",
    tags: ["pgvector", "Realtime Sync", "Edge Auth"],
    popular: true,
    docsUrl: "https://supabase.com",
  },
  {
    id: "docker",
    name: "Docker",
    category: "developer",
    description:
      "Container health analysis, multi-stage Dockerfile optimization, and automated environment deployment checks.",
    icon: SiDocker,
    accent: "#2496ed",
    tags: ["Containers", "Telemetry", "CI/CD"],
    docsUrl: "https://docker.com",
  },
  {
    id: "terminal",
    name: "Neura CLI & Terminal",
    category: "developer",
    description:
      "Powerful command-line agent for macOS, Linux, and Windows. Run scripts, inspect local codebases, and stream logs.",
    icon: Terminal,
    accent: "#a78bfa",
    badge: "CLI v2.4",
    tags: ["Shell Integration", "Local Files", "POSIX/Win"],
    popular: true,
    docsUrl: "#cli",
  },
  {
    id: "slack",
    name: "Slack",
    category: "productivity",
    description:
      "Summon Neura into channels and threads for real-time team answers, incident escalation, and automated daily standup summaries.",
    icon: FaSlack,
    accent: "#e01e5a",
    tags: ["Bot Assistant", "Thread Summaries", "Enterprise"],
    docsUrl: "https://slack.com",
  },
  {
    id: "discord",
    name: "Discord",
    category: "productivity",
    description:
      "Community developer bot with voice-channel interactions, automated support ticketing, and code snippet explanations.",
    icon: SiDiscord,
    accent: "#5865f2",
    tags: ["Voice AI", "Community", "Slash Commands"],
    docsUrl: "https://discord.com",
  },
  {
    id: "notion",
    name: "Notion",
    category: "productivity",
    description:
      "Bi-directional sync with your Notion workspace. Auto-generate research pages, technical specs, and team wikis.",
    icon: SiNotion,
    accent: "#ffffff",
    badge: "Two-Way",
    tags: ["Knowledge Base", "Documentation", "Wikis"],
    popular: true,
    docsUrl: "https://notion.so",
  },
  {
    id: "linear",
    name: "Linear",
    category: "productivity",
    description:
      "Auto-link commits to issues, triage incoming bug reports, and generate engineering sprint updates with predictive velocity.",
    icon: SiLinear,
    accent: "#5e6ad2",
    tags: ["Issue Tracking", "Sprint Velocity", "Auto-Triage"],
    docsUrl: "https://linear.app",
  },
  {
    id: "figma",
    name: "Figma",
    category: "productivity",
    description:
      "Transform canvas frames into production React/Tailwind components and validate accessibility contrast ratios.",
    icon: SiFigma,
    accent: "#f24e1e",
    tags: ["Design-to-Code", "Tokens", "Canvas Sync"],
    docsUrl: "https://figma.com",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "cloud",
    description:
      "Direct database connection for schema reasoning, natural language query generation, and execution plan optimization.",
    icon: SiPostgresql,
    accent: "#336791",
    tags: ["SQL Generation", "EXPLAIN Analysis", "Connection Pool"],
    docsUrl: "https://postgresql.org",
  },
  {
    id: "redis",
    name: "Redis",
    category: "cloud",
    description:
      "Sub-millisecond semantic response cache, distributed rate limiting, and session state persistence for high-throughput apps.",
    icon: SiRedis,
    accent: "#dc382d",
    tags: ["Semantic Cache", "Rate Limiting", "KV Store"],
    docsUrl: "https://redis.io",
  },
  {
    id: "googlecloud",
    name: "Google Cloud",
    category: "cloud",
    description:
      "Cloud Run deployments, Cloud Storage dataset ingestion, and enterprise single sign-on with Google Identity.",
    icon: SiGooglecloud,
    accent: "#4285f4",
    tags: ["Cloud Run", "GCS Buckets", "OAuth 2.0"],
    docsUrl: "https://cloud.google.com",
  },
  {
    id: "aws",
    name: "Amazon Web Services",
    category: "cloud",
    description:
      "Serverless Lambda execution, S3 bucket semantic indexing, and IAM credential management with least-privilege scoping.",
    icon: FaAws,
    accent: "#ff9900",
    tags: ["AWS Lambda", "S3 Storage", "IAM Scoped"],
    docsUrl: "https://aws.amazon.com",
  },
  {
    id: "webgpu",
    name: "WebGPU Local Inference",
    category: "ai",
    description:
      "100% offline, zero-network private inference powered by on-device GPU acceleration using quantized Qwen/Llama models.",
    icon: Cpu,
    accent: "#6ee7ff",
    badge: "Zero-Latency",
    tags: ["Offline", "Privacy First", "VRAM Optimized"],
    popular: true,
    docsUrl: "#webgpu",
  },
  {
    id: "webhooks",
    name: "REST API & Webhooks",
    category: "ai",
    description:
      "Programmatic streaming completions, event-driven webhooks, and custom tool definitions compatible with standard OpenAPI specs.",
    icon: Workflow,
    accent: "#c084fc",
    badge: "OpenAPI",
    tags: ["SSE Streaming", "JSON Schema", "HMAC Signatures"],
    docsUrl: "#api",
  },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "All Integrations" },
  { id: "developer", label: "Developer & IDEs" },
  { id: "cloud", label: "Cloud & Databases" },
  { id: "productivity", label: "Productivity & Team" },
  { id: "ai", label: "AI & APIs" },
];

function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectedMap, setConnectedMap] = useState<Record<string, boolean>>({
    github: true,
    supabase: true,
    webgpu: true,
  });
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeSnippetTab, setActiveSnippetTab] = useState<"ts" | "python" | "curl">("ts");

  const filtered = useMemo(() => {
    return INTEGRATIONS.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const toggleConnection = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setConnectedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const snippets = {
    ts: `import { NeuraClient } from "@neura/sdk";

const neura = new NeuraClient({
  apiKey: process.env.NEURA_API_KEY,
  endpoint: "https://api.neura.ai/v1"
});

// Stream reasoning with GitHub & Linear integration
const stream = await neura.agent.stream({
  prompt: "Review PR #42 and summarize linked issues",
  integrations: ["github", "linear"],
  mode: "deep"
});

for await (const chunk of stream) {
  process.stdout.write(chunk.delta);
}`,
    python: `from neura import NeuraClient
import os

client = NeuraClient(api_key=os.environ["NEURA_API_KEY"])

# Dispatch task with Supabase pgvector tool
response = client.agent.dispatch(
    prompt="Find semantic duplicates across user conversations",
    integrations=["supabase", "postgres"],
    timeout_ms=5000
)

print(response.output)`,
    curl: `curl -X POST https://api.neura.ai/v1/agent/dispatch \\
  -H "Authorization: Bearer $NEURA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Sync latest documentation to Notion",
    "integrations": ["notion", "github"],
    "mode": "balanced"
  }'`,
  };

  return (
    <div className="min-h-screen bg-[#05070f] text-foreground selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 2D Atmospheric Background Gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 h-[38rem] w-[38rem] rounded-full bg-violet-600/10 blur-[160px]" />
        <div className="absolute -bottom-40 left-1/3 h-[30rem] w-[30rem] rounded-full bg-blue-500/10 blur-[140px]" />
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#05070f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 shadow-[0_0_12px_rgba(110,231,255,0.25)]">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#6ee7ff] animate-ping" />
              <span className="absolute h-2 w-2 rounded-full bg-cyan-300" />
            </span>
            <span className="font-display text-sm font-bold tracking-[0.24em] text-white">
              NEURA
            </span>
            <span className="ml-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
              INTEGRATIONS
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link
              to="/"
              className="text-xs font-medium text-white/60 transition-colors hover:text-white"
            >
              Overview
            </Link>
            <Link
              to="/features"
              className="text-xs font-medium text-white/60 transition-colors hover:text-white"
            >
              Capabilities
            </Link>
            <Link
              to="/models"
              className="text-xs font-medium text-white/60 transition-colors hover:text-white"
            >
              Models
            </Link>
            <Link
              to="/integrations"
              className="text-xs font-semibold text-cyan-400"
            >
              Integrations
            </Link>
            <Link
              to="/pricing"
              className="text-xs font-medium text-white/60 transition-colors hover:text-white"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="rounded-xl border border-white/10 px-3.5 py-2 text-xs font-medium text-white/80 transition-colors hover:border-cyan-400/40 hover:bg-white/[0.04] hover:text-white"
            >
              Sign In
            </Link>
            <Link
              to="/app"
              onClick={() => localStorage.setItem("neura_demo_session", "true")}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(110,231,255,0.3)] transition-all hover:shadow-[0_0_25px_rgba(110,231,255,0.5)]"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Launch Assistant</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/30 px-3.5 py-1 text-xs text-cyan-300 shadow-[0_0_15px_rgba(110,231,255,0.15)]"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-mono text-[11px] uppercase tracking-wider">
              Connected Intelligence Ecosystem
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Connect Neura with your{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              entire stack
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-base leading-relaxed text-white/70 md:text-lg"
          >
            Bridge Neura's multimodal reasoning with your version control, cloud
            infrastructure, IDEs, and databases. Instant bi-directional sync with zero friction.
          </motion.p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mt-14 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search integrations, tools, databases..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-white/30 focus:border-cyan-400/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-cyan-400/40 focus:shadow-[0_0_20px_rgba(110,231,255,0.15)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Quick Stats Counter */}
            <div className="flex items-center gap-3 text-xs text-white/60">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {Object.values(connectedMap).filter(Boolean).length} Active Connections
              </span>
              <span>•</span>
              <span>{filtered.length} Available Tools</span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-4">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                    active
                      ? "text-cyan-300"
                      : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {cat.label}
                  {active && (
                    <motion.div
                      layoutId="categoryActivePill"
                      className="absolute inset-0 -z-10 rounded-xl border border-cyan-400/40 bg-cyan-950/40 shadow-[0_0_15px_rgba(110,231,255,0.15)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Integration Cards Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => {
              const Icon = item.icon;
              const isConnected = !!connectedMap[item.id];
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.02 }}
                  onClick={() => setSelectedIntegration(item)}
                  className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 ${
                    isConnected
                      ? "border-cyan-400/30 bg-gradient-to-b from-[#091024]/90 to-[#060a17]/90 shadow-[0_0_25px_rgba(110,231,255,0.08)] hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(110,231,255,0.18)]"
                      : "border-white/[0.08] bg-[#070b18]/70 hover:border-white/20 hover:bg-[#0a0f22]/90"
                  }`}
                >
                  <div>
                    {/* Top Row: Icon + Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-transform duration-300 group-hover:scale-105"
                        style={{ color: item.accent }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-white/70">
                            {item.badge}
                          </span>
                        )}
                        {isConnected && (
                          <span className="flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Connected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="mt-4">
                      <h3 className="font-display text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-white/60 line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Tag Pills */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] font-mono text-white/50"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="mt-6 border-t border-white/[0.06] pt-4">
                    <button
                      type="button"
                      onClick={(e) => toggleConnection(item.id, e)}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all duration-200 ${
                        isConnected
                          ? "border border-white/10 bg-white/[0.04] text-white/70 hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300"
                          : "border border-cyan-400/30 bg-cyan-950/20 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/15 hover:text-white hover:shadow-[0_0_15px_rgba(110,231,255,0.2)]"
                      }`}
                    >
                      {isConnected ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Connected</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-3.5 w-3.5" />
                          <span>Connect Tool</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty Search Fallback */}
        {filtered.length === 0 && (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center">
            <SlidersHorizontal className="mx-auto h-8 w-8 text-white/30" />
            <h3 className="mt-3 font-display text-base font-semibold text-white">
              No matching integrations found
            </h3>
            <p className="mt-1 text-xs text-white/50">
              Try adjusting your search terms or view all categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 rounded-xl border border-cyan-400/30 bg-cyan-950/20 px-4 py-2 text-xs text-cyan-300 hover:bg-cyan-500/10"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Developer API & Webhook SDK Quickstart Panel */}
        <section className="mt-20 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#090f20]/90 via-[#060a16]/80 to-[#04060f]/90 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/30 px-3 py-0.5 text-xs text-cyan-300">
                <Code2 className="h-3.5 w-3.5" />
                <span className="font-mono text-[10px] uppercase tracking-wider">
                  DEVELOPER PLATFORM
                </span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                Build your own custom integrations
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Neura provides a high-throughput, type-safe API with native WebSockets and Server-Sent
                Events (SSE). Dispatch autonomous agent tasks, inject domain vectors, or register
                custom webhooks directly into your continuous deployment stack.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>Sub-45ms latency endpoint dispatch</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>HMAC-SHA256 authenticated webhook triggers</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>Full TypeScript, Python, and Go SDK support</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/app"
                  className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-[0_0_20px_rgba(110,231,255,0.3)] hover:opacity-90"
                >
                  <Bot className="h-4 w-4" />
                  <span>Try in Assistant Workspace</span>
                </Link>
                <a
                  href="mailto:developers@neura.ai?subject=Integration%20Access"
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-white/80 hover:border-cyan-400/40 hover:bg-white/[0.04]"
                >
                  <span>Request Custom Tool</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="relative rounded-2xl border border-white/10 bg-[#030611] p-5">
              {/* Snippet Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex gap-2">
                  {(["ts", "python", "curl"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveSnippetTab(tab)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-colors ${
                        activeSnippetTab === tab
                          ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      {tab === "ts" ? "TypeScript" : tab === "python" ? "Python" : "cURL"}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => copyCode(snippets[activeSnippetTab])}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/60 transition-colors hover:border-cyan-400/40 hover:text-white"
                >
                  {copiedSnippet ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Pre */}
              <pre className="mt-4 overflow-x-auto font-mono text-xs leading-relaxed text-cyan-100/90">
                <code>{snippets[activeSnippetTab]}</code>
              </pre>
            </div>
          </div>
        </section>
      </main>

      {/* Integration Detail Modal */}
      <AnimatePresence>
        {selectedIntegration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIntegration(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-cyan-400/30 bg-[#080d1e] p-7 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(110,231,255,0.1)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]"
                    style={{ color: selectedIntegration.accent }}
                  >
                    <selectedIntegration.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-white">
                      {selectedIntegration.name}
                    </h2>
                    <span className="font-mono text-[11px] text-cyan-400 uppercase tracking-wider">
                      {selectedIntegration.category} Integration
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-white/70">
                {selectedIntegration.description}
              </p>

              <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Status</span>
                  <span
                    className={
                      connectedMap[selectedIntegration.id]
                        ? "text-emerald-400 font-semibold"
                        : "text-white/70"
                    }
                  >
                    {connectedMap[selectedIntegration.id]
                      ? "● Connected & Synchronized"
                      : "○ Disconnected"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Sync Method</span>
                  <span className="font-mono text-white/80">Bidirectional Webhooks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Data Encryption</span>
                  <span className="font-mono text-emerald-300">TLS 1.3 / AES-256</span>
                </div>
              </div>

              {/* Supported Features */}
              <div className="mt-5">
                <h4 className="text-xs font-semibold text-white/80">Supported Capabilities</h4>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {selectedIntegration.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-cyan-400/20 bg-cyan-950/30 px-2.5 py-1 font-mono text-[11px] text-cyan-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    toggleConnection(selectedIntegration.id);
                  }}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                    connectedMap[selectedIntegration.id]
                      ? "border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                      : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(110,231,255,0.3)] hover:opacity-90"
                  }`}
                >
                  {connectedMap[selectedIntegration.id]
                    ? "Disconnect Integration"
                    : "Connect This Tool (1-Click)"}
                </button>
                <Link
                  to="/app"
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-white/80 hover:bg-white/[0.04]"
                >
                  Open in Workspace
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#03050c] pt-8 pb-28 text-center text-xs text-white/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <p>© {new Date().getFullYear()} Neura Intelligence Systems. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/app" className="hover:text-white transition-colors">
              Assistant Workspace
            </Link>
            <Link to="/auth" className="hover:text-white transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
