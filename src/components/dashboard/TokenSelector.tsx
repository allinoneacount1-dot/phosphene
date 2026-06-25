"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useCoinSearch, useTopCoins } from "@/hooks/useCoinGecko";
import { useAppStore } from "@/lib/stores/appStore";
import { formatUSD } from "@/lib/utils/format";
import GlassCard from "@/components/ui/GlassCard";

export default function TokenSelector() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { selectedToken, setSelectedToken, setMarketState } = useAppStore();
  const { data: searchResults } = useCoinSearch(query);
  const { data: topCoins } = useTopCoins(10);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    setSelectedToken(id);
    setQuery("");
    setOpen(false);
    setMarketState(null);
  };

  const coins = searchResults?.coins ?? [];
  const quickCoins = topCoins ?? [];

  return (
    <GlassCard className="p-4 space-y-3">
      <p className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em]">
        Token Selector
      </p>

      {/* search */}
      <div ref={wrapperRef} className="relative">
        <div className="relative flex items-center h-10 rounded-lg bg-white/[0.04] backdrop-blur-md border border-white/[0.08] transition-colors duration-150 focus-within:border-phosphene-gold/40 focus-within:shadow-[0_0_20px_rgba(255,225,53,0.06)]">
          <Search className="absolute left-3 w-4 h-4 text-white/30 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(e.target.value.length >= 2);
            }}
            onFocus={() => query.length >= 2 && setOpen(true)}
            placeholder="Search tokens…"
            className="w-full h-full bg-transparent pl-9 pr-3 text-sm text-white placeholder:text-white/25 outline-none font-sans"
          />
        </div>

        {/* dropdown */}
        {open && coins.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg bg-deep/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
            {coins.slice(0, 8).map((coin: any) => (
              <button
                key={coin.id}
                onClick={() => handleSelect(coin.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors text-left"
              >
                {coin.thumb && (
                  <img
                    src={coin.thumb}
                    alt=""
                    className="w-5 h-5 rounded-full"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{coin.name}</p>
                  <p className="font-mono text-[10px] text-white/30 uppercase">
                    {coin.symbol}
                  </p>
                </div>
                {coin.market_cap_rank && (
                  <span className="font-mono text-[10px] text-white/20">
                    #{coin.market_cap_rank}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* quick select pills */}
      <div className="flex flex-wrap gap-1.5">
        {quickCoins.slice(0, 10).map((coin: any) => (
          <button
            key={coin.id}
            onClick={() => handleSelect(coin.id)}
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all duration-150
              ${
                selectedToken === coin.id
                  ? "bg-phosphene-gold/15 border border-phosphene-gold/40 text-phosphene-gold shadow-[0_0_12px_rgba(255,225,53,0.1)]"
                  : "bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.12]"
              }
            `}
          >
            {coin.image && (
              <img src={coin.image} alt="" className="w-3.5 h-3.5 rounded-full" />
            )}
            {coin.symbol?.toUpperCase()}
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
