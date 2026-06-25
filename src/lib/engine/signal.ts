export interface MarketState {
  token: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  volatility: number;
  momentum: number;
  sentiment: number;
  whaleActivity: number;
  liquidity: number;
  noiseFloor: number;
  confidence: number;
  signalScore: number;
  marketClassification: "EXTREME_BULL" | "BULL" | "NEUTRAL" | "BEAR" | "EXTREME_BEAR";
  colorPalette: string[];
  moodDescriptor: string;
  dominantNarrative: string;
}

const MARKET_THRESHOLDS = {
  EXTREME_BULL: { min: 0.7, colors: ["#FFE135", "#FFD700", "#FFFFFF"], mood: "euphoric, radiant, abundant" },
  BULL: { min: 0.3, colors: ["#39FF14", "#00C853", "#00FFFF"], mood: "optimistic, growing, clear" },
  NEUTRAL: { min: -0.3, colors: ["#F5F5F5", "#708090", "#4682B4"], mood: "balanced, calm, observing" },
  BEAR: { min: -0.7, colors: ["#FF0040", "#8B0000", "#FF8C00"], mood: "caution, tension, narrowing" },
  EXTREME_BEAR: { min: -Infinity, colors: ["#050505", "#8B0000", "#FF0000"], mood: "fear, collapse, darkness" },
};

export function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
  return Math.min(1, Math.sqrt(variance) * 10);
}

export function calculateMomentum(prices: number[]): number {
  if (prices.length < 14) return 0;
  const recent = prices.slice(-14);
  let gains = 0, losses = 0;
  for (let i = 1; i < recent.length; i++) {
    const change = recent[i] - recent[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  const rs = losses === 0 ? 100 : gains / losses;
  const rsi = 100 - 100 / (1 + rs);
  return (rsi - 50) / 50;
}

export function classifyMarket(signalScore: number): MarketState["marketClassification"] {
  if (signalScore > 0.7) return "EXTREME_BULL";
  if (signalScore > 0.3) return "BULL";
  if (signalScore > -0.3) return "NEUTRAL";
  if (signalScore > -0.7) return "BEAR";
  return "EXTREME_BEAR";
}

export function getMarketColors(classification: MarketState["marketClassification"]): string[] {
  return MARKET_THRESHOLDS[classification].colors;
}

export function getMarketMood(classification: MarketState["marketClassification"]): string {
  return MARKET_THRESHOLDS[classification].mood;
}

export function calculateNoiseFloor(confidence: number): number {
  return 1 - confidence;
}

export function generateMarketState(
  token: string,
  price: number,
  change24h: number,
  volume24h: number,
  marketCap: number,
  prices: number[],
  sentiment: number = 0
): MarketState {
  const volatility = calculateVolatility(prices);
  const momentum = calculateMomentum(prices);
  const signalScore = (momentum * 0.3) + (sentiment * 0.35) + ((change24h / 100) * 0.25);
  const clampedSignal = Math.max(-1, Math.min(1, signalScore));
  const classification = classifyMarket(clampedSignal);
  const confidence = Math.min(1, 0.5 + (prices.length > 100 ? 0.2 : 0) + (volume24h > 1e6 ? 0.2 : 0) + (Math.abs(sentiment) > 0.3 ? 0.1 : 0));

  return {
    token,
    price,
    change24h,
    volume24h,
    marketCap,
    volatility,
    momentum,
    sentiment,
    whaleActivity: Math.random() * 0.5 + 0.2,
    liquidity: Math.min(1, marketCap / 1e10),
    noiseFloor: calculateNoiseFloor(confidence),
    confidence,
    signalScore: clampedSignal,
    marketClassification: classification,
    colorPalette: getMarketColors(classification),
    moodDescriptor: getMarketMood(classification),
    dominantNarrative: classification === "EXTREME_BULL" ? "Euphoria" :
                      classification === "BULL" ? "Accumulation" :
                      classification === "NEUTRAL" ? "Consolidation" :
                      classification === "BEAR" ? "Distribution" : "Capitulation",
  };
}
