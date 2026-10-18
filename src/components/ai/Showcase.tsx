import { Reveal } from "./Reveal";
import { NeuralCognitiveCockpit } from "./NeuralCognitiveCockpit";

export function Showcase() {
  return (
    <section
      id="showcase"
      className="relative mx-auto max-w-7xl overflow-hidden px-6 py-28"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-[140px] opacity-40" />

      {/* Section Header */}
      <Reveal className="mx-auto max-w-3xl text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-4 shadow-[0_0_15px_rgba(110,231,255,0.15)]">
          <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
          <span>LIVE COGNITIVE SIMULATOR</span>
        </div>
        <h2 className="text-[clamp(2.2rem,4.4vw,3.6rem)] font-bold leading-[1.05]">
          Watch it <span className="text-gradient">think out loud</span>
        </h2>
        <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
          Step inside Neura's reasoning sandbox. Switch between expert cartridges, inspect real-time
          &lt;think&gt; deduction traces, trigger overclocked streaming, or test your own prompt.
        </p>
      </Reveal>

      {/* The Unexpected Interactive Cognitive Cockpit */}
      <Reveal delay={0.15}>
        <NeuralCognitiveCockpit />
      </Reveal>
    </section>
  );
}
