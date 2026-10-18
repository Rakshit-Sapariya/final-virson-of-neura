import { useEffect, useState } from "react";

export type PerfTier = "very-low" | "low" | "mid" | "high";

export type PerfProfile = {
  tier: PerfTier;
  reducedMotion: boolean;
  saveData: boolean;
  coarsePointer: boolean;
  /** True once we know WebGL is usable in this browser. */
  webgl: boolean;
  /** True until the client-side probe has run (SSR / first paint). */
  probing: boolean;
  /** True for <=2GB RAM mobile devices, budget quad-core phones, or data saver */
  is2GBorLower: boolean;
};

const SSR_PROFILE: PerfProfile = {
  tier: "low",
  reducedMotion: false,
  saveData: false,
  coarsePointer: false,
  webgl: false,
  probing: true,
  is2GBorLower: false,
};

let cachedWebgl: boolean | null = null;

function detectWebgl(): boolean {
  if (cachedWebgl !== null) return cachedWebgl;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    cachedWebgl = !!gl;
    // Free the context immediately; we only needed the capability answer.
    const lose = (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context");
    lose?.loseContext();
  } catch {
    cachedWebgl = false;
  }
  return cachedWebgl;
}

function detectProfile(): PerfProfile {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const small = window.matchMedia("(max-width: 768px)").matches;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const memory = nav.deviceMemory ?? (coarsePointer ? 2 : 8);
  const cores = navigator.hardwareConcurrency ?? (coarsePointer ? 4 : 8);
  const conn = nav.connection;
  const saveData = !!conn?.saveData;
  const slowNetwork = !!conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType);
  const webgl = detectWebgl();

  const is2GBorLower =
    memory <= 2 ||
    cores <= 2 ||
    (coarsePointer && memory <= 3) ||
    (coarsePointer && cores <= 4 && small) ||
    saveData ||
    slowNetwork;

  let tier: PerfTier;
  if (!webgl || reducedMotion || is2GBorLower) {
    tier = "very-low";
  } else if (memory <= 4 || cores <= 4 || (coarsePointer && small)) {
    tier = "low";
  } else if (coarsePointer || small || cores <= 6) {
    tier = "mid";
  } else {
    tier = "high";
  }

  return { tier, reducedMotion, saveData, coarsePointer, webgl, probing: false, is2GBorLower };
}

/**
 * Device capability probe used to scale 3D/animation workload.
 * Starts pessimistic (low, no WebGL) so SSR and the first paint never
 * commit to an expensive scene before we know what the device can take.
 */
export function usePerfTier(): PerfProfile {
  const [profile, setProfile] = useState<PerfProfile>(SSR_PROFILE);

  useEffect(() => {
    const update = () => setProfile(detectProfile());
    update();

    const queries = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(pointer: coarse)"),
      window.matchMedia("(max-width: 768px)"),
    ];
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);

  return profile;
}
