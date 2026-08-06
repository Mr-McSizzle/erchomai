import { createContext, useContext } from "react";

/** Shared, render-free scroll state. Read inside useFrame without re-rendering. */
export type ScrollStore = {
  /** 0 -> 1 across the whole experience */
  progress: number;
  /** normalized scroll velocity, decays to 0 */
  velocity: number;
};

export const scrollStore: ScrollStore = { progress: 0, velocity: 0 };

export const ScrollContext = createContext<ScrollStore>(scrollStore);
export const useScrollStore = () => useContext(ScrollContext);

/** Scene anchor points (progress values) from the brief. */
export const SCENES = {
  hero: 0,
  consciousness: 0.15,
  intelligence: 0.3,
  exoskeleton: 0.45,
  synthetic: 0.6,
  decision: 0.75,
  ouroboros: 0.85,
  logo: 1,
} as const;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Linear remap with clamping. */
export const range = (v: number, inMin: number, inMax: number) =>
  clamp((v - inMin) / (inMax - inMin || 1));

/** Triangular window: 0 outside [a,c], 1 at b. */
export const window3 = (v: number, a: number, b: number, c: number) =>
  v < b ? range(v, a, b) : 1 - range(v, b, c);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** High-mass damping. Frame-rate independent, no spring, no overshoot. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

/** cubic-bezier(0.25, 1, 0.5, 1) approximation — precision easing, no bounce. */
export const easeOutQuint = (t: number) => 1 - Math.pow(1 - clamp(t), 5);

/**
 * Ken Perlin's smootherstep. Zero first *and* second derivative at both ends,
 * so chained segments join with no velocity or acceleration snap. This is the
 * default easing for anything driven continuously by scroll.
 */
export const smoother = (t: number) => {
  const x = clamp(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

/** Eased remap: range() + smootherstep, in one call. */
export const ramp = (v: number, inMin: number, inMax: number) => smoother(range(v, inMin, inMax));

export const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1];

export const PALETTE = {
  obsidian: "#0B0B0B",
  porcelain: "#F5F5F5",
  titanium: "#878681",
  emerald: "#00A676",
} as const;
