import { useRef, useCallback } from "react";
import { Download, RefreshCw, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/stores/appStore";
import { generateMarketState } from "@/lib/engine/signal";
import type { MarketState } from "@/lib/engine/signal";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import RetinalCanvas from "./RetinalCanvas";
import SignalBadge from "./SignalBadge";
import { formatPrice, formatPercent } from "@/lib/utils/format";

interface ImprintGeneratorProps {
  tokenData: {
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    volume24h: number;
    marketCap: number;
    prices: number[];
    sentiment?: number;
  };
}

export default function ImprintGenerator({ tokenData }: ImprintGeneratorProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const { marketState, setMarketState, isGenerating, setIsGenerating, addImprint } = useAppStore();

  const generate = useCallback(() => {
    setIsGenerating(true);

    // simulate generation delay for effect
    setTimeout(() => {
      const state: MarketState = generateMarketState(
        tokenData.name,
        tokenData.price,
        tokenData.change24h,
        tokenData.volume24h,
        tokenData.marketCap,
        tokenData.prices,
        tokenData.sentiment ?? 0
      );
      setMarketState(state);
      setIsGenerating(false);
    }, 600);
  }, [tokenData, setMarketState, setIsGenerating]);

  const handleDownload = useCallback(() => {
    const container = canvasContainerRef.current;
    if (!container) return;
    const canvas = container.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `phosphene-${tokenData.symbol}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [tokenData.symbol]);

  const handleMint = useCallback(() => {
    const evt = new CustomEvent("phosphene:toast", {
      detail: { message: "Mint as NFT — Coming soon", variant: "info" },
    });
    window.dispatchEvent(evt);
  }, []);

  const handleRegenerate = useCallback(() => {
    generate();
    if (marketState) {
      addImprint({
        token: tokenData.name,
        timestamp: Date.now(),
        state: marketState,
      });
    }
  }, [generate, marketState, addImprint, tokenData.name]);

  // auto-generate on first render if no state
  if (!marketState && !isGenerating) {
    generate();
  }

  return (
    <GlassCard glow className="flex flex-col gap-6 p-6 lg:p-8">
      {/* header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              {tokenData.name}
              <span className="ml-2 text-sm font-normal text-white/40 uppercase">
                {tokenData.symbol}
              </span>
            </h2>
            {marketState && (
              <SignalBadge
                classification={marketState.marketClassification}
                confidence={marketState.confidence}
              />
            )}
          </div>
          {marketState && (
            <div className="flex items-center gap-3 text-sm text-white/60">
              <span className="font-mono text-white">{formatPrice(marketState.price)}</span>
              <span className={marketState.change24h >= 0 ? "text-green-400" : "text-red-400"}>
                {formatPercent(marketState.change24h)}
              </span>
              <span className="text-white/30">•</span>
              <span>Signal: {marketState.signalScore.toFixed(3)}</span>
            </div>
          )}
        </div>
      </div>

      {/* canvas */}
      <div
        ref={canvasContainerRef}
        className="relative aspect-square w-full overflow-hidden rounded-lg bg-black"
      >
        {isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
            <span className="text-xs text-white/40 uppercase tracking-widest">Generating imprint…</span>
          </div>
        ) : marketState ? (
          <RetinalCanvas marketState={marketState} className="absolute inset-0" />
        ) : null}
      </div>

      {/* actions */}
      <div className="flex items-center gap-3">
        <Button onClick={handleRegenerate} variant="secondary" size="sm" disabled={isGenerating}>
          <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
          Regenerate
        </Button>
        <Button onClick={handleDownload} variant="secondary" size="sm" disabled={!marketState}>
          <Download size={14} />
          Download
        </Button>
        <Button onClick={handleMint} variant="ghost" size="sm">
          <Sparkles size={14} />
          Mint as NFT
        </Button>
      </div>
    </GlassCard>
  );
}
