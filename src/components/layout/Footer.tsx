import { ExternalLink, AtSign, FileText } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const socials = [
  { icon: ExternalLink, label: "GitHub", href: "#" },
  { icon: AtSign, label: "Twitter", href: "#" },
  { icon: FileText, label: "Docs", href: "#" },
] as const;

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-white/[0.06] bg-white/[0.02] backdrop-blur-md",
        className
      )}
    >
      <div className="max-w-[1280px] mx-auto px-5 py-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        {/* Brand */}
        <div className="flex flex-col gap-2">
          <span className="font-display text-sm tracking-[0.2em] text-white/80">
            PHOSPHENE
          </span>
          <p className="text-xs text-white/30 font-sans max-w-xs">
            See What The Market Hides
          </p>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-5">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="text-white/30 hover:text-phosphene-gold transition-colors duration-150"
            >
              <s.icon className="w-4 h-4" />
            </a>
          ))}
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-1 md:items-end">
          <span className="text-[11px] text-white/20 font-sans">
            Built with 100% free APIs
          </span>
          <span className="text-[11px] text-white/15 font-sans">
            © 2026 Phosphene. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
