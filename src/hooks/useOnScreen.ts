import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Reports whether an element is in (or near) the viewport.
 * Used to stop timers and infinite animations for off-screen sections so
 * low-end devices don't burn CPU/battery on work nobody can see.
 */
export function useOnScreen<T extends HTMLElement>(
  rootMargin = "200px",
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setOnScreen(!!entry?.isIntersecting), {
      rootMargin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return [ref, onScreen];
}
