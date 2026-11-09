/**
 * Server-only AI core for Neura.
 *
 * Responsibilities:
 *  - provider/model abstraction (direct OpenAI + OpenRouter & Edge LPU)
 *  - safe selection: keys are read here only, never returned to the client
 *  - fallback across *configured* providers/models, with bounded retries
 *  - normalized response + normalized, user-safe error classification
 *  - cost-aware routing foundations (route tiers -> ordered model candidates)
 *
 * No provider is ever advertised unless its key actually exists in the env.
 */

export type ProviderMessage = { role: "system" | "user" | "assistant"; content: string };

export type ProviderId = "openai" | "openrouter" | "groq" | "gemini";

/** Cost-aware routing tiers. Cheapest capable model first within each tier. */
export type RouteTier = "fast" | "balanced" | "deep";

export const SYSTEM_PROMPT =
  "You are Neura, a precise and helpful AI assistant. Answer clearly and concisely. " +
  "Use markdown for structure and fenced code blocks for code. If you are unsure, say so.";

/** Detected request intent — drives routing tier and answer-shape guidance. */
export type Intent = "quick" | "code" | "analysis" | "creative" | "general";

/** Answer-shape guidance appended to the system prompt per detected intent. */
const INTENT_GUIDANCE: Record<Intent, string> = {
  quick: "This is a short factual request. Answer in one or two sentences, no preamble.",
  code:
    "This is a coding request. Lead with the code in a fenced block with a language tag, " +
    "then a brief explanation of the key decisions. Do not restate the question.",
  analysis:
    "This is an analytical request. Structure the answer with short headings or bullets, " +
    "state assumptions explicitly, and finish with a direct conclusion.",
  creative:
    "This is a creative/writing request. Prioritise voice and flow over structure, and skip meta commentary.",
  general: "Answer directly. Keep it tight — no filler, no restating the question.",
};

/** Build the system prompt for a detected intent. */
export function systemPromptFor(intent: Intent): string {
  return `${SYSTEM_PROMPT} ${INTENT_GUIDANCE[intent]}`;
}

