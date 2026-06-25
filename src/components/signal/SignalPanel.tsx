"use client";

import { useMemo } from "react";
import { Activity } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import type { MarketState } from "@/lib/engine/signal";
import { formatPercent, formatUSD, formatNumber } from "@/lib/utils/format";

interface SignalPanelProps {
  state: MarketState | null;
}

const CLASSIFICATION_STYLES: Record<
  MarketState["marketClassification"],
  { label: string; bg: string; text: string; glow: string }
> = {
  EXTREME_BULL: {
    label: "EXTREME BULL",
    bg: "bg-phosphene-gold/15",
    text: "text-phosphene-gold",
    glow: "shadow-[0_0_20px_rgba(255,225,53,0.2)]",
  },
  BULL: {
    label: "BULL",
    bg: "bg-retinal-green/15",
    text: "text-retinal-green",
    glow: "shadow-[0_0_20px_rgba(57,255,20,0.15)]",
  },
  NEUTRAL: {
    label: "NEUTRAL",
    bg: "bg-white/[0.08]",
    text: "text-white/60",
    glow: "",
  },
  BEAR: {
    label: "BEAR",
    bg: "bg-hemorrhage-red/15",
    text: "text-hemorrhage-red",
    glow: "shadow-[0_0_20px_rgba(255,0,64,0.15)]",
  },
  EXTREME_BEAR: {
    label: "EXTREME BEAR",
    bg: "bg-hemorrhage-red/25",
    text: "text-hemorrhage-red",
    glow: "shadow-[0_0_20px_rgba(255,0,64,0.25)]",
  },
};

function CircularGauge({ value, size = 100 }: { value: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const fill = Math.max(0, Math.min(100, value));
  const offset = circumference - (fill / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#FFE135"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-xl font-bold text-white">
          {Math.round(fill)}
        </span>
        <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">
          signal
        </span>
      </div>
    </div>
  );
}

function MetricBar({
  label,
  value,
  max = 1,
}: {
  label: string;
  value: number;
  max?: number;
}) {
  const pct = Math.min(100, Math.abs(value / max) * 100);
  const isPositive = value >= 0;

  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 font-mono text-[11px] text-white/40 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: isPositive
              ? "linear-gradient(90deg, rgba(255,225,53,0.6), #FFE135)"
              : "linear-gradient(90deg, rgba(255,0,64,0.6), #FF0040)",
          }}
        />
      </div>
      <span className="w-14 text-right font-mono text-[11px] text-white/50 tabular-nums">
        {value.toFixed(3)}
      </span>
    </div>
  );
}

export default function SignalPanel({ state }: SignalPanelProps) {
  const classification = useMemo(() => {
    if (!state) return null;
    return CLASSIFICATION_STYLES[state.marketClassification];
  }, [state]);

  if (!state || !classification) {
    return (
      <GlassCard className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <Activity className="w-8 h-8 text-white/10 mb-3" />
        <p className="font-mono text-xs text-white/20 tracking-wider uppercase">
          No signal data
        </p>
      </GlassCard>
    );
  }

  const signalPct = Math.round((1 - state.noiseFloor) * 100);
  const noisePct = Math.round(state.noiseFloor * 100);

  return (
    <GlassCard className="p-5 space-y-5">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em]">
            Signal Analysis
          </p>
          <p className="font-display text-lg font-bold text-white mt-0.5">
            {state.token.toUpperCase()}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full font-mono text-[10px] font-semibold tracking-wider uppercase ${classification.bg} ${classification.text} ${classification.glow}`}
        >
          {classification.label}
        </div>
      </div>

      {/* circular gauge + confidence */}
      <div className="flex items-center gap-6">
        <CircularGauge value={signalPct} size={96} />
        <div className="flex-1 space-y-2">
          <div>
            <p className="font-mono text-[10px] text-white/25 uppercase tracking-wider">
              Confidence
            </p>
            <p className="font-mono text-2xl font-bold text-white tabular-nums">
              {Math.round(state.confidence * 100)}%
            </p>
          </div>
          <div className="flex gap-1.5">
            {state.colorPalette.map((color, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border border-white/10"
                style={{ background: color, boxShadow: `0 0 12px ${color}40` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* noise floor */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/25 uppercase tracking-wider">
            Signal / Noise
          </span>
          <span className="font-mono text-[10px] text-white/40 tabular-nums">
            {signalPct}% / {noisePct}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden flex">
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{
              width: `${signalPct}%`,
              background: "linear-gradient(90deg, #FFE135, #FFE135cc)",
            }}
          />
          <div
            className="h-full flex-1"
            style={{
              background: "rgba(255,255,255,0.04)",
            }}
          />
        </div>
      </div>

      {/* key metrics */}
      <div className="space-y-2.5">
        <p className="font-mono text-[10px] text-white/25 uppercase tracking-wider">
          Key Metrics
        </p>
        <MetricBar label="Volatility" value={state.volatility} />
        <MetricBar label="Momentum" value={state.momentum} max={1} />
        <MetricBar label="Volume" value={state.volume24h} max={1e10} />
        <MetricBar label="Liquidity" value={state.liquidity} />
      </div>

      {/* narrative */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
        <div>
          <p className="font-mono text-[10px] text-white/25 uppercase tracking-wider mb-1">
            Dominant Narrative
          </p>
          <span className="inline-block px-3 py-1 rounded-full bg-phosphene-gold/10 border border-phosphene-gold/20 font-mono text-[11px] text-phosphene-gold tracking-wide">
            {state.dominantNarrative}
          </span>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] text-white/25 uppercase tracking-wider mb-1">
            Mood
          </p>
          <p className="font-mono text-xs text-white/50 italic">
            {state.moodDescriptor}
          </p>
        </div>
      </div>

      {/* price footer */}
      <div className="flex items-baseline justify-between pt-2 border-t border-white/[0.04]">
        <span className="font-mono text-lg font-bold text-white tabular-nums">
          {state.price < 1 ? `$${state.price.toFixed(6)}` : formatUSD(state.price)}
        </span>
        <span
          className={`font-mono text-sm font-semibold tabular-nums ${
            state.change24h >= 0 ? "text-retinal-green" : "text-hemorrhage-red"
          }`}
        >
          {formatPercent(state.change24h)}
        </span>
      </div>
    </GlassCard>
  );
}
