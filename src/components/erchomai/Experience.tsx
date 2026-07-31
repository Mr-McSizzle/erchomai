import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { Scene } from "./Scene";
import { Overlay } from "./Overlay";
import { scrollStore, clamp, damp, EASE } from "./scroll";

const PAGES = 8; // 8 x 100vh of scroll travel across the 7 scenes

/** Obsidian boot field shown while the procedural geometry is being built. */
function BootScreen({ done }: { done: boolean }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-obsidian"
        >
          <div className="h-px w-[38vw] max-w-[420px] overflow-hidden bg-porcelain/15">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.4, ease: EASE }}
              className="h-px w-full origin-left bg-porcelain"
            />
          </div>
          <p className="mt-5 text-[10px] font-light uppercase tracking-[0.42em] text-titanium">
            Calibrating
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


/**
 * Root of the Erchomai experience.
 * Owns the scroll driver: a raw ref for the render loop (no re-renders) and a
 * framer-motion value for the HTML overlay.
 */
export function Experience() {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

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
            onCreated={() => requestAnimationFrame(() => setReady(true))}
          >
            <Suspense fallback={null}>
              <Scene progressRef={smoothProgress} />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Preloader — obsidian field, 1px porcelain bar, tracked titanium readout. */}
      <Loader
        containerStyles={{ background: "#0B0B0B" }}
        innerStyles={{ width: "38vw", maxWidth: 420, height: 1, background: "rgba(245,245,245,0.14)" }}
        barStyles={{ height: 1, background: "#F5F5F5" }}
        dataStyles={{
          color: "#878681",
          fontFamily: "Inter, sans-serif",
          fontSize: "10px",
          fontWeight: 300,
          textTransform: "uppercase",
          letterSpacing: "0.42em",
          marginTop: "18px",
        }}
        dataInterpolation={(p) => `Calibrating ${p.toFixed(0)}%`}
      />
      <BootScreen done={ready} />
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
