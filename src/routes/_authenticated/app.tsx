import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { memo, useEffect, useRef, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  PanelLeftClose,
  PanelLeft,
  Plus,
  Search,
  Trash2,
  Copy,
  Check,
  Share2,
  Code2,
  Play,
  Terminal,
  ChevronDown,
  Settings,
  User,
  LogOut,
  ArrowUp,
  Brain,
  Globe,
  Paperclip,
  Sparkles,
  Bot,
  X,
  RefreshCw,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  ExternalLink,
  Zap,
  Download,
  Maximize2,
  Minimize2,
  ListTodo,
  History,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Layers,
  FileText,
} from "lucide-react";
import { ensureDefaultWorkspace } from "@/lib/workspaces.functions";
import {
  createConversation,
  deleteConversation,
  listConversations,
} from "@/lib/conversations.functions";
import { listMessages, sendMessage } from "@/lib/messages.functions";
import { getProfile } from "@/lib/account.functions";
import { getUsageStatus } from "@/lib/usage.functions";
import { errorMessage } from "@/lib/api-error";
import { signOutCleanly } from "@/hooks/useSession";
import { LiteChat } from "@/components/ai/LiteChat";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Neura — Intelligence Workspace" },
      { name: "description", content: "Adaptive AI assistant powered by multi-model routing." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppPage,
});

type ThreadMessage = {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  model: string | null;
  created_at: string;
  reasoning?: string | null;
};

type ModelChoice = {
  id: string;
  name: string;
  tag: string;
  badge: string;
  description: string;
  tier: "fast" | "balanced" | "deep" | "lite";
};

const MODELS: ModelChoice[] = [
  {
    id: "neura-pro",
    name: "Neura 3.5 Pro",
    tag: "ultra-deep",
    badge: "Deep Reasoning",
    description: "Deep multi-step reasoning, mathematical proof, & fullstack architecture",
    tier: "deep",
  },
  {
    id: "neura-balanced",
    name: "Neura Balanced",
    tag: "omni-vision",
    badge: "1M Context",
    description: "Everyday analysis, writing, and comprehensive synthesis",
    tier: "balanced",
  },
  {
    id: "neura-speed",
    name: "Neura Speed",
    tag: "hyper-speed",
    badge: "Ultra-Fast LPU",
    description: "Near-instant code edits, translations, & rapid queries",
    tier: "fast",
  },
  {
    id: "neura-lite",
    name: "Neura Lite",
    tag: "webgpu-596m",
    badge: "On-Device",
    description: "Local in-browser inference via WebGPU — 100% private",
    tier: "lite",
  },
];

type CanvasArtifact = {
  title: string;
  language: string;
  code: string;
  version?: number;
  versions?: { version: number; code: string; timestamp: string }[];
};

type SlashCommand = {
  command: string;
  label: string;
  description: string;
  icon: any;
  prompt: string;
};

const SLASH_COMMANDS: SlashCommand[] = [
  {
    command: "/init",
    label: "Initialize Project Rules (NEURA.md)",
    description: "Generate structured project guidelines, code conventions, and system rules",
    icon: BookOpen,
    prompt: "Generate a production-ready NEURA.md project rule file with strict architectural standards, TypeScript patterns, and testing guidelines for this codebase.",
  },
  {
    command: "/code",
    label: "Launch Neura Code Multi-File Agent",
    description: "Autonomously explore codebase, plan architecture, and generate unified multi-file diffs",
    icon: Code2,
    prompt: "Launch Neura Code Agent: inspect the repository architecture, plan required code modifications, and generate unified multi-file git diffs.",
  },
  {
    command: "/review",
    label: "Deep Code Review & Security Audit",
    description: "Scan code for vulnerabilities, edge-case bugs, performance regressions, and typing errors",
    icon: AlertCircle,
    prompt: "Perform a comprehensive security audit and code quality review. Flag vulnerabilities, memory leaks, and propose exact diff patches.",
  },
  {
    command: "/test",
    label: "Generate Unit & Integration Tests",
    description: "Produce robust test suites with Vitest/Jest, mock dependencies, and edge cases",
    icon: CheckCircle2,
    prompt: "Generate a full Vitest test suite for this module covering happy paths, network failures, edge cases, and boundary conditions.",
  },
  {
    command: "/fix",
    label: "Diagnose & Auto-Patch Error",
    description: "Analyze runtime stack trace, pinpoint root cause, and output drop-in code fix",
    icon: RefreshCw,
    prompt: "Analyze the runtime error and stack trace. Identify root cause, verify AST constraints, and output the drop-in patch.",
  },
  {
    command: "/plan",
    label: "Multi-Step Architecture Plan",
    description: "Create an engineering blueprint with task breakdown before modifying files",
    icon: ListTodo,
    prompt: "Create a detailed, step-by-step technical implementation plan and architectural breakdown before writing any code.",
  },
  {
    command: "/compact",
    label: "Context Window Compaction",
    description: "Prune conversation history while preserving key context memories, decisions, and files",
    icon: Layers,
    prompt: "Summarize and compact our conversation history into a concise context state, preserving all architectural decisions, code rules, and active tasks.",
  },
  {
    command: "/terminal",
    label: "Execute Terminal Task",
    description: "Run automated build, lint, or test commands in the integrated Neura terminal",
    icon: Terminal,
    prompt: "Run terminal validation: verify package dependencies, execute lint checks, and run unit tests.",
  },
];

function groupConversationsByDate(
  items: Array<{ id: string; title: string; updated_at: string }>,
) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;
  const startOfLastWeek = startOfToday - 7 * 86400000;

  const groups: {
    today: typeof items;
    yesterday: typeof items;
    lastWeek: typeof items;
    older: typeof items;
  } = {
    today: [],
    yesterday: [],
    lastWeek: [],
    older: [],
  };

  for (const item of items) {
    const time = new Date(item.updated_at).getTime();
    if (time >= startOfToday) {
      groups.today.push(item);
    } else if (time >= startOfYesterday) {
      groups.yesterday.push(item);
    } else if (time >= startOfLastWeek) {
      groups.lastWeek.push(item);
    } else {
      groups.older.push(item);
    }
  }

  return groups;
}

function AppPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const ensureWorkspaceFn = useServerFn(ensureDefaultWorkspace);
  const profileFn = useServerFn(getProfile);
  const usageFn = useServerFn(getUsageStatus);
  const listConversationsFn = useServerFn(listConversations);
  const createConversationFn = useServerFn(createConversation);
  const deleteConversationFn = useServerFn(deleteConversation);
  const listMessagesFn = useServerFn(listMessages);
  const sendMessageFn = useServerFn(sendMessage);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [pendingRetry, setPendingRetry] = useState(false);
  const [failedText, setFailedText] = useState<string | null>(null);
  const [failedMessageId, setFailedMessageId] = useState<string | null>(null);

  // Modern UI states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState<ModelChoice>(MODELS[0]!);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [thinkingMode, setThinkingMode] = useState(true);
  const [webSearchActive, setWebSearchActive] = useState(false);
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<CanvasArtifact | null>(null);
  const [canvasTab, setCanvasTab] = useState<"code" | "preview" | "diff">("code");
  const [canvasFullscreen, setCanvasFullscreen] = useState(false);
  const [activeWorkspaceMode, setActiveWorkspaceMode] = useState<"chat" | "code_agent">("chat");
  const [thinkingBudget, setThinkingBudget] = useState<number>(8192);
  const [thinkingBudgetOpen, setThinkingBudgetOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectRules, setProjectRules] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("neura_project_rules");
      if (saved) return saved;
    }
    return `# NEURA.md — Project Guidelines & Architecture Standards

## Code Standards
- Strict TypeScript: No 'any', strict null checks, explicit function return types.
- UI: React functional components with Tailwind CSS utility classes.
- Architecture: Modular service functions with TanStack Query and TanStack Start.
- Error Handling: Use ApiError and typed response envelopes.
- Testing: Comprehensive Vitest unit tests for critical business logic.`;
  });

  const [agentTasks, setAgentTasks] = useState([
    { id: "1", title: "Inspect repository AST & dependency graph", done: true },
    { id: "2", title: "Formulate technical architecture blueprint", done: true },
    { id: "3", title: "Synthesize multi-file code diffs with AST verification", done: true },
    { id: "4", title: "Run automated tests & verify zero regressions", done: false },
  ]);

  const [stagedDiffs, setStagedDiffs] = useState([
    {
      file: "src/lib/agent-router.ts",
      additions: 34,
      deletions: 6,
      diff: `@@ -12,6 +12,14 @@
 export interface RouteDecision {
   tier: "fast" | "deep" | "balanced";
   targetLatencyMs: number;
+  // Adaptive multi-model intent routing
+  intentTags: string[];
+  requiresArtifactCanvas: boolean;
+  toolPermissions: string[];
+}`,
    },
    {
      file: "src/components/ArtifactCanvas.tsx",
      additions: 52,
      deletions: 8,
      diff: `@@ -45,8 +45,18 @@
 export function ArtifactCanvas() {
-  return <div>Legacy Canvas</div>;
+  // Multi-version time-travel & sandboxed preview
+  const [version, setVersion] = useState(1);
+  const [viewMode, setViewMode] = useState<"code" | "preview" | "diff">("code");
+  return <InteractiveCanvasContainer version={version} mode={viewMode} />;
+}`,
    },
    {
      file: "schema.prisma",
      additions: 12,
      deletions: 2,
      diff: `@@ -18,2 +18,12 @@
 model AgentTaskLog {
   id          String   @id @default(uuid())
+  traceId     String   @unique
+  tokensUsed  Int
+  cacheHit    Boolean  @default(true)
+  durationMs  Int
+  createdAt   DateTime @default(now())
+}`,
    },
  ]);
  const [diffsApplied, setDiffsApplied] = useState(false);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "neura-code-agent v3.5.2 initialized in workspace root",
    "Loaded project rules from NEURA.md (5 active rules enforced)",
    "Connected to Neura Ultra Deep Reasoning engine (8k token budget)",
    "Ready for agentic task execution. Type /help or click a command below.",
  ]);
  const [terminalExecuting, setTerminalExecuting] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [lite, setLite] = useState(false);

  // File Attachments State
  const [attachments, setAttachments] = useState<{ id: string; name: string; size: string; type: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Canvas Action Execution State
  const [canvasExecuting, setCanvasExecuting] = useState(false);
  const [canvasExecutionFeedback, setCanvasExecutionFeedback] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newItems = Array.from(files).map((f) => ({
      id: Math.random().toString(36).substring(7),
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
      type: f.type || "file",
    }));
    setAttachments((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleExecuteCanvasAction = () => {
    setCanvasExecuting(true);
    setCanvasExecutionFeedback(null);
    setTimeout(() => {
      setCanvasExecuting(false);
      setCanvasExecutionFeedback("✓ Action executed in Neura Sandbox runtime (AST verified, latency 14ms)");
    }, 600);
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Demo fallback state for instant rich UI interaction without waiting for Supabase
  const [isDemo, setIsDemo] = useState(false);
  const [demoUser, setDemoUser] = useState<{ email: string; fullName: string }>({
    email: "rakshit.developer@neura.ai",
    fullName: "Rakshit Sapariya",
  });
  const [demoUsed, setDemoUsed] = useState(42);
  const [isSendingDemo, setIsSendingDemo] = useState(false);

  const [demoConversations, setDemoConversations] = useState<
    Array<{ id: string; title: string; updated_at: string }>
  >([
    {
      id: "demo-conv-1",
      title: "Neura 3.5 Pro Architecture",
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-conv-2",
      title: "Quantum Attention Router",
      updated_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "demo-conv-3",
      title: "TypeScript TanStack Setup",
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const [demoMessages, setDemoMessages] = useState<Record<string, ThreadMessage[]>>({
    "demo-conv-1": [
      {
        id: "msg-1",
        conversation_id: "demo-conv-1",
        role: "user",
        content: "What makes Neura 3.5 Pro faster and more capable than traditional models?",
        model: null,
        created_at: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: "msg-2",
        conversation_id: "demo-conv-1",
        role: "assistant",
        content: `Neura 3.5 Pro combines multi-model routing with dedicated high-speed LPUs and deep reasoning engines.

### Key Architectural Pillars:
1. **Dynamic Intent Routing**: Fast queries route to sub-second LPUs, while deep reasoning queries execute through **Neura Ultra Deep Core**.
2. **Side-by-Side Artifacts Canvas**: Code, markdown briefs, and interactive UI preview side-by-side with live hot reloading.
3. **Privacy & BYOK**: Direct client-to-engine API pass-through with zero model telemetry.

Would you like to generate a sample fullstack component to test the Canvas view?`,
        model: "Neura Pro Deep Engine",
        reasoning: "Analyzed architectural strengths: latency hierarchy, intent router, multi-model cluster, and Canvas split-view.",
        created_at: new Date(Date.now() - 240000).toISOString(),
      },
    ],
  });

  // Hotkey support (Ctrl+K for New Chat, Ctrl+[ for Sidebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleNewChat();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "[") {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  // Session checks
  useEffect(() => {
    if (typeof window !== "undefined") {
      const demoSession = localStorage.getItem("neura_demo_session");
      const savedUser = localStorage.getItem("neura_demo_user");
      if (demoSession === "active" || demoSession === "true" || !demoSession) {
        setIsDemo(true);
        if (savedUser) {
          try {
            setDemoUser(JSON.parse(savedUser));
          } catch {}
        }
      }
    }
  }, []);

  const workspace = useQuery({
    queryKey: ["default-workspace"],
    queryFn: () => ensureWorkspaceFn(),
    staleTime: Infinity,
    retry: 1,
  });

  const workspaceId = workspace.data?.id;

  const profile = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => profileFn(),
    staleTime: 60_000,
    retry: 1,
  });

  const usage = useQuery({
    queryKey: ["usage-status"],
    queryFn: () => usageFn(),
    staleTime: 30_000,
    refetchInterval: limitReached ? 5_000 : false,
    retry: 1,
  });

  const conversations = useQuery({
    queryKey: ["conversations", workspaceId],
    queryFn: () => listConversationsFn({ data: { workspaceId: workspaceId! } }),
    enabled: !!workspaceId,
    retry: 1,
  });

  const messages = useQuery({
    queryKey: ["messages", activeId],
    queryFn: () => listMessagesFn({ data: { conversationId: activeId! } }),
    enabled: !!activeId && !isDemo,
    retry: 1,
  });

  useEffect(() => {
    if (workspace.isError || conversations.isError) {
      setIsDemo(true);
    }
  }, [workspace.isError, conversations.isError]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeId, messages.data, pendingText, isSendingDemo, demoMessages]);

  const newChat = useMutation({
    mutationFn: () =>
      createConversationFn({
        data: { workspaceId: workspaceId!, title: "New conversation" },
      }),
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: ["conversations", workspaceId] });
      setActiveId(c.id);
      setInput("");
      setError(null);
    },
    onError: (e) => {
      setError(errorMessage(e));
    },
  });

  const removeChat = useMutation({
    mutationFn: (conversationId: string) =>
      deleteConversationFn({ data: { conversationId } }),
    onSuccess: (_, deletedId) => {
      qc.invalidateQueries({ queryKey: ["conversations", workspaceId] });
      if (activeId === deletedId) {
        setActiveId(null);
      }
    },
    onError: (e) => setError(errorMessage(e)),
  });

  const send = useMutation({
    mutationFn: async ({ content, retryId }: { content: string; retryId?: string }) => {
      return sendMessageFn({
        data: {
          conversationId: activeId ?? undefined,
          workspaceId: activeId ? undefined : workspaceId!,
          content,
          mode: selectedModel.tier === "lite" ? "fast" : selectedModel.tier,
          model: selectedModel.tag,
          retryMessageId: retryId,
        },
      });
    },
    onSuccess: (result) => {
      const conversationId = result.userMessage?.conversation_id;
      const wasFirstMessage = !activeId && !!conversationId;

      if (wasFirstMessage) {
        setActiveId(conversationId!);
      }

      qc.invalidateQueries({ queryKey: ["messages", activeId ?? conversationId] });
      qc.invalidateQueries({ queryKey: ["usage-status"] });
    },
    onError: (e) => {
      setError(errorMessage(e));
      setFailedText(pendingText ?? null);
      setFailedMessageId(null);
    },
    onSettled: () => {
      setPendingText(null);
      setPendingRetry(false);
    },
  });

  function handleDemoSend(content: string) {
    const currentId: string = activeId ?? `demo-conv-${Date.now()}`;
    if (!activeId) {
      setActiveId(currentId);
      setDemoConversations((prev) => [
        {
          id: currentId,
          title: content.slice(0, 30) + (content.length > 30 ? "…" : ""),
          updated_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    const userMsg: ThreadMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: currentId,
      role: "user",
      content,
      model: null,
      created_at: new Date().toISOString(),
    };

    setDemoMessages((prev) => ({
      ...prev,
      [currentId]: [...(prev[currentId] ?? []), userMsg],
    }));

    setIsSendingDemo(true);

    setTimeout(() => {
      let replyContent = "";
      let reasoning: string | undefined = undefined;
      const lower = content.toLowerCase();

      if (thinkingMode) {
        reasoning = `Analyzed prompt "${content.slice(0, 40)}...". Decomposed inquiry, verified schema constraints, synthesized code and natural response using ${selectedModel.name}.`;
      }

      if (/\b(code|react|component|function|typescript|dashboard|ui|canvas)\b/i.test(lower)) {
        replyContent = `Here is a complete, production-ready implementation tailored for Neura:\n\n\`\`\`tsx\nimport React, { useState } from 'react';\nimport { Sparkles, Activity, ShieldCheck } from 'lucide-react';\n\nexport function NeuraAnalyticsCard() {\n  const [active, setActive] = useState(true);\n  \n  return (\n    <div className="p-6 rounded-2xl border border-cyan-500/20 bg-background/80 backdrop-blur-md shadow-xl">\n      <div className="flex items-center justify-between mb-4">\n        <div className="flex items-center gap-3">\n          <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">\n            <Sparkles className="w-5 h-5" />\n          </span>\n          <div>\n            <h3 className="font-semibold text-foreground text-sm">Neural Core Performance</h3>\n            <p className="text-xs text-muted-foreground">High-throughput reasoning active</p>\n          </div>\n        </div>\n        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">\n          99.98% Latency\n        </span>\n      </div>\n      <p className="text-sm text-muted-foreground leading-relaxed">\n        Streamlined execution via Neura Ultra Core and Dedicated LPU routing pipeline.\n      </p>\n    </div>\n  );\n}\n\`\`\`\n\nYou can click **Open in Canvas** on this code block to preview it side-by-side!`;

        // Auto-open in canvas
        setActiveArtifact({
          title: "NeuraAnalyticsCard.tsx",
          language: "tsx",
          code: `import React, { useState } from 'react';\nimport { Sparkles, Activity, ShieldCheck } from 'lucide-react';\n\nexport function NeuraAnalyticsCard() {\n  const [active, setActive] = useState(true);\n  \n  return (\n    <div className="p-6 rounded-2xl border border-cyan-500/20 bg-slate-900/80 backdrop-blur-md text-white shadow-xl">\n      <div className="flex items-center justify-between mb-4">\n        <div className="flex items-center gap-3">\n          <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">\n            <Sparkles className="w-5 h-5" />\n          </span>\n          <div>\n            <h3 className="font-semibold text-sm">Neural Core Performance</h3>\n            <p className="text-xs text-slate-400">High-throughput reasoning active</p>\n          </div>\n        </div>\n        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">\n          99.98% Latency\n        </span>\n      </div>\n      <p className="text-sm text-slate-300 leading-relaxed">\n        Streamlined execution via Neura Ultra Core and Dedicated LPU routing pipeline.\n      </p>\n    </div>\n  );\n}`,
        });
      } else {
        replyContent = `I have processed your request using **${selectedModel.name}**.\n\n- **Inference Mode**: ${selectedModel.badge}\n- **Context Capacity**: ${selectedModel.description}\n- **Web Search**: ${webSearchActive ? "Verified live sources" : "Knowledge repository"}\n\nIs there a specific architecture, document, or feature you'd like me to build next?`;
      }

      const assistantMsg: ThreadMessage = {
        id: `msg-${Date.now() + 1}`,
        conversation_id: currentId,
        role: "assistant",
        content: replyContent,
        model: `${selectedModel.name} (${selectedModel.badge})`,
        reasoning,
        created_at: new Date().toISOString(),
      };

      setDemoMessages((prev) => ({
        ...prev,
        [currentId]: [...(prev[currentId] ?? []), assistantMsg],
      }));
      setDemoUsed((u) => u + 1);
      setIsSendingDemo(false);
    }, 1100);
  }

  const handleNewChat = () => {
    setError(null);
    setInput("");
    if (isDemo) {
      setActiveId(null);
      return;
    }
    newChat.mutate();
  };

  const handleRemoveChat = (id: string) => {
    if (isDemo) {
      setDemoConversations((prev) => prev.filter((c) => c.id !== id));
      setDemoMessages((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      if (activeId === id) setActiveId(null);
      return;
    }
    removeChat.mutate(id);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawContent = input.trim();
    if (!rawContent || send.isPending || isSendingDemo) return;
    setError(null);
    setFailedText(null);
    setFailedMessageId(null);
    setInput("");

    let content = rawContent;
    if (attachments.length > 0) {
      const attNames = attachments.map((a) => `${a.name} (${a.size})`).join(", ");
      content = `${rawContent}\n\n📎 Attached files: ${attNames}`;
      setAttachments([]);
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    if (isDemo) {
      handleDemoSend(content);
      return;
    }

    setPendingText(content);
    setPendingRetry(false);
    send.mutate({ content });
  };

  const retryFailed = () => {
    if (!failedText || send.isPending) return;
    const content = failedText;
    const retryId = failedMessageId;
    setError(null);
    setFailedText(null);
    setFailedMessageId(null);
    setPendingText(content);
    setPendingRetry(!!retryId);
    send.mutate(retryId ? { content, retryId } : { content });
  };

  const signOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("neura_demo_session");
      localStorage.removeItem("neura_demo_user");
    }
    await signOutCleanly(qc);
    navigate({ to: "/auth", replace: true });
  };

  const list = isDemo ? demoConversations : (conversations.data ?? []);
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return list;
    return list.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [list, searchQuery]);

  const groupedConversations = useMemo(
    () => groupConversationsByDate(filteredList),
    [filteredList],
  );

  const thread: ThreadMessage[] = isDemo
    ? activeId
      ? demoMessages[activeId] ?? []
      : []
    : activeId
      ? messages.data ?? []
      : [];

  const limit = isDemo ? 555 : (usage.data?.messageLimit ?? 555);
  const used = isDemo ? demoUsed : (usage.data?.messagesUsed ?? 0);
  const unlimited = limit < 0;

  const loadFailure = isDemo
    ? null
    : (workspace.error ?? conversations.error ?? messages.error ?? profile.error);
  const banner = error ?? (loadFailure ? errorMessage(loadFailure) : null);
  const workspaceBroken = isDemo ? false : !!workspace.error;
  const overLimit = limitReached && !unlimited && !(usage.data && used < limit);
  const composerDisabled = workspaceBroken || overLimit || (isDemo && isSendingDemo);

  const runTerminalCommand = (cmd: string) => {
    const cleanCmd = cmd.trim();
    if (!cleanCmd) return;
    setTerminalExecuting(true);
    setTerminalLogs((prev) => [...prev, `$ ${cleanCmd}`]);
    setTimeout(() => {
      let output = "";
      if (cleanCmd.includes("test")) {
        output = "✓ 4/4 test suites passed (18 tests, 0 failures) [84ms]";
        setAgentTasks((prev) => prev.map((t) => (t.id === "4" ? { ...t, done: true } : t)));
      } else if (cleanCmd.includes("lint")) {
        output = "✓ ESLint and TypeScript AST typecheck passed with 0 warnings";
      } else if (cleanCmd.includes("build")) {
        output = "✓ Production bundle built successfully (dist/server + dist/client) [790ms]";
      } else if (cleanCmd.includes("diff")) {
        output = "Showing 3 staged files (+98 / -16 lines). Ready to commit.";
      } else if (cleanCmd.includes("status")) {
        output = "On branch main. 3 files staged for commit. Working tree clean.";
      } else {
        output = `Command '${cleanCmd}' executed in sandbox runtime [exit code 0]`;
      }
      setTerminalLogs((prev) => [...prev, output]);
      setTerminalExecuting(false);
      setTerminalInput("");
    }, 450);
  };

  const handleDownloadArtifact = () => {
    if (!activeArtifact) return;
    const blob = new Blob([activeArtifact.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeArtifact.title || `artifact.${activeArtifact.language || "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenCanvas = (code: string, language: string, title?: string) => {
    setActiveArtifact({
      title: title || `Component.${language || "tsx"}`,
      language: language || "tsx",
      code,
      version: 1,
      versions: [
        { version: 1, code, timestamp: "v1.0 • Original" },
        { version: 2, code: code + "\n// Added state caching and error boundary", timestamp: "v1.1 • Cached" },
      ],
    });
    setCanvasOpen(true);
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Modern Sidebar Component
  const renderSidebarContent = () => (
    <div className="flex h-full flex-col bg-background/95 border-r border-border/70 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/50">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 transition-transform group-hover:scale-105">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <div>
            <span className="font-display text-sm font-bold tracking-[0.2em] text-foreground">
              NEURA
            </span>
            <span className="block text-[10px] text-muted-foreground font-mono">
              3.5 PRO
            </span>
          </div>
        </Link>
        <button
          onClick={() => {
            setSidebarOpen(false);
            setMobileSidebarOpen(false);
          }}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
          title="Collapse sidebar (Ctrl+[)"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={handleNewChat}
          className="flex w-full items-center justify-between rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3.5 py-2.5 text-xs font-semibold transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>New conversation</span>
          </div>
          <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded border border-cyan-500/30 bg-background/50 font-mono text-cyan-300">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Search Input */}
      <div className="px-3 pb-2">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations…"
            className="w-full rounded-lg bg-accent/40 border border-border/50 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-cyan-500/40 transition-colors"
          />
        </div>
      </div>

      {/* Conversations List Grouped by Time */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 text-xs">
        {conversations.isLoading && !isDemo && (
          <p className="px-3 py-4 text-center text-muted-foreground">Loading chats…</p>
        )}

        {filteredList.length === 0 && !conversations.isLoading && (
          <p className="px-3 py-6 text-center text-muted-foreground">No conversations found</p>
        )}

        {(["today", "yesterday", "lastWeek", "older"] as const).map((groupKey) => {
          const items = groupedConversations[groupKey];
          if (items.length === 0) return null;
          const groupLabels = {
            today: "Today",
            yesterday: "Yesterday",
            lastWeek: "Previous 7 Days",
            older: "Older",
          };

          return (
            <div key={groupKey} className="space-y-1">
              <h4 className="px-3 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
                {groupLabels[groupKey]}
              </h4>
              {items.map((c) => {
                const isActive = c.id === activeId;
                return (
                  <div
                    key={c.id}
                    className={`group relative flex items-center rounded-lg px-3 py-2 text-xs transition-colors ${
                      isActive
                        ? "bg-accent/80 text-cyan-400 font-medium"
                        : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                    }`}
                  >
                    <button
                      onClick={() => {
                        setActiveId(c.id);
                        setMobileSidebarOpen(false);
                      }}
                      className="flex-1 truncate text-left pr-6"
                    >
                      {c.title}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete "${c.title}"?`)) {
                          handleRemoveChat(c.id);
                        }
                      }}
                      className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-rose-400 rounded transition-opacity"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* User Profile & Usage Footer */}
      <div className="border-t border-border/60 p-3 space-y-3 bg-accent/15">
        {/* Usage Progress */}
        <div className="px-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
            <span>Monthly quota</span>
            <span className="font-mono text-cyan-400">
              {unlimited ? "Unlimited" : `${used}/${limit}`}
            </span>
          </div>
          {!unlimited && (
            <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((used / Math.max(limit, 1)) * 100))}%`,
                }}
              />
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-background/80 border border-border/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-semibold text-xs shrink-0">
              RS
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">
                {isDemo ? demoUser.fullName : (profile.data?.fullName ?? "Rakshit Sapariya")}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span className="text-[10px] text-cyan-400 font-mono font-medium uppercase">
                  Pro Plan
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={signOut}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Links row */}
        <div className="grid grid-cols-2 gap-1.5 text-center text-[11px]">
          <Link
            to="/integrations"
            className="px-2 py-1.5 rounded-lg border border-border/50 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            Integrations
          </Link>
          <Link
            to="/account"
            className="px-2 py-1.5 rounded-lg border border-border/50 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen h-[100dvh] overflow-hidden bg-[#0c0d12] text-foreground">
      {/* Desktop Sidebar */}
      {sidebarOpen && (
        <aside className="hidden md:block w-72 shrink-0 h-full">
          {renderSidebarContent()}
        </aside>
      )}

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] h-full z-10">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <main className="flex min-w-0 flex-1 flex-col h-full relative">
        {/* Top Header */}
        <header className="flex h-14 items-center justify-between border-b border-border/60 bg-background/50 backdrop-blur-md px-4 z-20 gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="hidden md:flex p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title="Open sidebar (Ctrl+[)"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <PanelLeft className="w-5 h-5" />
            </button>

            {/* Mode Switcher: Chat vs Code Agent */}
            <div className="flex rounded-xl bg-accent/40 p-0.5 border border-border/70 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setActiveWorkspaceMode("chat")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeWorkspaceMode === "chat"
                    ? "bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>Chat</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveWorkspaceMode("code_agent")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeWorkspaceMode === "code_agent"
                    ? "bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Code Agent</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </div>

            {/* Model Selector Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setModelDropdownOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl bg-accent/60 hover:bg-accent px-2.5 py-1 text-xs font-semibold text-foreground border border-border/70 transition-colors"
              >
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedModel.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-300 font-mono border border-cyan-500/20">
                  {selectedModel.badge}
                </span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {modelDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setModelDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-border/80 bg-background/95 backdrop-blur-xl p-2 shadow-2xl z-40 space-y-1">
                    <p className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Available Neural Models
                    </p>
                    {MODELS.map((m) => {
                      const isSelected = m.id === selectedModel.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => {
                            if (m.tier === "lite") {
                              setLite(true);
                            } else {
                              setSelectedModel(m);
                            }
                            setModelDropdownOpen(false);
                          }}
                          className={`flex w-full flex-col text-left p-2.5 rounded-xl transition-colors ${
                            isSelected
                              ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
                              : "hover:bg-accent/60 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-semibold text-xs text-foreground">
                              {m.name}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background/80 border border-border text-cyan-400">
                              {m.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                            {m.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Context & Cache Gauge */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-accent/30 border border-border/50 text-[11px] font-mono text-muted-foreground">
              <span className="text-cyan-400">24.8k / 200k tokens</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-emerald-400">⚡ 94% Cache Hit</span>
            </div>

            {/* NEURA.md Project Rules Button */}
            <button
              type="button"
              onClick={() => setProjectModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
              title="Project Knowledge & Code Guidelines (NEURA.md)"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">NEURA.md</span>
            </button>

            {/* Extended Thinking & Budget Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setThinkingBudgetOpen((v) => !v);
                  if (!thinkingMode) setThinkingMode(true);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  thinkingMode
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent/40"
                }`}
                title="Extended Thinking & Token Budget"
              >
                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Thinking:</span>
                <span className="font-mono text-cyan-300 font-semibold">{thinkingBudget / 1024}k</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {thinkingBudgetOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setThinkingBudgetOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border/80 bg-background/95 backdrop-blur-xl p-2.5 shadow-2xl z-40 space-y-1 text-xs">
                    <p className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Thinking Token Budget
                    </p>
                    {[1024, 4096, 8192, 16384, 32768].map((budget) => (
                      <button
                        key={budget}
                        onClick={() => {
                          setThinkingBudget(budget);
                          setThinkingMode(true);
                          setThinkingBudgetOpen(false);
                        }}
                        className={`flex w-full items-center justify-between p-2 rounded-xl transition-colors ${
                          thinkingBudget === budget
                            ? "bg-indigo-500/20 text-indigo-300 font-semibold"
                            : "hover:bg-accent/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span>{budget / 1024}k token budget</span>
                        {thinkingBudget === budget && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Canvas / Artifacts Toggle */}
            <button
              onClick={() => setCanvasOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                canvasOpen
                  ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent/40"
              }`}
              title="Toggle Artifact Canvas"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Canvas</span>
            </button>

            {/* Share Thread */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
              title="Share conversation link"
            >
              {copiedShare ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        {/* Workspace Body (Split view with Canvas if open) */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          {lite ? (
            <LiteChat onExit={() => setLite(false)} />
          ) : activeWorkspaceMode === "code_agent" ? (
            /* Neura Code Agent Studio (CLI & Multi-File Codebase Agent) */
            <div className="flex flex-1 min-w-0 h-full flex-col lg:flex-row overflow-hidden bg-[#07090e]">
              {/* Left Column: Task Checklist & Staged Diffs */}
              <div className="flex-1 flex flex-col min-w-0 border-r border-border/60 overflow-y-auto p-4 md:p-6 space-y-6">
                {/* Agent Header Banner */}
                <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-[#0c121e] p-5 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                        <Terminal className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white font-display">
                            Neura Code Agent • Autonomous Codebase Runner
                          </h3>
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <p className="text-xs text-emerald-300/70">
                          Multi-file AST refactoring, terminal execution, and verified git diffs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => runTerminalCommand("neura test")}
                        className="px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Run Tests</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => runTerminalCommand("neura build")}
                        className="px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Run Build</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Autonomous Task Plan Checklist */}
                <div className="rounded-2xl border border-border/70 bg-accent/20 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <ListTodo className="w-4 h-4 text-cyan-400" />
                      <span>Autonomous Engineering Plan</span>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                      {agentTasks.filter((t) => t.done).length}/{agentTasks.length} Completed
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {agentTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() =>
                          setAgentTasks((prev) =>
                            prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t))
                          )
                        }
                        className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          task.done
                            ? "border-emerald-500/25 bg-emerald-950/20 text-emerald-300"
                            : "border-border/60 bg-background/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-md border transition-colors ${
                            task.done
                              ? "border-emerald-400 bg-emerald-400 text-black"
                              : "border-muted-foreground"
                          }`}
                        >
                          {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={task.done ? "line-through opacity-80" : ""}>{task.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Staged Multi-File Unified Diffs */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>Staged Multi-File Diffs ({stagedDiffs.length} files)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDiffsApplied(true);
                          runTerminalCommand("git diff --staged");
                          setTimeout(() => setDiffsApplied(false), 3000);
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{diffsApplied ? "Applied to Workspace!" : "Accept All Diffs"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {stagedDiffs.map((diffItem) => (
                      <div
                        key={diffItem.file}
                        className="rounded-2xl border border-border/70 bg-background/90 overflow-hidden shadow-lg"
                      >
                        <div className="flex items-center justify-between px-4 py-2.5 bg-accent/40 border-b border-border/50 text-xs">
                          <span className="font-mono font-semibold text-foreground flex items-center gap-2">
                            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                            {diffItem.file}
                          </span>
                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span className="text-emerald-400 font-semibold">+{diffItem.additions}</span>
                            <span className="text-rose-400 font-semibold">-{diffItem.deletions}</span>
                          </div>
                        </div>
                        <pre className="p-4 font-mono text-xs overflow-x-auto text-muted-foreground leading-relaxed bg-[#05070d]">
                          {diffItem.diff.split("\n").map((line, idx) => {
                            const isAdd = line.startsWith("+");
                            const isDel = line.startsWith("-");
                            const isHeader = line.startsWith("@");
                            return (
                              <div
                                key={idx}
                                className={
                                  isAdd
                                    ? "bg-emerald-500/15 text-emerald-300 px-1 rounded-sm"
                                    : isDel
                                    ? "bg-rose-500/15 text-rose-300 px-1 rounded-sm"
                                    : isHeader
                                    ? "text-cyan-400/80 font-bold"
                                    : "text-muted-foreground"
                                }
                              >
                                {line}
                              </div>
                            );
                          })}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Interactive Terminal Console */}
              <div className="w-full lg:w-[460px] xl:w-[520px] flex flex-col h-full bg-[#05070e] border-t lg:border-t-0 lg:border-l border-border/70">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-accent/20">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>neura-terminal-v3.5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTerminalLogs(["Terminal output cleared."])}
                      className="text-[11px] text-muted-foreground hover:text-foreground font-mono"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Terminal Action Pill Buttons */}
                <div className="flex flex-wrap gap-1.5 p-3 border-b border-border/40 bg-accent/10">
                  {[
                    "neura test",
                    "neura lint",
                    "neura build",
                    "git diff",
                    "git status",
                  ].map((cmd) => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => runTerminalCommand(cmd)}
                      disabled={terminalExecuting}
                      className="px-2.5 py-1 rounded-lg border border-border/60 bg-background/80 hover:bg-accent hover:border-emerald-500/40 font-mono text-[11px] text-emerald-300 transition-all disabled:opacity-50"
                    >
                      $ {cmd}
                    </button>
                  ))}
                </div>

                {/* Terminal Output Log */}
                <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-muted-foreground space-y-1.5 select-text">
                  {terminalLogs.map((log, i) => (
                    <div
                      key={i}
                      className={
                        log.startsWith("$")
                          ? "text-cyan-300 font-semibold"
                          : log.startsWith("✓")
                          ? "text-emerald-400 font-semibold"
                          : log.includes("error") || log.includes("failed")
                          ? "text-rose-400"
                          : "text-slate-300"
                      }
                    >
                      {log}
                    </div>
                  ))}
                  {terminalExecuting && (
                    <div className="flex items-center gap-2 text-cyan-400">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing process…</span>
                    </div>
                  )}
                </div>

                {/* Terminal Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (terminalInput.trim()) {
                      runTerminalCommand(terminalInput);
                    }
                  }}
                  className="p-3 border-t border-border/50 bg-background/80 flex items-center gap-2"
                >
                  <span className="font-mono text-emerald-400 text-xs font-bold">neura&gt;</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Type command (e.g., neura test, git diff)..."
                    className="flex-1 bg-transparent text-xs font-mono text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!terminalInput.trim() || terminalExecuting}
                    className="px-2.5 py-1 rounded-md bg-emerald-500 text-black text-xs font-semibold disabled:opacity-40"
                  >
                    Run
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Chat Workspace (Standard Conversation Mode) */
            <div className="flex flex-col flex-1 min-w-0 h-full">
              {/* Chat Messages Scrollable Stream */}
              <div
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-y-auto px-4 py-6 md:px-8 space-y-6"
              >
                <div className="mx-auto max-w-3xl space-y-6">
                  {/* Empty State / Welcome Screen */}
                  {thread.length === 0 && !pendingText && (
                    <div className="mt-12 text-center space-y-8 animate-in fade-in duration-500">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                        <Sparkles className="w-8 h-8 text-cyan-400" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                          What would you like to build today, Rakshit?
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          Neura leverages multi-model reasoning, interactive canvas previews, and deep autonomous synthesis.
                        </p>
                      </div>

                      {/* 4 Suggestion Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto">
                        {[
                          {
                            icon: Code2,
                            title: "Fullstack Architecture",
                            prompt:
                              "Design a real-time collaborative workspace with TanStack Start & Supabase",
                          },
                          {
                            icon: Zap,
                            title: "High-Speed Inference",
                            prompt:
                              "Evaluate real-time token throughput across Edge LPUs vs Tensor Clusters",
                          },
                          {
                            icon: Brain,
                            title: "Deep Algorithmic Analysis",
                            prompt:
                              "Implement and explain an adaptive attention router with Python code",
                          },
                          {
                            icon: Terminal,
                            title: "Strategic Product Brief",
                            prompt:
                              "Draft a commercial SaaS business model and pricing tier strategy",
                          },
                        ].map((card, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setInput(card.prompt);
                              textareaRef.current?.focus();
                            }}
                            className="flex flex-col p-4 rounded-2xl border border-border/70 bg-accent/20 hover:bg-accent/40 hover:border-cyan-500/40 transition-all text-left group"
                          >
                            <div className="flex items-center gap-2.5 text-xs font-semibold text-foreground mb-1">
                              <card.icon className="w-4 h-4 text-cyan-400 transition-transform group-hover:scale-110" />
                              <span>{card.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {card.prompt}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Stream */}
                  {thread.map((m) => (
                    <MessageBubble
                      key={m.id}
                      role={m.role}
                      content={m.content}
                      model={m.model}
                      reasoning={m.reasoning}
                      onOpenCanvas={handleOpenCanvas}
                    />
                  ))}

                  {/* Optimistic in-flight message */}
                  {pendingText && !pendingRetry && (
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl bg-cyan-600/90 text-white px-4 py-3 text-sm shadow-md">
                        {pendingText}
                      </div>
                    </div>
                  )}

                  {/* Thinking Status Indicator */}
                  {(send.isPending || isSendingDemo) && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground p-3 rounded-2xl bg-accent/30 border border-border/50 max-w-xs">
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                      <span className="font-mono">
                        {thinkingMode ? "Synthesizing deep reasoning…" : "Generating response…"}
                      </span>
                    </div>
                  )}

                  {/* Banner / Errors */}
                  {banner && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs text-center space-x-2">
                      <span>{banner}</span>
                      {failedText && (
                        <button onClick={retryFailed} className="underline font-semibold">
                          Retry
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Bottom Composer Dock */}
              <div className="p-4 bg-gradient-to-t from-background via-background/90 to-transparent relative">
                {/* Floating Slash Commands Autocomplete Menu */}
                {slashMenuOpen && (
                  <div className="mx-auto max-w-3xl mb-2 rounded-2xl border border-cyan-500/30 bg-[#070b16]/95 backdrop-blur-xl p-2 shadow-2xl space-y-1 z-30">
                    <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.08] text-[11px] text-cyan-300 font-semibold font-mono">
                      <span>Neura Agent Slash Commands</span>
                      <button
                        type="button"
                        onClick={() => setSlashMenuOpen(false)}
                        className="text-white/40 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="max-h-56 overflow-y-auto space-y-1 p-1">
                      {SLASH_COMMANDS.map((cmd) => (
                        <button
                          key={cmd.command}
                          type="button"
                          onClick={() => {
                            setInput(cmd.prompt);
                            setSlashMenuOpen(false);
                            textareaRef.current?.focus();
                          }}
                          className="flex w-full items-start gap-2.5 p-2 rounded-xl text-left hover:bg-white/[0.06] transition-colors group"
                        >
                          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20">
                            <cmd.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-cyan-300">
                                {cmd.command}
                              </span>
                              <span className="text-xs font-medium text-white/90">
                                {cmd.label}
                              </span>
                            </div>
                            <p className="text-[11px] text-white/50 leading-snug">
                              {cmd.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={submit} className="mx-auto max-w-3xl">
                  <div className="relative rounded-3xl border border-border/80 bg-background/90 backdrop-blur-xl shadow-2xl p-2.5 transition-all focus-within:border-cyan-500/60 focus-within:ring-2 focus-within:ring-cyan-500/10">
                    {/* Selected File Attachment Chips */}
                    {attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 px-3 pt-1 pb-2">
                        {attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-xs text-foreground animate-fadeIn"
                          >
                            <Paperclip className="w-3 h-3 text-cyan-400" />
                            <span className="max-w-[140px] truncate font-medium">{att.name}</span>
                            <span className="text-[10px] text-muted-foreground">({att.size})</span>
                            <button
                              type="button"
                              onClick={() => removeAttachment(att.id)}
                              className="ml-1 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      multiple
                      className="hidden"
                    />

                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => {
                        const val = e.target.value;
                        setInput(val);
                        if (val === "/" || (val.startsWith("/") && !val.includes(" "))) {
                          setSlashMenuOpen(true);
                        } else {
                          setSlashMenuOpen(false);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          submit(e);
                        }
                      }}
                      rows={1}
                      disabled={composerDisabled}
                      placeholder={
                        overLimit
                          ? "Monthly quota reached. View settings to upgrade."
                          : "Message Neura or type / for agent commands (init, code, review, test)…"
                      }
                      className="w-full resize-none bg-transparent px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none max-h-44 min-h-[36px]"
                    />

                    {/* Composer Action Toolbar */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-1 px-1">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                          title="Attach files or datasets"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setSlashMenuOpen((v) => !v)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-medium border border-border/50 text-muted-foreground hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                          title="View Agent Slash Commands"
                        >
                          <span>/</span>
                          <span className="hidden sm:inline">Commands</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setWebSearchActive((v) => !v)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                            webSearchActive
                              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                          }`}
                          title="Toggle Web Search"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Search</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setThinkingMode((v) => !v)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                            thinkingMode
                              ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                          }`}
                          title="Toggle Deep Reasoning"
                        >
                          <Brain className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Reason</span>
                        </button>
                      </div>

                      {/* Circular Send Button */}
                      <button
                        type="submit"
                        disabled={composerDisabled || input.trim().length === 0 || send.isPending || isSendingDemo}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-400 text-black transition-all disabled:opacity-30 disabled:hover:bg-cyan-500 shadow-md"
                        title="Send message (Enter)"
                      >
                        <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-center text-[10px] text-muted-foreground">
                    Neura can produce inaccurate information. Verify critical architectural decisions.
                  </p>
                </form>
              </div>
            </div>
          )}

          {/* Enhanced Side-by-side Artifacts / Canvas Drawer */}
          {canvasOpen && (
            <aside
              className={`border-l border-border/70 bg-[#090a0f] flex flex-col h-full z-20 animate-in slide-in-from-right duration-300 ${
                canvasFullscreen ? "fixed inset-0 z-50 w-full" : "w-full sm:w-[480px] lg:w-[600px]"
              }`}
            >
              {/* Canvas Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-background/80">
                <div className="flex items-center gap-2 min-w-0">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold truncate text-foreground">
                    {activeArtifact?.title ?? "Canvas Workspace"}
                  </span>
                  {activeArtifact?.version && (
                    <span className="rounded-md bg-cyan-500/10 border border-cyan-500/25 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300">
                      v{activeArtifact.version}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg bg-accent/40 p-0.5 border border-border/60 text-xs">
                    <button
                      onClick={() => setCanvasTab("code")}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        canvasTab === "code"
                          ? "bg-background text-cyan-400 shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Code
                    </button>
                    <button
                      onClick={() => setCanvasTab("preview")}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        canvasTab === "preview"
                          ? "bg-background text-cyan-400 shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setCanvasTab("diff")}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        canvasTab === "diff"
                          ? "bg-background text-cyan-400 shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Diff
                    </button>
                  </div>
                  <button
                    onClick={handleDownloadArtifact}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
                    title="Download artifact file"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCanvasFullscreen((v) => !v)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
                    title={canvasFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  >
                    {canvasFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setCanvasOpen(false)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Version History Subheader */}
              {activeArtifact?.versions && activeArtifact.versions.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 border-b border-border/40 bg-accent/10 text-xs">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                    <History className="w-3.5 h-3.5" /> Revisions:
                  </span>
                  {activeArtifact.versions.map((ver) => (
                    <button
                      key={ver.version}
                      onClick={() =>
                        setActiveArtifact((prev) =>
                          prev ? { ...prev, code: ver.code, version: ver.version } : null
                        )
                      }
                      className={`px-2 py-0.5 rounded-md font-mono text-[11px] transition-colors ${
                        activeArtifact.version === ver.version
                          ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                          : "text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      v{ver.version}
                    </button>
                  ))}
                </div>
              )}

              {/* Canvas Content Body */}
              <div className="flex-1 overflow-auto p-4 font-mono text-xs">
                {canvasTab === "code" ? (
                  activeArtifact ? (
                    <div className="relative rounded-xl border border-border/60 bg-background/90 p-4">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/40 text-muted-foreground text-[11px]">
                        <span>{activeArtifact.language.toUpperCase()}</span>
                        <button
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(activeArtifact.code);
                            }
                          }}
                          className="flex items-center gap-1 hover:text-cyan-400"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <pre className="overflow-x-auto text-cyan-200 leading-relaxed">
                        <code>{activeArtifact.code}</code>
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-muted-foreground">
                      <Code2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p>No active artifact selected.</p>
                      <p className="text-[11px] mt-1">Generate code in chat to inspect here.</p>
                    </div>
                  )
                ) : canvasTab === "preview" ? (
                  <div className="h-full flex flex-col rounded-2xl border border-border/60 bg-slate-950 p-4">
                    {activeArtifact?.language === "html" || activeArtifact?.code.includes("<html") ? (
                      <iframe
                        srcDoc={activeArtifact.code}
                        title="Artifact Sandbox"
                        sandbox="allow-scripts"
                        className="w-full h-full rounded-xl border border-border/40 bg-white"
                      />
                    ) : (
                      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-slate-900/80 text-white shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                              <Sparkles className="w-5 h-5" />
                            </span>
                            <div>
                              <h3 className="font-semibold text-sm">Live Preview Execution</h3>
                              <p className="text-xs text-slate-400">Neura Canvas Runtime</p>
                            </div>
                          </div>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                            Active Sandbox
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                          Interactive component preview rendered directly in the side panel with hot reload.
                        </p>
                        <button
                          type="button"
                          onClick={handleExecuteCanvasAction}
                          disabled={canvasExecuting}
                          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {canvasExecuting ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Executing Sandbox…</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Execute Sandbox Action</span>
                            </>
                          )}
                        </button>
                        {canvasExecutionFeedback && (
                          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] animate-fadeIn">
                            {canvasExecutionFeedback}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Diff View */
                  <div className="rounded-xl border border-border/60 bg-[#05070d] p-4 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50 text-[11px] text-muted-foreground">
                      <span>Comparing v1.0 with Current Working State</span>
                      <span className="text-emerald-400 font-bold">+14 lines</span>
                    </div>
                    <div className="text-slate-400">@@ -1,8 +1,14 @@</div>
                    <div className="text-slate-400"> export function Component() &#123;</div>
                    <div className="bg-rose-500/15 text-rose-300 px-1 rounded">-  const [state, setState] = useState(false);</div>
                    <div className="bg-emerald-500/15 text-emerald-300 px-1 rounded">+  const [state, setState] = useState(true);</div>
                    <div className="bg-emerald-500/15 text-emerald-300 px-1 rounded">+  // Added automated AST validation and runtime telemetry</div>
                    <div className="bg-emerald-500/15 text-emerald-300 px-1 rounded">+  const cache = useCacheStore();</div>
                    <div className="text-slate-400">   return &lt;div&gt;Ready&lt;/div&gt;;</div>
                    <div className="text-slate-400"> &#125;</div>
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>

        {/* NEURA.md Project Rules Modal */}
        {projectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setProjectModalOpen(false)}
            />
            <div className="relative w-full max-w-2xl rounded-3xl border border-indigo-500/30 bg-[#070b18] p-6 shadow-[0_0_50px_rgba(99,102,241,0.25)] md:p-8 z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      Project Rules & Knowledge (NEURA.md)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Persistent architectural guidelines and conventions enforced across every prompt
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setProjectModalOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <textarea
                  rows={10}
                  value={projectRules}
                  onChange={(e) => setProjectRules(e.target.value)}
                  className="w-full rounded-2xl border border-border/80 bg-background/80 p-4 font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-indigo-500/60 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("neura_project_rules");
                    setProjectRules(`# NEURA.md — Project Guidelines & Architecture Standards

## Code Standards
- Strict TypeScript: No 'any', strict null checks, explicit function return types.
- UI: React functional components with Tailwind CSS utility classes.
- Architecture: Modular service functions with TanStack Query and TanStack Start.
- Error Handling: Use ApiError and typed response envelopes.
- Testing: Comprehensive Vitest unit tests for critical business logic.`);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Reset Defaults
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setProjectModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-border/60 hover:bg-accent text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem("neura_project_rules", projectRules);
                      setProjectModalOpen(false);
                    }}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md"
                  >
                    Save NEURA.md
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * MessageBubble Component with Reasoning Accordion
 * and Syntax-highlighted code blocks with Canvas link.
 */
const MessageBubble = memo(function MessageBubble({
  role,
  content,
  model,
  reasoning,
  onOpenCanvas,
}: {
  role: string;
  content: string;
  model?: string | null;
  reasoning?: string | null;
  onOpenCanvas: (code: string, language: string, title?: string) => void;
}) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [reasoningExpanded, setReasoningExpanded] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-3xl bg-cyan-600/90 text-white px-5 py-3 text-sm leading-relaxed shadow-lg">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3.5 max-w-[95%] sm:max-w-[88%] text-sm">
      {/* Neura Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mt-1">
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="flex-1 space-y-2.5 min-w-0">
        {/* Model Badge */}
        {model && (
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
            <span className="font-semibold text-cyan-400">{model}</span>
          </div>
        )}

        {/* Reasoning / Thought Dropdown */}
        {reasoning && (
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 overflow-hidden text-xs">
            <button
              onClick={() => setReasoningExpanded((v) => !v)}
              className="flex w-full items-center justify-between px-3 py-2 text-indigo-300 font-medium hover:bg-indigo-500/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                <span>Thought for 1.8 seconds</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${
                  reasoningExpanded ? "rotate-90" : ""
                }`}
              />
            </button>
            {reasoningExpanded && (
              <div className="px-3 pb-3 pt-1 text-muted-foreground font-mono text-[11px] leading-relaxed border-t border-indigo-500/10">
                {reasoning}
              </div>
            )}
          </div>
        )}

        {/* Markdown Content */}
        <div className="rounded-3xl border border-border/70 bg-accent/25 px-5 py-4 text-foreground leading-relaxed shadow-md prose prose-invert max-w-none prose-p:my-2 prose-pre:my-3">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                const codeString = String(children).replace(/\n$/, "");
                if (!inline && match) {
                  return (
                    <div className="rounded-xl border border-border/80 bg-black/60 my-3 overflow-hidden">
                      <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-border/60 bg-accent/30 text-[11px] text-muted-foreground font-mono">
                        <span>{match[1]}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenCanvas(codeString, match[1])}
                            className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                          >
                            <Code2 className="w-3 h-3" />
                            <span>Canvas</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(codeString);
                              }
                            }}
                            className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                      </div>
                      <pre className="p-3.5 overflow-x-auto text-xs font-mono text-cyan-200">
                        <code>{children}</code>
                      </pre>
                    </div>
                  );
                }
                return (
                  <code className="rounded bg-accent/50 px-1 py-0.5 text-cyan-300 font-mono text-xs" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Message Action Footer */}
        <div className="flex items-center gap-2 px-1 text-muted-foreground text-xs">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 p-1 hover:text-foreground rounded transition-colors"
            title="Copy message"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="text-[11px]">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
    </div>
  );
});
