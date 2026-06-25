import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Button from "@/components/ui/Button";

const links = [
  { label: "Dashboard", href: "/" },
  { label: "Imprints", href: "/imprints" },
  { label: "Signals", href: "/signals" },
  { label: "Ophthalmoscope", href: "/ophthalmoscope" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "h-14 bg-black/60 backdrop-blur-xl border-b border-white/[0.06]"
          : "h-16 bg-transparent"
      )}
    >
      <div className="h-full max-w-[1280px] mx-auto px-5 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 select-none">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-phosphene-gold animate-ping opacity-40" />
            <span className="relative rounded-full bg-phosphene-gold h-2 w-2" />
          </span>
          <span className="font-display text-lg tracking-[0.25em] text-white">
            PHOSPHENE
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs tracking-wide text-white/50 hover:text-white transition-colors duration-150 font-sans uppercase"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button variant="secondary" size="sm">
            Connect Wallet
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 border-b border-white/[0.06]",
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-5 py-4 flex flex-col gap-3 bg-black/80 backdrop-blur-xl">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-white/60 hover:text-white transition-colors font-sans"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Button variant="secondary" size="sm" className="mt-2 w-full">
            Connect Wallet
          </Button>
        </div>
      </div>
    </nav>
  );
}
