import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const GLYPHS = "01∑∫λΔΩ▓▒░#@%&*<>/\\|=+-[]{}xyzΣπ∞≈∂";

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * Cypher / text-scramble reveal. Cycles randomized cryptographic glyphs before
 * locking each character into place, simulating quantitative processing.
 */
export function Scramble({
  text,
  className,
  as: Tag = "span",
  speed = 34,
  lockEvery = 2.2,
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  speed?: number;
  lockEvery?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    let raf = 0;
    let last = 0;

    const tick = (now: number) => {
      if (now - last >= speed) {
        last = now;
        frame += 1;
        const locked = Math.floor(frame / lockEvery);
        let next = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === " " || ch === "\n" || i < locked) next += ch;
          else next += randomGlyph();
        }
        setOut(next);
        if (locked >= text.length) return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, speed, lockEvery]);

  return (
    <Tag ref={ref as never} className={className}>
      {inView ? out : text}
    </Tag>
  );
}
