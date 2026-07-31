import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { useMotionValue } from "framer-motion";
import { Scene } from "./Scene";
import { Overlay } from "./Overlay";
import { scrollStore, clamp, damp } from "./scroll";

const PAGES = 8; // 8 x 100vh of scroll travel across the 7 scenes

/**
 * Root of the Erchomai experience.
 * Owns the scroll driver: a raw ref for the render loop (no re-renders) and a
 * framer-motion value for the HTML overlay.
 */
export function Experience() {
  const [mounted, setMounted] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const rawProgress = useRef(0);
  const smoothProgress = useRef(0);
  const motionProgress = useMotionValue(0);

  useEffect(() => setMounted(true), []);


  useEffect(() => {
    if (!mounted) return;
    let raf = 0;
    let last = performance.now();
    let prev = 0;

    const read = () => {
      const el = scroller.current;
      if (!el) return;
      const max = el.scrollHeight - window.innerHeight;
      rawProgress.current = clamp(max > 0 ? window.scrollY / max : 0);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      // High mass, high friction. No spring, no overshoot.
      smoothProgress.current = damp(smoothProgress.current, rawProgress.current, 4.2, dt);
      const v = (smoothProgress.current - prev) / (dt || 1 / 60);
      prev = smoothProgress.current;
      scrollStore.progress = smoothProgress.current;
      scrollStore.velocity = damp(scrollStore.velocity, v, 6, dt);
      motionProgress.set(smoothProgress.current);
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [mounted, motionProgress]);

  return (
    <div ref={scroller} className="relative w-full bg-obsidian" style={{ height: `${PAGES * 100}vh` }}>
      <div className="fixed inset-0 h-[100svh] w-full">
        {mounted && (
          <Canvas
            dpr={[1, 1.75]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            camera={{ position: [0, 0.95, 6.4], fov: 38, near: 0.1, far: 90 }}
          >
            <Scene progressRef={smoothProgress} />
          </Canvas>
        )}
      </div>
      <Overlay progress={motionProgress} />
      {/* Accessible, crawlable content beneath the visual experience. */}
      <div className="sr-only">
        <h1>Erchomai — The Future, Arrived.</h1>
        <p>
          Erchomai builds engineered intelligence: research, simulation, forecasting, synthetic
          markets, synthetic customers and execution, wrapped around human ambition.
        </p>
      </div>
    </div>
  );
}
