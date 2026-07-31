import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

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
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <Link
          to="/"
          className="text-[10px] font-light uppercase tracking-[0.5em] text-porcelain transition-opacity hover:opacity-60"
        >
          Erchomai
        </Link>
        <ul className="flex items-center gap-5 md:gap-9">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="text-[9px] font-light uppercase tracking-[0.34em] text-titanium transition-colors hover:text-porcelain md:text-[10px] md:tracking-[0.4em]"
                activeProps={{ className: "!text-porcelain" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
