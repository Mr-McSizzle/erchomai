import { Link } from "@tanstack/react-router";
import { Magnetic } from "@/components/site/Magnetic";

const LINKS = [
  { to: "/approach", label: "Approach" },
  { to: "/about", label: "About" },
  { to: "/work", label: "Work" },
  { to: "/contact", label: "Contact" },
] as const;

/** Shared interior-page footer: index-card metadata, no ornament. */
export function Footer() {
  return (
    <footer className="border-t border-porcelain/10 bg-obsidian px-6 py-14 md:px-12 md:py-20">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-light uppercase tracking-[0.5em] text-porcelain">
            Erchomai
          </p>
          <p className="mt-4 max-w-[30ch] text-xs font-light leading-relaxed text-titanium">
            Autonomous systems logic, alpha generation and execution architecture.
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Magnetic>
                <Link
                  to={l.to}
                  className="block text-[9px] font-light uppercase tracking-[0.3em] text-titanium transition-colors hover:text-porcelain"
                >
                  {l.label}
                </Link>
              </Magnetic>
            </li>
          ))}
        </ul>

        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-titanium">
          node 24BAI1086 — {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
