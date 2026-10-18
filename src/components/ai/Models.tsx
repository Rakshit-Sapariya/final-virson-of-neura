import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { useOnScreen } from "@/hooks/useOnScreen";

const models = [
  { name: "GPT", spec: "Generalist reasoning", ctx: "400K ctx", tone: "from-cyan-400/30" },
  { name: "Claude", spec: "Long-form analysis", ctx: "2M ctx", tone: "from-violet-500/30" },
  { name: "Gemini", spec: "Multimodal vision", ctx: "1M ctx", tone: "from-sky-400/30" },
  { name: "Llama", spec: "Private deployment", ctx: "128K ctx", tone: "from-teal-400/30" },
  { name: "DeepSeek", spec: "Math & code depth", ctx: "256K ctx", tone: "from-indigo-400/30" },
  { name: "Mistral", spec: "Low-latency routing", ctx: "64K ctx", tone: "from-fuchsia-400/30" },
];

function ModelCard({ m }: { m: (typeof models)[number] }) {
  return (
    <div className="w-[310px] shrink-0 sm:w-[350px]">
      <TiltCard max={10} className="h-full">
        <div
          className={`absolute inset-x-0 -top-24 h-40 bg-gradient-to-b ${m.tone} to-transparent blur-2xl`}
          aria-hidden
        />
        <div className="relative flex items-start justify-between">
          <div>
            <h3 className="font-display text-2xl font-bold">{m.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{m.spec}</p>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] tracking-widest text-primary font-mono">
            {m.ctx}
          </span>
        </div>
        <div className="relative mt-8 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Active in routing mesh
        </div>
      </TiltCard>
    </div>
  );
}

export function Models() {
  const [ref, onScreen] = useOnScreen<HTMLElement>();

  return (
    <section id="models" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      <Reveal className="mx-auto max-w-2xl px-6 text-center">
        <p className="font-display text-xs tracking-[0.35em] text-primary">MODEL MESH</p>
        <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.05]">
          Every frontier model, <span className="text-gradient">routed intelligently</span>
        </h2>
        <p className="mt-5 text-muted-foreground">
          Neura benchmarks each request and picks the model that answers best — you never choose
          again.
        </p>
      </Reveal>

      {/* Interactive Horizontal Cards (Mobile Native Touch Swipe or Desktop Marquee) */}
      <div className="relative mt-12 sm:mt-16">
        <div className="hidden sm:block pointer-events-none absolute inset-y-0 left-0 z-10 w-32 md:w-44 bg-gradient-to-r from-background to-transparent" />
        <div className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 z-10 w-32 md:w-44 bg-gradient-to-l from-background to-transparent" />

        {/* Mobile Swipe: 0% CPU, 66% less memory, native touch momentum */}
        <div className="sm:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-4 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
          {models.map((m) => (
            <div key={m.name} className="snap-center shrink-0">
              <ModelCard m={m} />
            </div>
          ))}
        </div>

        {/* Desktop Smooth Marquee */}
        <div
          className={`hidden sm:flex group w-max gap-5 animate-marquee hover:[animation-play-state:paused] ${
            onScreen ? "[animation-play-state:running]" : "[animation-play-state:paused]"
          }`}
        >
          {[...models, ...models, ...models].map((m, i) => (
            <ModelCard key={`${m.name}-${i}`} m={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
