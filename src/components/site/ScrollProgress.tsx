import { motion, useScroll, useSpring } from "framer-motion";

/** 1px emerald scroll indicator pinned under the nav. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left bg-emerald/70"
    />
  );
}
