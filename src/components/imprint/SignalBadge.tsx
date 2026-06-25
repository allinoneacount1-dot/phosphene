import type { MarketState } from "@/lib/engine/signal";
import { cn } from "@/lib/utils/cn";

type Classification = MarketState["marketClassification"];

interface SignalBadgeProps {
  classification: Classification;
  confidence: number;
  className?: string;
}

const BADGE_STYLES: Record<Classification, { label: string; bg: string; text: string; glow: string }> = {
  EXTREME_BULL: {
    label: "EXTREME BULL",
    bg: "bg-yellow-500/15",
    text: "text-yellow-300",
    glow: "shadow-[0_0_12px_rgba(255,215,0,0.4)]",
  },
  BULL: {
    label: "BULL",
    bg: "bg-green-500/15",
    text: "text-green-400",
    glow: "",
  },
  NEUTRAL: {
    label: "NEUTRAL",
    bg: "bg-white/[0.06]",
    text: "text-white/50",
    glow: "",
  },
  BEAR: {
    label: "BEAR",
    bg: "bg-red-500/15",
    text: "text-red-400",
    glow: "",
  },
  EXTREME_BEAR: {
    label: "EXTREME BEAR",
    bg: "bg-red-900/25",
    text: "text-red-600",
    glow: "shadow-[0_0_12px_rgba(139,0,0,0.5)]",
  },
};

const isExtreme = (c: Classification) => c === "EXTREME_BULL" || c === "EXTREME_BEAR";

export default function SignalBadge({ classification, confidence, className }: SignalBadgeProps) {
  const style = BADGE_STYLES[classification];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        "border border-white/[0.06]",
        style.bg,
        style.text,
        style.glow,
        isExtreme(classification) && "animate-pulse",
        className
      )}
    >
      <span
        className={cn(
          "inline-block h-1.5 w-1.5 rounded-full",
          classification === "EXTREME_BULL" && "bg-yellow-400",
          classification === "BULL" && "bg-green-400",
          classification === "NEUTRAL" && "bg-white/40",
          classification === "BEAR" && "bg-red-400",
          classification === "EXTREME_BEAR" && "bg-red-700"
        )}
      />
      {style.label}
      <span className="text-[8px] opacity-60">{Math.round(confidence * 100)}%</span>
    </span>
  );
}
