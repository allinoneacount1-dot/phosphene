import { useEffect, useRef, useState } from "react";
import { useGlobalStats } from "@/hooks/useCoinGecko";
import { formatUSD } from "@/lib/utils/format";
import GlassCard from "@/components/ui/GlassCard";

interface StatItem {
  label: string;
  value: string;
  raw: number;
  suffix?: string;
}

function AnimatedNumber({ value, suffix }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1800;
          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(2, -10 * progress);
            setDisplay(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {suffix === "USD" ? formatUSD(display) : display.toLocaleString()}
      {suffix && suffix !== "USD" && (
        <span className="text-[#FFE135]/60">{suffix}</span>
      )}
    </span>
  );
}

export default function StatsBar() {
  const { data: global, isLoading } = useGlobalStats();

  const stats: StatItem[] = [
    {
      label: "Total Market Cap",
      value: global ? formatUSD(global.total_market_cap.usd) : "$0",
      raw: global?.total_market_cap.usd ?? 0,
      suffix: "USD",
    },
    {
      label: "24h Volume",
      value: global ? formatUSD(global.total_volume.usd) : "$0",
      raw: global?.total_volume.usd ?? 0,
      suffix: "USD",
    },
    {
      label: "BTC Dominance",
      value: global ? `${global.market_cap_percentage.btc.toFixed(1)}%` : "0%",
      raw: global?.market_cap_percentage.btc ?? 0,
      suffix: "%",
    },
    {
      label: "Active Tokens",
      value: global ? global.active_cryptocurrencies.toLocaleString() : "0",
      raw: global?.active_cryptocurrencies ?? 0,
    },
  ];

  return (
    <section className="relative w-full bg-[#050505] py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <GlassCard key={stat.label} className="group relative overflow-hidden p-5 text-center">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFE135]/30 to-transparent" />
              <p className="mb-2 font-mono text-[10px] tracking-[0.25em] text-white/30 uppercase">
                {stat.label}
              </p>
              <p className="font-mono text-lg font-semibold text-white/90 tabular-nums tracking-tight">
                {isLoading ? (
                  <span className="inline-block h-5 w-20 animate-pulse rounded bg-white/5" />
                ) : (
                  <AnimatedNumber value={stat.raw} suffix={stat.suffix} />
                )}
              </p>
              <div className="pointer-events-none absolute inset-0 bg-[#FFE135]/[0.02] opacity-0 transition-opacity group-hover:opacity-100" />
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
