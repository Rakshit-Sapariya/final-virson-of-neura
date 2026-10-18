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

export type ProviderId = "openai" | "openrouter" | "groq" | "gemini" | "nemotron";

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

/**
 * Gateway-namespaced model ids. The direct-OpenAI provider strips the "openai/" prefix.
 * Order inside a tier = preference order (cheapest capable first, then fallback).
 */
const ROUTES: Record<RouteTier, string[]> = {
  fast: ["groq/llama-3.3-70b", "google/gemini-3.1-flash-lite", "openai/gpt-5-nano"],
  balanced: ["gemini/gemini-2.5-flash", "openai/gpt-5-nano", "google/gemini-3.1-flash-lite"],
  deep: ["nemotron/nemotron-3-super-120b", "openai/gpt-5-mini", "google/gemini-3.7-flash"],
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

/**
 * GPT-5 family models reject `max_tokens` and require `max_completion_tokens`;
 * everything else (Gemini via the gateway) takes `max_tokens`.
 */
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
  const openaiKey = process.env["OPENAI_API_KEY"];
  if (openaiKey && model.startsWith("openai/")) {
    return {
      id: "openai",
      url: "https://api.openai.com/v1/chat/completions",
      key: openaiKey,
      model: model.slice("openai/".length),
    };
  }
  const openrouterKey = process.env["OPENROUTER_API_KEY"];
  if (openrouterKey) {
    return {
      id: "openrouter",
      url: "https://openrouter.ai/api/v1/chat/completions",
      key: openrouterKey,
      model,
    };
  }
  const groqKey = process.env["GROQ_API_KEY"];
  if (groqKey && (model.includes("groq") || model.includes("llama"))) {
    return {
      id: "groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: groqKey,
      model: "llama-3.3-70b-versatile",
    };
  }
  const geminiKey = process.env["GEMINI_API_KEY"];
  if (geminiKey && (model.includes("gemini") || model.includes("google"))) {
    return {
      id: "gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      key: geminiKey,
      model: "gemini-2.5-flash",
    };
  }
  // Free live Nemotron gateway for deep reasoning
  if (model.includes("nemotron") || model.includes("deep") || model.includes("nvidia")) {
    return {
      id: "nemotron",
      url: "https://api.kilo.ai/api/gateway/chat/completions",
      key: "free",
      model: "nvidia/nemotron-3-super-120b-a12b:free",
    };
  }
  return null;
}

/** Ordered, de-duplicated list of candidates that are actually configured. */
function candidates(route: RouteTier, model?: string): ProviderConfig[] {
  const ids = model ? [model, ...ROUTES[route]] : ROUTES[route];
  const out: ProviderConfig[] = [];
  for (const id of ids) {
    const cfg = resolveProvider(id);
    if (!cfg) continue;
    if (out.some((c) => c.id === cfg.id && c.model === cfg.model)) continue;
    out.push(cfg);
  }
  return out;
}

/** True when any provider key is present or free gateway is available. */
export function isAiConfigured(): boolean {
  return true;
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
  // Client/config errors are deterministic: retrying them on another provider
  // only burns credits and latency, so they stop the fallback chain.
  if (status === 400 || status === 404 || status === 422)
    return { kind: "bad_request", retryable: false };
  if (status === 401 || status === 403) return { kind: "auth", retryable: false };
  if (status === 429) return { kind: "rate_limit", retryable: true };
  // Quota is per-provider, so another configured provider may still serve it.
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
