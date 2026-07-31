import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Minimal custom cursor: a 4px porcelain dot that expands into a translucent
 * emerald ring over interactive elements. Pointer-fine devices only.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 1200, damping: 80, mass: 0.25 });
  const sy = useSpring(y, { stiffness: 1200, damping: 80, mass: 0.25 });
  const raf = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const el = e.target as HTMLElement | null;
        setActive(!!el?.closest("a, button, [role='button'], [data-cursor='ring']"));
      });
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
    };
  }, [x, y, visible]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
    >
      <motion.div
        animate={
          active
            ? {
                width: 40,
                height: 40,
                backgroundColor: "rgba(0, 166, 118, 0.14)",
                borderColor: "rgba(0, 166, 118, 0.85)",
              }
            : {
                width: 4,
                height: 4,
                backgroundColor: "rgba(245, 245, 245, 1)",
                borderColor: "rgba(245, 245, 245, 0)",
              }
        }
        transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border"
      />
    </motion.div>
  );
}
