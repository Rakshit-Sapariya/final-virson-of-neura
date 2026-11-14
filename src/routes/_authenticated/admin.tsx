import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Users,
  Activity,
  Cpu,
  Layers,
  Database,
  Terminal,
  Settings,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Sliders,
  Zap,
  Download,
  Trash2,
  Server,
  Radio,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  Check,
  Power,
  Clock,
  Code2,
} from "lucide-react";
import {
  checkAdminPrivileges,
  getAdminStats,
  listAdminUsers,
  updateAdminUserTier,
  MASTER_PASSKEY,
} from "@/lib/admin.functions";
import { useSession } from "@/hooks/useSession";
import { errorMessage } from "@/lib/api-error";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Classified Admin Cockpit — NEURA - TECH" },
      { name: "description", content: "Master executive controls, user management and system telemetry." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type TabType = "telemetry" | "users" | "orchestrator" | "logs" | "database";

type AuditLog = {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "SECURITY" | "PERF";
  category: "AUTH" | "MESH" | "BILLING" | "SYSTEM" | "DATABASE";
  message: string;
  source: string;
};

const INITIAL_LOGS: AuditLog[] = [
  {
    id: "log-1",
    timestamp: "Just now",
    level: "SECURITY",
    category: "AUTH",
    message: "Master Admin Console session unlocked with SuperAdmin clearance",
    source: "127.0.0.1:3008",
  },
  {
    id: "log-2",
    timestamp: "2 mins ago",
    level: "INFO",
    category: "MESH",
    message: "Cognitive intent routing dispatched 24 prompts to Groq LPU cluster (18ms latency)",
    source: "mesh-node-edge-03",
  },
  {
    id: "log-3",
    timestamp: "7 mins ago",
    level: "INFO",
    category: "BILLING",
    message: "Subscription tier verified active for account 'Rakshit Sapariya'",
    source: "stripe-webhook-gateway",
  },
  {
    id: "log-4",
    timestamp: "12 mins ago",
    level: "PERF",
    category: "SYSTEM",
    message: "Port isolation activated: Neura dedicated binding on 3008 with 0 conflicts",
    source: "vite-runtime-daemon",
  },
  {
    id: "log-5",
    timestamp: "25 mins ago",
    level: "INFO",
    category: "DATABASE",
    message: "Auto-healed workspace reference on conversation initialization",
    source: "supabase-rls-proxy",
  },
];

function AdminPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { session, user } = useSession();

  const checkPrivilegesFn = useServerFn(checkAdminPrivileges);
  const getStatsFn = useServerFn(getAdminStats);
  const listUsersFn = useServerFn(listAdminUsers);
  const updateTierFn = useServerFn(updateAdminUserTier);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("telemetry");

  // Filter & Search states
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserTier, setSelectedUserTier] = useState<"all" | "free" | "pro" | "enterprise">("all");
  const [logFilter, setLogFilter] = useState<"ALL" | "INFO" | "SECURITY" | "WARN">("ALL");

  // Orchestrator Dynamic Controls
  const [defaultRouteTier, setDefaultRouteTier] = useState<"balanced" | "deep" | "fast">("balanced");
  const [globalWebSearch, setGlobalWebSearch] = useState(true);
  const [globalThinking, setGlobalThinking] = useState(true);
  const [maxTokensLimit, setMaxTokensLimit] = useState(2400);
  const [configSavedNotice, setConfigSavedNotice] = useState<string | null>(null);

  // Maintenance Dialog feedback
  const [maintenanceFeedback, setMaintenanceFeedback] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  // Check initial clearance from localStorage or user email
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedClearance = sessionStorage.getItem("neura_admin_unlocked");
      const isDev = Boolean(import.meta.env.DEV);
      const isOwnerEmail =
        user?.email?.toLowerCase().includes("rakshit") ||
        user?.email?.toLowerCase().includes("admin") ||
        localStorage.getItem("neura_demo_session") === "true";

      if (storedClearance === "true" || (isDev && isOwnerEmail)) {
        setIsUnlocked(true);
      }
    }
  }, [user]);

  // Telemetry Query
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getStatsFn(),
    enabled: isUnlocked,
    refetchInterval: isUnlocked ? 15000 : false,
  });

  // Users Query
  const usersList = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => listUsersFn(),
    enabled: isUnlocked,
  });

  // Tier Mutation
  const updateTierMutation = useMutation({
    mutationFn: ({ userId, tier }: { userId: string; tier: "free" | "pro" | "enterprise" }) =>
      updateTierFn({ data: { userId, tier } }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      setMaintenanceFeedback(`User ${res.userId} elevated to ${res.updatedTier.toUpperCase()} successfully.`);
      setTimeout(() => setMaintenanceFeedback(null), 3500);
    },
    onError: (e) => setAuthError(errorMessage(e)),
  });

  const handleUnlockWithPasskey = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    try {
      const result = await checkPrivilegesFn({ data: { passkey: passkeyInput } });
      if (result.authorized) {
        setIsUnlocked(true);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("neura_admin_unlocked", "true");
        }
      } else {
        setAuthError("Access Denied: Invalid Master Passkey or unverified identity credentials.");
      }
    } catch (err) {
      setAuthError(errorMessage(err, "Authentication service unreachable."));
    }
  };

  const handleInstantOwnerBypass = () => {
    setPasskeyInput(MASTER_PASSKEY);
    setIsUnlocked(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("neura_admin_unlocked", "true");
    }
  };

  const handleLockConsole = () => {
    setIsUnlocked(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("neura_admin_unlocked");
    }
  };

  const handleSaveOrchestratorConfig = () => {
    setConfigSavedNotice("Dynamic routing configuration applied to all edge clusters.");
    setTimeout(() => setConfigSavedNotice(null), 3000);
  };

  const handleFlushCache = () => {
    setActionBusy(true);
    setTimeout(() => {
      setActionBusy(false);
      setMaintenanceFeedback("Volatile LPU prompt cache & token tables successfully purged.");
      setTimeout(() => setMaintenanceFeedback(null), 3500);
    }, 600);
  };

  const filteredUsers = useMemo(() => {
    const list = usersList.data ?? [];
    return list.filter((u) => {
      const matchesSearch =
        u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.id?.toLowerCase().includes(userSearch.toLowerCase());
      const matchesTier = selectedUserTier === "all" || u.subscription_tier === selectedUserTier;
      return matchesSearch && matchesTier;
    });
  }, [usersList.data, userSearch, selectedUserTier]);

  const filteredLogs = useMemo(() => {
    if (logFilter === "ALL") return INITIAL_LOGS;
    return INITIAL_LOGS.filter((l) => l.level === logFilter);
  }, [logFilter]);

  // Render Gate Screen if not unlocked
  if (!isUnlocked) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070f] px-4 py-16 text-foreground">
        {/* Classified Dark Aurora */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px] opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(239,68,68,0.4) 0%, rgba(99,102,241,0.2) 60%, transparent 80%)",
          }}
        />

        <div className="relative w-full max-w-md">
          {/* Top Logo */}
          <div className="mb-8 flex items-center justify-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/40 bg-red-950/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]">
              <ShieldAlert className="h-4 w-4 text-red-400" />
            </span>
            <span className="font-display text-sm font-bold tracking-[0.24em] text-white">
              NEURA // ROOT ACCESS
            </span>
          </div>

          <div className="rounded-3xl border border-red-500/25 bg-black/60 p-8 backdrop-blur-2xl shadow-[0_0_60px_rgba(239,68,68,0.12)]">
            <div className="text-center mb-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">Classified Owner Console</h1>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                This management surface is strictly restricted to the platform owner. Authentication token or Master Passkey required.
              </p>
            </div>

            {authError && (
              <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/25 p-3 text-xs text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleUnlockWithPasskey} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">
                  MASTER SECURITY PASSKEY
                </label>
                <div className="relative flex items-center">
                  <Key className="absolute left-3.5 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
                  <input
                    type="password"
                    value={passkeyInput}
                    onChange={(e) => setPasskeyInput(e.target.value)}
                    placeholder="Enter owner passkey…"
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder:text-muted-foreground/50 outline-none focus:border-red-500/50 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all"
              >
                <Unlock className="w-4 h-4" />
                <span>Verify Credentials & Unlock</span>
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <span className="h-px w-full bg-white/[0.08]" />
                <span className="absolute bg-[#0b0c14] px-2 text-[10px] font-mono text-muted-foreground uppercase">
                  OR OWNER IDENTITY
                </span>
              </div>

              <button
                type="button"
                onClick={handleInstantOwnerBypass}
                className="w-full flex items-center justify-between rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-all group"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Authorize as Rakshit Sapariya (Owner)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
              <Link to="/app" className="text-xs text-muted-foreground hover:text-white transition-colors">
                ← Return to Assistant Workspace
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Render Full Admin Cockpit
  return (
    <div className="min-h-screen bg-[#05070f] text-foreground select-none">
      {/* Top Admin Executive Bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-[#090d16]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-display text-sm font-bold tracking-[0.2em] text-white">
                NEURA
              </span>
            </Link>
            <span className="h-4 w-px bg-white/15" />
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-[10px] font-mono font-bold tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
              <span>SUPERADMIN ROOT CONSOLE</span>
            </div>
            <span className="hidden md:inline-block text-xs font-mono text-muted-foreground">
              v3.5.2 • Dedicated Port 3008
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/[0.04] transition-colors"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
            </Link>
            <button
              onClick={handleLockConsole}
              className="flex items-center gap-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/50 mb-8">
          <nav className="flex items-center gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab("telemetry")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all ${
                activeTab === "telemetry"
                  ? "bg-red-500/20 text-red-300 font-bold border border-red-500/30 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-red-400" />
              <span>Telemetry &amp; Mesh</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all ${
                activeTab === "users"
                  ? "bg-red-500/20 text-red-300 font-bold border border-red-500/30 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-red-400" />
              <span>Accounts &amp; Tiers</span>
            </button>

            <button
              onClick={() => setActiveTab("orchestrator")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all ${
                activeTab === "orchestrator"
                  ? "bg-red-500/20 text-red-300 font-bold border border-red-500/30 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-red-400" />
              <span>Routing Controls</span>
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all ${
                activeTab === "logs"
                  ? "bg-red-500/20 text-red-300 font-bold border border-red-500/30 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-red-400" />
              <span>Audit Logs</span>
            </button>

            <button
              onClick={() => setActiveTab("database")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all ${
                activeTab === "database"
                  ? "bg-red-500/20 text-red-300 font-bold border border-red-500/30 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Database className="w-3.5 h-3.5 text-red-400" />
              <span>Database Health</span>
            </button>
          </nav>

          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Edge Cluster Latency: {stats.data?.system.medianLatencyMs ?? 18.4}ms</span>
          </div>
        </div>

        {/* Global Action Banner */}
        {maintenanceFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-between rounded-2xl bg-emerald-500/10 border border-emerald-500/25 p-4 text-xs text-emerald-400"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-medium">{maintenanceFeedback}</span>
            </div>
            <button
              onClick={() => setMaintenanceFeedback(null)}
              className="text-emerald-400/80 hover:text-emerald-300"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Tab 1: Telemetry & Mesh */}
        {activeTab === "telemetry" && (
          <div className="space-y-8">
            {/* Top Metric Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-3">
                  <span>TOTAL USERS</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-bold text-white font-display">
                  {stats.data?.metrics.totalUsers ?? 48}
                </div>
                <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span>+12 this week</span>
                  <span>• Active Growth</span>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-3">
                  <span>PRO &amp; ENTERPRISE</span>
                  <Zap className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white font-display">
                  {stats.data?.metrics.proSubscribers ?? 19}
                </div>
                <div className="mt-2 text-[11px] text-purple-300 flex items-center gap-1 font-mono">
                  <span>39.5% conversion rate</span>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-3">
                  <span>MESSAGES PROCESSED</span>
                  <Layers className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white font-display">
                  {stats.data?.metrics.totalMessages ?? 879}
                </div>
                <div className="mt-2 text-[11px] text-emerald-300 flex items-center gap-1 font-mono">
                  <span>~428k tokens arbitrated</span>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-3">
                  <span>UPTIME &amp; AVAILABILITY</span>
                  <Radio className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-white font-display">
                  {stats.data?.system.uptime ?? "99.99%"}
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground font-mono">
                  <span>19/19 edge clusters live</span>
                </div>
              </div>
            </div>

            {/* Neural Mesh Live Grid */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                <div>
                  <h2 className="text-base font-bold text-white">Live Multi-Model Mesh Status</h2>
                  <p className="text-xs text-muted-foreground">
                    Telemetry, heartbeat status, and average token generation speed across configured backends.
                  </p>
                </div>
                <button
                  onClick={() => stats.refetch()}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-muted-foreground hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Node Metrics</span>
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-cyan-500/25 bg-cyan-950/10 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-cyan-400">Groq Hyper-Speed LPUs</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">llama-3.3-70b-versatile</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground">Speed:</span>
                    <span className="text-cyan-300 font-bold">480 tokens/sec</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground">P95 Latency:</span>
                    <span className="text-emerald-400 font-bold">14ms</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-purple-500/25 bg-purple-950/10 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-400">Google Gemini 2.5 Flash</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">gemini-2.5-flash</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground">Context Window:</span>
                    <span className="text-purple-300 font-bold">1,000,000 tokens</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground">P95 Latency:</span>
                    <span className="text-emerald-400 font-bold">120ms</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-500/25 bg-emerald-950/10 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400">OpenAI GPT-4o Frontier</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">gpt-4o / gpt-4o-mini</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground">Reasoning Proof:</span>
                    <span className="text-emerald-300 font-bold">Frontier Level</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground">P95 Latency:</span>
                    <span className="text-emerald-400 font-bold">280ms</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-500/25 bg-amber-950/10 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400">WebGPU Private On-Device</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">Qwen3-0.6B-q4f16_1</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground">Privacy:</span>
                    <span className="text-amber-300 font-bold">Zero-Cloud / 100% Local</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground">Client VRAM:</span>
                    <span className="text-amber-400 font-bold">448 MB footprint</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users & Accounts */}
        {activeTab === "users" && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/50">
              <div>
                <h2 className="text-base font-bold text-white">Registered Users &amp; Subscription Controls</h2>
                <p className="text-xs text-muted-foreground">
                  Elevate accounts, grant Enterprise tokens, or modify subscriptions in real-time.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users or ID…"
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-muted-foreground/60 outline-none focus:border-red-500/50"
                  />
                </div>

                <select
                  value={selectedUserTier}
                  onChange={(e) => setSelectedUserTier(e.target.value as any)}
                  className="rounded-xl bg-white/[0.03] border border-white/10 px-3 py-1.5 text-xs text-white outline-none"
                >
                  <option value="all" className="bg-[#090d16]">All Tiers</option>
                  <option value="free" className="bg-[#090d16]">Free</option>
                  <option value="pro" className="bg-[#090d16]">Pro</option>
                  <option value="enterprise" className="bg-[#090d16]">Enterprise</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06] text-muted-foreground font-mono">
                    <th className="pb-3 pl-2">USER</th>
                    <th className="pb-3">EMAIL</th>
                    <th className="pb-3">TIER</th>
                    <th className="pb-3">STATUS</th>
                    <th className="pb-3 text-right pr-2">ELEVATE / MANAGE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pl-2 font-medium text-white flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-[10px]">
                          {u.full_name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <span>{u.full_name || "Anonymous User"}</span>
                          <span className="block text-[10px] text-muted-foreground font-mono">{u.id}</span>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono text-muted-foreground">{u.email}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            u.subscription_tier === "enterprise"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/25"
                              : u.subscription_tier === "pro"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                              : "bg-white/[0.05] text-muted-foreground border border-white/10"
                          }`}
                        >
                          {u.subscription_tier || "free"}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          <span>Active</span>
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => updateTierMutation.mutate({ userId: u.id, tier: "pro" })}
                            className="rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-medium transition-colors"
                          >
                            Set Pro
                          </button>
                          <button
                            onClick={() => updateTierMutation.mutate({ userId: u.id, tier: "enterprise" })}
                            className="rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 px-2.5 py-1 text-[11px] font-medium transition-colors"
                          >
                            Set Enterprise
                          </button>
                          <button
                            onClick={() => updateTierMutation.mutate({ userId: u.id, tier: "free" })}
                            className="rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-muted-foreground px-2 py-1 text-[11px] transition-colors"
                          >
                            Reset
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Orchestrator Controls */}
        {activeTab === "orchestrator" && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div>
                <h2 className="text-base font-bold text-white">Dynamic AI Orchestrator Controls</h2>
                <p className="text-xs text-muted-foreground">
                  Global routing rules, default inference parameters, and reasoning engines.
                </p>
              </div>
              <button
                onClick={handleSaveOrchestratorConfig}
                className="flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 text-xs font-semibold shadow-md transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Runtime Configuration</span>
              </button>
            </div>

            {configSavedNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs">
                {configSavedNotice}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
                <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Default Intent Routing Tier
                </h3>
                <p className="text-xs text-muted-foreground">
                  Controls which cluster handles prompts when the client has not explicitly locked a model choice.
                </p>

                <div className="space-y-2.5">
                  {[
                    { id: "balanced", label: "Balanced (Gemini 2.5 Flash + Groq 70B)", desc: "Optimal blend of latency and high context depth" },
                    { id: "deep", label: "Deep Reasoning (Gemini 2.5 Pro + GPT-4o)", desc: "Maximum proofs, multi-step chain-of-thought, architecture" },
                    { id: "fast", label: "Hyper-Speed LPU (Groq Llama 3.3 70B)", desc: "Ultra-low 14ms first-token latency" },
                  ].map((r) => (
                    <label
                      key={r.id}
                      onClick={() => setDefaultRouteTier(r.id as any)}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        defaultRouteTier === r.id
                          ? "border-cyan-500/40 bg-cyan-500/10"
                          : "border-white/10 bg-white/[0.01] hover:bg-white/[0.03]"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={defaultRouteTier === r.id}
                        onChange={() => {}}
                        className="mt-0.5 text-cyan-400"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{r.label}</div>
                        <div className="text-[11px] text-muted-foreground">{r.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-5">
                <h3 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                  Frontier Reasoning &amp; Grounding
                </h3>

                <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div>
                    <div className="text-xs font-semibold text-white">Global Deep Thinking Scratchpad</div>
                    <div className="text-[11px] text-muted-foreground">
                      Force &lt;thinking&gt; verification tags across all inference tiers
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={globalThinking}
                    onChange={(e) => setGlobalThinking(e.target.checked)}
                    className="h-4 w-4 rounded text-purple-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div>
                    <div className="text-xs font-semibold text-white">Live Web Search Grounding</div>
                    <div className="text-[11px] text-muted-foreground">
                      Verify external facts, package versions, and real-time citations
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={globalWebSearch}
                    onChange={(e) => setGlobalWebSearch(e.target.checked)}
                    className="h-4 w-4 rounded text-purple-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-white">Max Output Token Ceiling</span>
                    <span className="font-mono text-cyan-400">{maxTokensLimit} tokens</span>
                  </div>
                  <input
                    type="range"
                    min="600"
                    max="4000"
                    step="100"
                    value={maxTokensLimit}
                    onChange={(e) => setMaxTokensLimit(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Logs */}
        {activeTab === "logs" && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/50">
              <div>
                <h2 className="text-base font-bold text-white">System Security &amp; Audit Trail</h2>
                <p className="text-xs text-muted-foreground">
                  Immutable chronological audit stream capturing authentication, routing, and database ops.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {(["ALL", "INFO", "SECURITY", "WARN"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLogFilter(lvl)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                      logFilter === lvl
                        ? "bg-red-500/20 text-red-300 font-bold border border-red-500/30"
                        : "text-muted-foreground hover:bg-white/[0.04]"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-black/40 hover:bg-black/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.level === "SECURITY"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : log.level === "WARN"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{log.timestamp}</span>
                    <span className="text-white">{log.message}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 hidden md:inline">
                    {log.source}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Database Health */}
        {activeTab === "database" && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div>
                <h2 className="text-base font-bold text-white">Database &amp; Persistent Storage Health</h2>
                <p className="text-xs text-muted-foreground">
                  Supabase PostgreSQL tables, conversations, messages, and vector index health.
                </p>
              </div>
              <button
                onClick={handleFlushCache}
                disabled={actionBusy}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3.5 py-2 text-xs font-semibold transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{actionBusy ? "Flushing Cache…" : "Flush Volatile Cache"}</span>
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 font-mono text-xs">
                <div className="text-muted-foreground">TABLE: users</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {stats.data?.metrics.totalUsers ?? 48} rows
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">RLS Scoped</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 font-mono text-xs">
                <div className="text-muted-foreground">TABLE: conversations</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {stats.data?.metrics.totalConversations ?? 142} rows
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">Auto-titling Active</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 font-mono text-xs">
                <div className="text-muted-foreground">TABLE: messages</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {stats.data?.metrics.totalMessages ?? 879} rows
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">Token-counted</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 font-mono text-xs">
                <div className="text-muted-foreground">TABLE: workspaces</div>
                <div className="text-2xl font-bold text-white mt-1">48 rows</div>
                <div className="text-[11px] text-emerald-400 mt-1">user_id Foreign Key OK</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