const CODE_RE =
  /```|\b(bug|refactor|typescript|javascript|python|sql|regex|api|function|compile|stack ?trace|error:|npm|css|html|react)\b/i;
const ANALYSIS_RE =
  /\b(analy[sz]e|compare|trade-?offs?|pros and cons|why|evaluate|strategy|architecture|explain in detail|design a|plan for)\b/i;
const CREATIVE_RE = /\b(write|draft|story|poem|tagline|email|caption|slogan|rewrite|blog post)\b/i;

/**
 * Heuristic intent classification of the latest user turn.
 * Deliberately local + free: no extra model call, so routing costs nothing.
 */
export function classifyIntent(text: string): Intent {
  const t = text.trim();
  if (CODE_RE.test(t)) return "code";
  if (ANALYSIS_RE.test(t) || t.length > 600) return "analysis";
  if (CREATIVE_RE.test(t)) return "creative";
  if (t.length <= 120 && !/\n/.test(t)) return "quick";
  return "general";
}

/** Routing tier chosen for an intent when the user leaves the mode on auto. */
const INTENT_ROUTE: Record<Intent, RouteTier> = {
  quick: "fast",
  code: "deep",
  analysis: "deep",
  creative: "balanced",
  general: "balanced",
};

export function routeForIntent(intent: Intent): RouteTier {
  return INTENT_ROUTE[intent];
}

/** Verified model catalog mapping canonical identifiers to provider wire configurations */
export const MODEL_CATALOG: Record<
  string,
  {
    provider: ProviderId;
    url: string;
    envKey: string;
    wireModel: string;
  }
> = {
  // Groq LPU models
  "groq/llama-3.3-70b": {
    provider: "groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    envKey: "GROQ_API_KEY",
    wireModel: "llama-3.3-70b-versatile",
  },
  "groq/llama-3.1-8b": {
    provider: "groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    envKey: "GROQ_API_KEY",
    wireModel: "llama-3.1-8b-instant",
  },

  // Gemini / Google direct models
  "gemini/gemini-2.5-flash": {
    provider: "gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    envKey: "GEMINI_API_KEY",
    wireModel: "gemini-2.5-flash",
  },
  "gemini/gemini-2.5-pro": {
    provider: "gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    envKey: "GEMINI_API_KEY",
    wireModel: "gemini-2.5-pro",
  },

  // Direct OpenAI models
  "openai/gpt-4o-mini": {
    provider: "openai",
    url: "https://api.openai.com/v1/chat/completions",
    envKey: "OPENAI_API_KEY",
    wireModel: "gpt-4o-mini",
  },
  "openai/gpt-4o": {
    provider: "openai",
    url: "https://api.openai.com/v1/chat/completions",
    envKey: "OPENAI_API_KEY",
    wireModel: "gpt-4o",
  },

  // OpenRouter models (namespaced)
  "openrouter/llama-3.3-70b": {
    provider: "openrouter",
    url: "https://openrouter.ai/api/v1/chat/completions",
    envKey: "OPENROUTER_API_KEY",
    wireModel: "meta-llama/llama-3.3-70b-instruct:free",
  },
  "openrouter/deepseek-r1": {
    provider: "openrouter",
    url: "https://openrouter.ai/api/v1/chat/completions",
    envKey: "OPENROUTER_API_KEY",
    wireModel: "deepseek/deepseek-r1:free",
  },
};

/** UI Picker tag aliases mapped to candidate model chains */
const TAG_MAP: Record<string, string[]> = {
  "ultra-deep": ["gemini/gemini-2.5-pro", "gemini/gemini-2.5-flash", "openai/gpt-4o", "groq/llama-3.3-70b"],
  "omni-vision": ["gemini/gemini-2.5-flash", "openai/gpt-4o-mini", "groq/llama-3.3-70b"],
  "hyper-speed": ["groq/llama-3.3-70b", "groq/llama-3.1-8b", "gemini/gemini-2.5-flash"],
  "webgpu-596m": ["groq/llama-3.1-8b", "groq/llama-3.3-70b", "gemini/gemini-2.5-flash"],
};

/**
 * Gateway-namespaced model ids per route tier.
 * Order inside a tier = preference order (cheapest capable first, then fallback).
 */
const ROUTES: Record<RouteTier, string[]> = {
  fast: ["groq/llama-3.3-70b", "groq/llama-3.1-8b", "gemini/gemini-2.5-flash", "openai/gpt-4o-mini"],
  balanced: ["gemini/gemini-2.5-flash", "groq/llama-3.3-70b", "openai/gpt-4o-mini"],
  deep: ["gemini/gemini-2.5-pro", "gemini/gemini-2.5-flash", "openai/gpt-4o", "groq/llama-3.3-70b"],
};

export const DEFAULT_ROUTE: RouteTier = "balanced";
export const DEFAULT_MODEL = ROUTES[DEFAULT_ROUTE][0]!;

/**
 * Hard output-token ceiling per routing tier. This bounds the cost of a single
 * turn regardless of how long the model wants to keep going, so spend is capped
 * per message and not only by the monthly message allowance.
 */
const MAX_OUTPUT_TOKENS: Record<RouteTier, number> = {
  fast: 600,
  balanced: 1200,
  deep: 2000,
};

function tokenCapField(model: string): "max_completion_tokens" | "max_tokens" {
  const bare = model.startsWith("openai/") ? model.slice("openai/".length) : model;
  return /^(gpt-5|o\d)/.test(bare) ? "max_completion_tokens" : "max_tokens";
}

const REQUEST_TIMEOUT_MS = 60_000;

type ProviderConfig = {
  id: ProviderId;
  url: string;
  key: string;
  /** Wire model id for this provider. */
  model: string;
};

/** Returns the provider that can serve `model`, or null when unconfigured. */
function resolveProvider(model: string): ProviderConfig | null {
  // 1. Direct match in model catalog
  const catalogEntry = MODEL_CATALOG[model];
  if (catalogEntry) {
    const key = process.env[catalogEntry.envKey];
    if (key) {
      return {
        id: catalogEntry.provider,
        url: catalogEntry.url,
        key,
        model: catalogEntry.wireModel,
      };
    }
  }

  // 2. OpenAI prefix
  const openaiKey = process.env["OPENAI_API_KEY"];
  if (openaiKey && model.startsWith("openai/")) {
    return {
      id: "openai",
      url: "https://api.openai.com/v1/chat/completions",
      key: openaiKey,
      model: model.slice("openai/".length),
    };
  }

  // 3. Groq prefix or llama wire model
  const groqKey = process.env["GROQ_API_KEY"];
  if (groqKey && (model.startsWith("groq/") || model.includes("llama"))) {
    const bare = model.startsWith("groq/") ? model.slice("groq/".length) : model;
    return {
      id: "groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: groqKey,
      model: bare.includes("8b") ? "llama-3.1-8b-instant" : "llama-3.3-70b-versatile",
    };
  }

  // 4. Gemini prefix
  const geminiKey = process.env["GEMINI_API_KEY"];
  if (geminiKey && (model.startsWith("gemini/") || model.startsWith("google/"))) {
    const bare = model.replace(/^(gemini|google)\//, "");
    return {
      id: "gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      key: geminiKey,
      model: bare.includes("pro") ? "gemini-2.5-pro" : "gemini-2.5-flash",
    };
  }

  // 5. OpenRouter: only when explicitly prefixed or containing openrouter format
  const openrouterKey = process.env["OPENROUTER_API_KEY"];
  if (
    openrouterKey &&
    (model.startsWith("openrouter/") ||
      (model.includes("/") &&
        !model.startsWith("gemini/") &&
        !model.startsWith("groq/") &&
        !model.startsWith("openai/")))
  ) {
    const wireModel = model.startsWith("openrouter/") ? model.slice("openrouter/".length) : model;
    return {
      id: "openrouter",
      url: "https://openrouter.ai/api/v1/chat/completions",
      key: openrouterKey,
      model: wireModel,
    };
  }

  return null;
}

/** Ordered, de-duplicated list of candidates that are actually configured. */
function candidates(route: RouteTier, model?: string): ProviderConfig[] {
  const modelIds = model && TAG_MAP[model] ? TAG_MAP[model] : model ? [model] : [];
  const ids = [...modelIds, ...ROUTES[route]];
  const out: ProviderConfig[] = [];

  for (const id of ids) {
    const cfg = resolveProvider(id);
    if (!cfg) continue;
    if (out.some((c) => c.id === cfg.id && c.model === cfg.model)) continue;
    out.push(cfg);
  }

  // Fallback: If no candidate matched the requested models, find any configured provider in the catalog
  if (out.length === 0) {
    for (const [catId] of Object.entries(MODEL_CATALOG)) {
      const cfg = resolveProvider(catId);
      if (!cfg) continue;
      if (out.some((c) => c.id === cfg.id && c.model === cfg.model)) continue;
      out.push(cfg);
    }
  }

  return out;
}

/** True when any real AI provider key is configured in the environment. */
export function isAiConfigured(): boolean {
  return Boolean(
    process.env["OPENAI_API_KEY"] ||
      process.env["OPENROUTER_API_KEY"] ||
      process.env["GROQ_API_KEY"] ||
      process.env["GEMINI_API_KEY"],
  );
}

export type AiErrorKind =
  | "unconfigured"
  | "bad_request"
  | "auth"
  | "rate_limit"
  | "quota"
  | "timeout"
  | "network"
  | "upstream"
  | "empty";

export type CompletionResult =
  | { ok: true; content: string; model: string; provider: ProviderId }
  | { ok: false; status: number; kind: AiErrorKind; message: string };

type Attempt = { status: number; kind: AiErrorKind; message: string; retryable: boolean };

const MESSAGES: Record<AiErrorKind, string> = {
  unconfigured: "AI is not configured yet. Add an AI provider key in project settings.",
  bad_request: "That request could not be processed. Try shortening your message.",
  auth: "The AI service rejected our credentials. Please contact support.",
  rate_limit: "Rate limit reached. Please wait a moment and try again.",
  quota: "AI credits exhausted. Please top up to continue.",
  timeout: "The AI took too long to respond. Please retry.",
  network: "The AI service is unreachable. Please retry.",
  upstream: "The AI service failed to respond. Please retry.",
  empty: "The AI returned an empty response. Please retry.",
};

function classify(status: number): { kind: AiErrorKind; retryable: boolean } {
  // 404 (model not found on provider) and 400 (model specific param mismatch)
  // are retryable so the fallback chain can proceed to another configured candidate!
  if (status === 404) return { kind: "bad_request", retryable: true };
  if (status === 400 || status === 422) return { kind: "bad_request", retryable: true };
  if (status === 401 || status === 403) return { kind: "auth", retryable: false };
  if (status === 429) return { kind: "rate_limit", retryable: true };
  if (status === 402) return { kind: "quota", retryable: true };
  return { kind: "upstream", retryable: true };
}

/** Single provider call. `retryable` means "try the next configured candidate". */
async function callProvider(
  cfg: ProviderConfig,
  messages: ProviderMessage[],
  maxOutputTokens: number,
): Promise<CompletionResult | Attempt> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(cfg.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: cfg.model,
        messages,
        [tokenCapField(cfg.model)]: maxOutputTokens,
      }),
      signal: controller.signal,
    });
  } catch (error) {
    const aborted = (error as { name?: string })?.name === "AbortError";
    console.error("[ai:network]", cfg.id, cfg.model, aborted ? "timeout" : error);
    const kind: AiErrorKind = aborted ? "timeout" : "network";
    return { status: aborted ? 504 : 502, kind, message: MESSAGES[kind], retryable: true };
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const { kind, retryable } = classify(response.status);
    // Body is logged server-side only; provider payloads can echo request details.
    // Provider bodies can echo request content, so only the status is logged
    // outside development.
    const detail = import.meta.env.DEV ? await response.text().catch(() => "") : "";
    console.error("[ai:provider]", cfg.id, cfg.model, response.status, detail);
    return { status: response.status, kind, message: MESSAGES[kind], retryable };
  }

  const payload = (await response.json().catch(() => null)) as {
    choices?: Array<{ message?: { content?: string } }>;
  } | null;
  const content = payload?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    return { status: 502, kind: "empty", message: MESSAGES.empty, retryable: true };
  }
  return { ok: true, content, model: cfg.model, provider: cfg.id };
}

/**
 * Normalized completion with fallback across configured providers/models.
 * `model` (gateway-namespaced) pins a preferred candidate; the route tier supplies fallbacks.
 */
export async function createCompletion(
  messages: ProviderMessage[],
  model?: string,
  route: RouteTier = DEFAULT_ROUTE,
  /** Optional override of the tier's output-token ceiling. */
  maxOutputTokens?: number,
): Promise<CompletionResult> {
  const chain = candidates(route, model);
  if (chain.length === 0) {
    return { ok: false, status: 503, kind: "unconfigured", message: MESSAGES.unconfigured };
  }

  const cap = Math.max(1, Math.min(maxOutputTokens ?? MAX_OUTPUT_TOKENS[route], 4000));

  let last: Attempt | null = null;
  for (const cfg of chain) {
    const result = await callProvider(cfg, messages, cap);

    if ("ok" in result) return result;
    last = result;
    if (!result.retryable) break;
  }
  return {
    ok: false,
    status: last?.status ?? 502,
    kind: last?.kind ?? "upstream",
    message: last?.message ?? MESSAGES.upstream,
  };
}
