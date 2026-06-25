"use client";

import { useEffect, useMemo } from "react";
import { useTopCoins, useCoinChart } from "@/hooks/useCoinGecko";
import { useAppStore } from "@/lib/stores/appStore";
import { generateMarketState } from "@/lib/engine/signal";
import TokenSelector from "./TokenSelector";
import MarketOverview from "./MarketOverview";
import SignalPanel from "@/components/signal/SignalPanel";
import NoiseFloor from "@/components/signal/NoiseFloor";
import ImprintGenerator from "@/components/imprint/ImprintGenerator";
import ImprintGallery from "@/components/imprint/ImprintGallery";

export default function DashboardPage() {
  const { selectedToken, marketState, setMarketState } = useAppStore();
  const { data: coins } = useTopCoins(10);
  const { data: chartData } = useCoinChart(selectedToken, 7);

  const selectedCoin = useMemo(() => {
    if (!coins) return null;
    return coins.find((c: any) => c.id === selectedToken) ?? null;
  }, [coins, selectedToken]);

  useEffect(() => {
    if (!selectedCoin || !chartData || chartData.length < 14) return;

    const prices = chartData.map((p: any) => p.value);
    const state = generateMarketState(
      selectedCoin.id,
      selectedCoin.current_price,
      selectedCoin.price_change_percentage_24h ?? 0,
      selectedCoin.total_volume ?? 0,
      selectedCoin.market_cap ?? 0,
      prices
    );
    setMarketState(state);
  }, [selectedCoin, chartData, setMarketState]);

  return (
    <section
      id="dashboard"
      className="relative w-full min-h-screen bg-void"
    >
      {/* section label */}
      <div className="px-6 pt-16 pb-8 max-w-7xl mx-auto">
        <p className="font-mono text-[10px] text-white/15 uppercase tracking-[0.3em] mb-2">
          // signal processing
        </p>
        <h2 className="font-display text-2xl font-bold text-white">
          Retinal Dashboard
        </h2>
        <p className="font-mono text-xs text-white/30 mt-1">
          Select a token to generate its market imprint
        </p>
      </div>

      {/* main grid */}
      <div className="px-6 pb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* left column: selector + overview */}
          <div className="lg:col-span-3 space-y-4">
            <TokenSelector />
            <MarketOverview />
          </div>

          {/* center column: imprint generator */}
          <div className="lg:col-span-6">
            {selectedCoin && chartData && chartData.length >= 14 ? (
              <ImprintGenerator tokenData={{
                name: selectedCoin.name,
                symbol: selectedCoin.symbol,
                price: selectedCoin.current_price,
                change24h: selectedCoin.price_change_percentage_24h ?? 0,
                volume24h: selectedCoin.total_volume ?? 0,
                marketCap: selectedCoin.market_cap ?? 0,
                prices: chartData.map((p: any) => p.value),
              }} />
            ) : (
              <div className="h-96 bg-white/[0.02] rounded-xl animate-pulse flex items-center justify-center">
                <p className="text-white/20 text-sm font-mono">Loading token data...</p>
              </div>
            )}
          </div>

          {/* right column: signal panel + noise floor */}
          <div className="lg:col-span-3 space-y-4">
            <SignalPanel state={marketState} />
            {marketState && <NoiseFloor noiseFloor={marketState.noiseFloor} />}
          </div>
        </div>

        {/* gallery below */}
        <div className="mt-8">
          <ImprintGallery />
        </div>
      </div>

      {/* ambient gradient */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(255,225,53,0.03),transparent_70%)]" />
    </section>
  );
}
