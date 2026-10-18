import { memo, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { MLCEngineInterface } from "@mlc-ai/web-llm";

/** 596M-parameter model (Qwen3-0.6B) that runs fully on-device via WebGPU. */
const LITE_MODEL = "Qwen3-0.6B-q4f16_1-MLC";
const LITE_LABEL = "Neura Lite (596M params, on-device)";
/** Small on-device context: last few turns only. */
const MAX_TURNS = 8;

type Msg = { role: "user" | "assistant"; content: string };

/** Strip Qwen3 thinking blocks so only the answer is shown. */
const clean = (t: string) => t.replace(/<think>[\s\S]*?(<\/think>|$)/g, "").trimStart();

export function LiteChat({ onExit }: { onExit: () => void }) {
  const engineRef = useRef<MLCEngineInterface | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "unsupported" | "error">(
    "idle",
  );
  const [progress, setProgress] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!("gpu" in navigator)) setStatus("unsupported");
    return () => {
      engineRef.current?.unload().catch(() => {});
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [msgs]);

  const load = async () => {
    setStatus("loading");
    try {
      const { CreateMLCEngine } = await import("@mlc-ai/web-llm");
      engineRef.current = await CreateMLCEngine(LITE_MODEL, {
        initProgressCallback: (r) => setProgress(r.text),
      });
      setStatus("ready");
    } catch (e) {
      console.error("[lite:load]", e);
      setStatus("error");
    }
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = input.trim();
    const engine = engineRef.current;
    if (!content || busy || !engine) return;
    setInput("");
    const history: Msg[] = [...msgs, { role: "user", content }];
    setMsgs([...history, { role: "assistant", content: "" }]);
    setBusy(true);
    try {
      const stream = await engine.chat.completions.create({
        stream: true,
        messages: [
          {
            role: "system",
            content: "You are Neura Lite, a concise helpful assistant. Answer briefly. /no_think",
          },
          ...history.slice(-MAX_TURNS),
        ],
      });
      let acc = "";
      for await (const chunk of stream) {
        acc += chunk.choices[0]?.delta?.content ?? "";
        const text = clean(acc);
        setMsgs((m) => [...m.slice(0, -1), { role: "assistant", content: text }]);
      }
    } catch (err) {
      console.error("[lite:chat]", err);
      setMsgs((m) => [
        ...m.slice(0, -1),
        { role: "assistant", content: "Lite mode couldn't answer. Please try again." },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {status !== "ready" && (
            <div className="glass mx-auto mt-10 max-w-md rounded-3xl p-8 text-center">
              <p className="font-display text-xs tracking-[0.3em] text-primary">LITE MODE</p>
              <h2 className="mt-3 font-display text-xl font-semibold">Tiny AI, on your device</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                A 596M-parameter model (Qwen3-0.6B) runs right in your browser, with a 32,768-token
                memory of the current chat. Free, private, and doesn't use your monthly messages.
                Chats here aren't saved. Answers are simpler than the main AI.
              </p>
              {status === "unsupported" && (
                <p className="mt-5 text-sm text-destructive">
                  Your browser doesn't support on-device AI (WebGPU). Try desktop Chrome or Edge.
                </p>
              )}
              {status === "error" && (
                <p className="mt-5 text-sm text-destructive">
                  Couldn't start Lite mode on this device.
                </p>
              )}
              {status === "loading" && (
                <p className="mt-5 text-xs text-muted-foreground" aria-live="polite">
                  {progress || "Starting…"}
                </p>
              )}
              {(status === "idle" || status === "error") && (
                <button
                  onClick={load}
                  className="mt-6 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Download & start (448 MB, one time only)
                </button>
              )}
              <button
                onClick={onExit}
                className="mt-4 block w-full text-xs text-muted-foreground underline"
              >
                Back to main AI
              </button>
            </div>
          )}
          {msgs.map((m, i) => (
            <LiteBubble key={i} role={m.role} content={m.content} />
          ))}
          {busy && msgs.at(-1)?.content === "" && (
            <p className="text-sm text-muted-foreground">Neura Lite is thinking…</p>
          )}
        </div>
      </div>

      <form onSubmit={send} className="border-t border-border/60 px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-3">
            <label htmlFor="lite-composer" className="sr-only">
              Message Neura Lite
            </label>
            <textarea
              id="lite-composer"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(e);
                }
              }}
              rows={1}
              disabled={status !== "ready"}
              placeholder={status === "ready" ? "Message Neura Lite…" : "Start Lite mode first"}
              className="max-h-40 min-h-[48px] flex-1 resize-y rounded-2xl border border-border bg-background/50 px-4 py-3 text-base outline-none focus:border-primary/60 disabled:opacity-60 sm:text-sm"
            />
            <button
              type="submit"
              disabled={status !== "ready" || busy || !input.trim()}
              className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "…" : "Send"}
            </button>
          </div>
          <div className="mt-2 flex items-center gap-3 px-1 text-[11px] text-muted-foreground">
            <span>{LITE_LABEL} · not saved · free</span>
            <button type="button" onClick={onExit} className="text-primary underline">
              Exit Lite
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

const LiteBubble = memo(function LiteBubble({ role, content }: Msg) {
  if (role === "user")
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-primary/80 px-4 py-3 text-sm leading-relaxed text-primary-foreground">
          {content}
        </div>
      </div>
    );
  return (
    <div className="prose prose-invert prose-sm max-w-none text-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      <p className="mt-1 text-[10px] text-muted-foreground">Answered by {LITE_LABEL}</p>
    </div>
  );
});
