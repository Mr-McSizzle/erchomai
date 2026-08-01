import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/site/Magnetic";
import { TERMINAL_PING } from "@/components/site/HiddenTerminal";


const LINKS = [
  { to: "/approach", label: "Approach" },
  { to: "/about", label: "About" },
  { to: "/work", label: "Work" },
  { to: "/contact", label: "Contact" },
] as const;

/** Persistent, ultra-minimal top navigation. Solid obsidian backdrop on scroll (inner pages only). */
export function Nav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !isHome && scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        solid ? "bg-obsidian/95 backdrop-blur-sm" : "bg-transparent",
      )}
    >
      <nav className="flex items-center justify-between gap-4 px-5 py-5 md:px-12">
        <Magnetic>
          <Link
            to="/"
            onClick={() => window.dispatchEvent(new Event(TERMINAL_PING))}
            className="block shrink-0 text-[10px] font-light uppercase tracking-[0.34em] text-porcelain transition-opacity hover:opacity-60 md:tracking-[0.5em]"
          >
            Erchomai
          </Link>
        </Magnetic>
        <ul className="flex items-center gap-3.5 sm:gap-5 md:gap-9">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Magnetic>
                <Link
                  to={l.to}
                  className="block text-[9px] font-light uppercase tracking-[0.16em] sm:tracking-[0.28em] text-titanium transition-colors hover:text-porcelain md:text-[10px] md:tracking-[0.4em]"
                  activeProps={{ className: "!text-porcelain" }}
                >
                  {l.label}
                </Link>
              </Magnetic>
            </li>
          ))}
        </ul>

      </nav>
    </header>
  );
}
