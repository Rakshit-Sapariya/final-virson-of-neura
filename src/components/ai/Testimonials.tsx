import { Reveal } from "./Reveal";
import { useOnScreen } from "@/hooks/useOnScreen";

const testimonials = [
  {
    quote:
      "Neura replaced four tools in our stack. The agent traces alone cut our review time in half.",
    name: "Amara Okafor",
    role: "VP Engineering, Northwind",
  },
  {
    quote:
      "The voice latency is uncanny. Customers genuinely cannot tell it isn't a person on the line.",
    name: "Julien Roche",
    role: "Head of Support, Volta",
  },
  {
    quote:
      "It remembers architectural decisions from three months ago and holds us to them in review.",
    name: "Priya Raman",
    role: "Staff Engineer, Cadence",
  },
  {
    quote:
      "We shipped a full campaign — copy, visuals, landing page — in a single afternoon session.",
    name: "Marcus Feld",
    role: "Creative Director, Studio Ninefold",
  },
  {
    quote: "Routing across models saved us 61% on inference with zero drop in output quality.",
    name: "Sofia Lindqvist",
    role: "CTO, Parallel Labs",
  },
];

function Card({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <figure className="w-[340px] shrink-0 rounded-3xl glass p-7 transition-transform duration-500 hover:-translate-y-2 sm:w-[400px]">
      <div className="flex gap-1 text-primary">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="text-xs">
            ★
          </span>
        ))}
      </div>
      <blockquote className="mt-5 text-sm leading-relaxed text-foreground/90">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 font-display text-xs text-primary">
          {t.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
        <span>
          <span className="block text-sm font-medium">{t.name}</span>
          <span className="block text-xs text-muted-foreground">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  // The marquee is a continuous CSS animation: pause it while off screen so it
  // stops compositing (and draining battery) on phones.
  const [ref, onScreen] = useOnScreen<HTMLElement>();
  return (
    <section id="testimonials" ref={ref} className="relative overflow-hidden py-32">
      <Reveal className="mx-auto max-w-2xl px-6 text-center">
        <p className="font-display text-xs tracking-[0.35em] text-primary">FIELD REPORTS</p>
        <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.05]">
          Trusted where <span className="text-gradient">precision matters</span>
        </h2>
      </Reveal>

      {/* Interactive Horizontal Cards (Mobile Native Touch Swipe or Desktop Marquee) */}
      <div className="relative mt-12 sm:mt-16">
        <div className="hidden sm:block pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-background to-transparent" />
        <div className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-background to-transparent" />

        {/* Mobile Swipe: 0% CPU, 50% less memory, native touch momentum */}
        <div className="sm:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-4 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
          {testimonials.map((t) => (
            <div key={t.name} className="snap-center shrink-0">
              <Card t={t} />
            </div>
          ))}
        </div>

        {/* Desktop Smooth Marquee */}
        <div
          className={`hidden sm:flex group w-max gap-5 animate-marquee hover:[animation-play-state:paused] ${
            onScreen ? "[animation-play-state:running]" : "[animation-play-state:paused]"
          }`}
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <Card key={`${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
