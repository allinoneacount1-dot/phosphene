"use client";

import GlassCard from "@/components/ui/GlassCard";

interface NoiseFloorProps {
  noiseFloor: number;
}

export default function NoiseFloor({ noiseFloor }: NoiseFloorProps) {
  const signalPct = Math.round((1 - noiseFloor) * 100);
  const noisePct = Math.round(noiseFloor * 100);

  return (
    <GlassCard className="p-4 space-y-3">
      <p className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em]">
        Noise Floor
      </p>

      {/* horizontal bar */}
      <div className="relative h-6 rounded-md overflow-hidden bg-white/[0.03] border border-white/[0.04]">
        <div
          className="absolute inset-y-0 left-0 transition-all duration-700 ease-out"
          style={{
            width: `${signalPct}%`,
            background:
              "linear-gradient(90deg, rgba(255,225,53,0.15), rgba(255,225,53,0.5))",
          }}
        />
        <div
          className="absolute inset-y-0 transition-all duration-700 ease-out"
          style={{
            left: `${signalPct}%`,
            right: 0,
            background: "rgba(255,255,255,0.02)",
          }}
        />
        {/* divider line */}
        <div
          className="absolute inset-y-0 w-px bg-phosphene-gold/60 transition-all duration-700 ease-out"
          style={{ left: `${signalPct}%` }}
        />
        {/* labels */}
        <div className="absolute inset-0 flex items-center justify-between px-3">
          <span className="font-mono text-[10px] font-semibold text-phosphene-gold/80 tracking-wider uppercase">
            signal
          </span>
          <span className="font-mono text-[10px] text-white/20 tracking-wider uppercase">
            noise
          </span>
        </div>
      </div>

      {/* numeric readout */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-phosphene-gold tabular-nums">
          {signalPct}%
        </span>
        <span className="font-mono text-xs text-white/20 tabular-nums">
          {noisePct}%
        </span>
      </div>

      {/* explanation */}
      <p className="font-mono text-[11px] text-white/25 leading-relaxed">
        The noise floor measures background market static. Higher signal means
        cleaner data for imprint generation. Below 40% signal, patterns become
        unreliable.
      </p>
    </GlassCard>
  );
}
