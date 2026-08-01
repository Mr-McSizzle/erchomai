import { motion, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE } from "./scroll";

const CYCLE = ["Research", "Simulation", "Prediction", "Execution", "Feedback", "Research"];

/** Fades a layer in over [a,b] and out over [c,d]. */
function useWindowOpacity(p: MotionValue<number>, a: number, b: number, c: number, d: number) {
  return useTransform(p, [a, b, c, d], [0, 1, 1, 0], { clamp: true });
}

export function Overlay({ progress }: { progress: MotionValue<number> }) {
  // Scene 1 — Consciousness
  const s1 = useWindowOpacity(progress, 0.08, 0.15, 0.22, 0.27);
  const s1y = useTransform(progress, [0.08, 0.27], [16, -16]);

  // Scene 2 — Intelligence (section eyebrow only; node labels live in 3D)
  const s2 = useWindowOpacity(progress, 0.24, 0.3, 0.36, 0.41);

  // Scene 3 — Exoskeleton
  const s3 = useWindowOpacity(progress, 0.39, 0.45, 0.52, 0.57);

  // Scene 4 — Synthetic world
  const s4a = useWindowOpacity(progress, 0.54, 0.6, 0.66, 0.71);
  const s4b = useWindowOpacity(progress, 0.585, 0.635, 0.66, 0.71);

  // Scene 5 — Decision
  const s5 = useWindowOpacity(progress, 0.7, 0.75, 0.8, 0.84);

  // Scene 6 — Ouroboros
  const s6 = useWindowOpacity(progress, 0.8, 0.86, 0.92, 0.955);

  // Scene 7 — Logo
  const s7 = useTransform(progress, [0.955, 0.985], [0, 1], { clamp: true });
  const s7y = useTransform(progress, [0.955, 1], [22, 0]);
  const logoTrack = useTransform(progress, [0.955, 1], ["0.62em", "0.34em"]);

  // Scene 0 — Hero
  const s0 = useTransform(progress, [0, 0.035, 0.075], [1, 1, 0], { clamp: true });
  const s0y = useTransform(progress, [0, 0.075], [0, -28]);
  const heroTrack = useTransform(progress, [0, 0.075], ["0.16em", "0.3em"]);

  // Persistent chrome
  const chrome = useTransform(progress, [0, 0.03, 0.94, 0.97], [1, 1, 1, 0], { clamp: true });
  const hint = useTransform(progress, [0, 0.02, 0.05], [1, 1, 0], { clamp: true });


  const t = { duration: 0.8, ease: EASE };

  return (
    <div className="pointer-events-none fixed inset-0 z-10 select-none">
      {/* Persistent chrome — sits clear of the global nav */}
      <motion.span
        style={{ opacity: chrome }}
        className="absolute bottom-8 left-6 hidden text-[10px] font-light uppercase tracking-[0.44em] text-titanium md:block md:left-12"
      >
        Engineered Intelligence
      </motion.span>

      <motion.div
        style={{ opacity: hint }}
        className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] font-light uppercase tracking-[0.5em] text-titanium">
          Scroll
        </span>
        <span className="h-10 w-px bg-gradient-to-b from-titanium/70 to-transparent" />
      </motion.div>


      {/* Scene 0 — Hero (split around the figure) */}
      <motion.div style={{ opacity: s0, y: s0y }} className="absolute inset-0">
        <motion.p
          style={{ letterSpacing: heroTrack }}
          className="absolute left-6 top-[16%] text-[9vw] font-extralight uppercase leading-[0.95] text-porcelain md:left-12 md:top-[18%] md:text-[5vw]"
        >
          The Future,
        </motion.p>
        <motion.p
          style={{ letterSpacing: heroTrack }}
          className="absolute bottom-[20%] right-6 text-[9vw] font-extralight uppercase leading-[0.95] text-titanium md:bottom-[18%] md:right-12 md:text-[5vw]"
        >
          Arrived.
        </motion.p>
      </motion.div>




      {/* Scene 1 */}
      <motion.div
        style={{ opacity: s1, y: s1y }}
        transition={t}
        className="absolute inset-y-0 left-0 flex w-full max-w-[42%] items-center px-6 md:px-12"
      >
        <p className="max-w-[14ch] text-xl font-extralight leading-[1.2] tracking-[0.02em] text-porcelain sm:text-3xl md:text-4xl">
          Every breakthrough begins here.
        </p>
      </motion.div>


      {/* Scene 2 */}
      <motion.div
        style={{ opacity: s2 }}
        className="absolute inset-x-0 top-[18%] flex justify-center px-8"
      >
        <p className="text-[10px] font-light uppercase tracking-[0.5em] text-titanium md:text-[11px]">
          Intelligence
        </p>
      </motion.div>

      {/* Scene 3 */}
      <motion.div
        style={{ opacity: s3 }}
        className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-8 px-6 pb-12 md:px-12 md:pb-16"
      >
        <p className="max-w-[8ch] text-left text-lg font-extralight leading-tight tracking-[0.04em] text-porcelain md:max-w-none md:text-3xl">
          Human ambition.
        </p>
        <p className="max-w-[10ch] text-right text-lg font-extralight leading-tight tracking-[0.04em] text-titanium md:max-w-none md:text-3xl">
          Engineered intelligence.
        </p>
      </motion.div>

      {/* Scene 4 */}
      <div className="absolute inset-0 flex flex-col items-start justify-end gap-2 px-6 pb-24 md:px-16 md:pb-28">
        <motion.p
          style={{ opacity: s4a }}
          className="text-left text-2xl font-extralight tracking-[0.02em] text-porcelain [text-shadow:0_2px_28px_rgba(11,11,11,0.95)] sm:text-3xl md:text-5xl"
        >
          Reality is expensive.
        </motion.p>
        <motion.p
          style={{ opacity: s4b }}
          className="text-left text-2xl font-extralight tracking-[0.02em] text-titanium [text-shadow:0_2px_28px_rgba(11,11,11,0.95)] sm:text-3xl md:text-5xl"
        >
          Simulation isn't.
        </motion.p>
      </div>

      {/* Scene 5 */}
      <motion.div
        style={{ opacity: s5 }}
        className="absolute inset-y-0 right-0 flex w-full max-w-[58%] items-center justify-end px-6 md:max-w-[46%] md:px-12"
      >
        <p className="max-w-[12ch] text-right text-xl font-extralight leading-[1.2] tracking-[0.02em] text-porcelain [text-shadow:0_2px_28px_rgba(11,11,11,0.95)] sm:text-3xl md:text-4xl">
          One decision. <span className="text-titanium">Infinite computation.</span>
        </p>
      </motion.div>


      {/* Scene 6 */}
      <motion.ul
        style={{ opacity: s6 }}
        className="absolute left-6 top-1/2 -translate-y-1/2 space-y-3 md:left-12 md:space-y-4"
      >
        {CYCLE.map((item, i) => (
          <li
            key={`${item}-${i}`}
            className="flex items-center gap-3 text-[10px] font-light uppercase tracking-[0.36em] md:text-xs"
            style={{ opacity: i === CYCLE.length - 1 ? 0.35 : 1 - i * 0.08 }}
          >
            <span className="h-px w-4 bg-titanium/60 md:w-6" />
            <span className={i === 0 ? "text-porcelain" : "text-titanium"}>{item}</span>
          </li>
        ))}
      </motion.ul>

      {/* Scene 7 */}
      <motion.div
        style={{ opacity: s7, y: s7y }}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6"
      >
        <motion.h1
          style={{ letterSpacing: logoTrack }}
          className="whitespace-nowrap text-center text-[7.6vw] font-extralight leading-none text-porcelain md:text-[9vw]"
        >
          ERCHOMAI
        </motion.h1>
        <p className="mt-6 text-center text-[9px] font-light uppercase tracking-[0.4em] text-titanium md:mt-8 md:text-xs md:tracking-[0.52em]">
          The Future, Arrived.
        </p>
        <Link
          to="/contact"
          className="group pointer-events-auto mt-12 inline-flex items-center gap-3 border border-porcelain/30 px-6 py-4 text-[9px] font-light uppercase tracking-[0.24em] text-porcelain transition-[background-color,border-color,color] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-emerald hover:bg-emerald hover:text-obsidian md:mt-14 md:px-12 md:py-5 md:text-xs md:tracking-[0.34em]"
        >
          Begin the Conversation
          <ArrowUpRight className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

      </motion.div>
    </div>
  );
}
