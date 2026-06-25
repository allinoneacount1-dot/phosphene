"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTopCoins, useCoinChart } from "@/hooks/useCoinGecko";
import { useAppStore } from "@/lib/stores/appStore";
import { generateMarketState } from "@/lib/engine/signal";
import { formatPrice, formatPercent } from "@/lib/utils/format";
import GlassCard from "@/components/ui/GlassCard";

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 64;
  const h = 24;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  const color = positive ? "#39FF14" : "#FF0040";

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CoinCard({
  coin,
  isActive,
  onClick,
}: {
  coin: any;
  isActive: boolean;
  onClick: () => void;
}) {
  const positive = (coin.price_change_percentage_24h ?? 0) >= 0;
  const sparkline = coin.sparkline_in_7d?.price ?? [];

  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col gap-2 p-3 rounded-xl text-left transition-all duration-200
        ${
          isActive
            ? "bg-phosphene-gold/[0.06] border border-phosphene-gold/30 shadow-[0_0_24px_rgba(255,225,53,0.08)]"
            : "bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08]"
        }
      `}
    >
      {/* header */}
      <div className="flex items-center gap-2">
        {coin.image && (
          <img src={coin.image} alt="" className="w-5 h-5 rounded-full" />
        )}
        <span className="text-sm text-white font-medium truncate flex-1">
          {coin.name}
        </span>
        <span className="font-mono text-[10px] text-white/20 uppercase">
          {coin.symbol}
        </span>
      </div>

      {/* price + change */}
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-sm font-bold text-white tabular-nums">
          {formatPrice(coin.current_price)}
        </span>
        <span
          className={`flex items-center gap-1 font-mono text-[11px] font-semibold tabular-nums ${
            positive ? "text-retinal-green" : "text-hemorrhage-red"
          }`}
        >
          {positive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {formatPercent(coin.price_change_percentage_24h ?? 0)}
        </span>
      </div>

      {/* sparkline */}
      <div className="flex items-end justify-end">
        <Sparkline data={sparkline} positive={positive} />
      </div>

      {/* market cap rank badge */}
      {coin.market_cap_rank && (
        <div className="absolute top-2 right-2 font-mono text-[9px] text-white/15">
          #{coin.market_cap_rank}
        </div>
      )}
    </button>
  );
}

export default function MarketOverview() {
  const { selectedToken, setSelectedToken, setMarketState, setIsGenerating } =
    useAppStore();
  const { data: coins, isLoading } = useTopCoins(10);

  const handleSelect = (id: string) => {
    setSelectedToken(id);
    setMarketState(null);
  };

  return (
    <GlassCard className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em]">
          Market Overview
        </p>
        <p className="font-mono text-[10px] text-white/15">
          Top 10 by Market Cap
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-white/[0.02] border border-white/[0.03] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {(coins ?? []).map((coin: any) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              isActive={selectedToken === coin.id}
              onClick={() => handleSelect(coin.id)}
            />
          ))}
        </div>
      )}
    </GlassCard>
  );
}
