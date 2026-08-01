import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FEED = [
  "> initializing autonomous logic protocols...",
  "> linking Pragati-Setu macroeconomic kernel...",
  "> booting Resqnet OS telemetry...",
  "> turnover constraints: optimal",
  "> establishing connection with node 24BAI1086...",
  "> co-architects verified: Niketh, Pranjal",
];

export const TERMINAL_PING = "erchomai:logo-ping";

/**
 * Brutalist hidden terminal. Toggled with `~` or three rapid clicks on the logo.
 * Streams a looping raw telemetry feed in emerald.
 */
export function HiddenTerminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const clicks = useRef<number[]>([]);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "~" || e.key === "`") {
        const t = e.target as HTMLElement | null;
        if (t && /^(INPUT|TEXTAREA)$/.test(t.tagName)) return;
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onPing = () => {
      const now = Date.now();
      clicks.current = [...clicks.current, now].filter((t) => now - t < 900);
      if (clicks.current.length >= 3) {
        clicks.current = [];
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(TERMINAL_PING, onPing);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(TERMINAL_PING, onPing);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setLines([]);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      setLines((prev) => [...prev, FEED[i % FEED.length]].slice(-40));
      i += 1;
    }, 520);
    return () => window.clearInterval(id);
  }, [open]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines]);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-x-0 top-0 z-[75] border-b border-emerald/30 bg-obsidian/90 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between border-b border-emerald/20 px-5 py-2.5 md:px-12">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-emerald">
              erchomai // telemetry
            </span>
            <button
              onClick={() => setOpen(false)}
              className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald/70 transition-colors hover:text-emerald"
            >
              esc
            </button>
          </div>
          <div
            ref={scroller}
            className="max-h-[42vh] overflow-y-auto px-5 py-5 font-mono text-[11px] leading-relaxed text-emerald md:px-12 md:text-xs"
            style={{ textShadow: "0 0 10px rgba(0,166,118,0.55)" }}
          >
            {lines.map((l, i) => (
              <p key={i} className="whitespace-pre-wrap break-words">
                {l}
              </p>
            ))}
            <p className="mt-1">
              <span className="terminal-caret inline-block h-3 w-2 translate-y-0.5 bg-emerald" />
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
