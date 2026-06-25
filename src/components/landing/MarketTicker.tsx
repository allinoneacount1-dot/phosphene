"use client";

import { useTopCoins } from "@/hooks/useCoinGecko";
import { formatPrice, formatPercent } from "@/lib/utils/format";

const SEPARATOR = (
  <span className="mx-4 inline-block h-1 w-1 rounded-full bg-[#FFE135]/50" />
);

export default function MarketTicker() {
  const { data: coins, isLoading } = useTopCoins(5);

  if (isLoading || !coins?.length) {
    return (
      <div className="relative w-full overflow-hidden border-t border-b border-white/5 bg-[#050505] py-3">
        <div className="flex items-center justify-center gap-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-3 w-12 animate-pulse rounded bg-white/5" />
              <div className="h-3 w-20 animate-pulse rounded bg-white/5" />
              <div className="h-3 w-14 animate-pulse rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // duplicate for seamless loop
  const items = [...coins, ...coins];

  return (
    <div className="relative w-full overflow-hidden border-t border-b border-white/5 bg-[#050505] py-3">
      {/* fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-[#050505] to-transparent" />

      <div className="ticker-track flex w-max items-center">
        {items.map((coin, i) => {
          const isPositive = coin.price_change_percentage_24h >= 0;
          return (
            <div key={`${coin.symbol}-${i}`} className="flex items-center">
              <span className="font-mono text-[11px] font-semibold tracking-wider text-white/70 uppercase">
                {coin.symbol}
              </span>
              <span className="ml-2.5 font-mono text-[11px] text-white/50">
                {formatPrice(coin.current_price)}
              </span>
              <span
                className={`ml-2.5 font-mono text-[11px] font-medium ${
                  isPositive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isPositive ? "+" : ""}
                {formatPercent(coin.price_change_percentage_24h)}
              </span>
              {i < items.length - 1 && SEPARATOR}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker-scroll 30s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
