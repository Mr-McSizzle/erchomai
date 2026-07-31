import type { ReactNode } from "react";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1];

/** Shared shell for the static interior pages: obsidian canvas, elegant fade-in. */
export function Page({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="min-h-screen w-full bg-obsidian text-porcelain"
    >
      {children}
    </motion.main>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[9px] font-light uppercase tracking-[0.5em] text-titanium md:text-[10px]">
      {children}
    </p>
  );
}
