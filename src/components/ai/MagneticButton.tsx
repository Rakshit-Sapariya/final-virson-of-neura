import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
  strength?: number;
};

export function MagneticButton({
  children,
  className,
  variant = "primary",
  strength = 0.35,
  ...props
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate3d(0,0,0)";
  };

  return (
    <button
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={cn(
        "group relative isolate overflow-hidden rounded-full px-8 py-4 text-sm font-medium tracking-wide transition-[transform,box-shadow,background-color] duration-300 ease-out",
        variant === "primary"
          ? "bg-primary text-primary-foreground glow-ring hover:shadow-[0_0_60px_-6px_var(--glow)]"
          : "glass text-foreground hover:bg-foreground/10",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(140px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--glow) 45%, transparent), transparent 70%)",
        }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
