import { create } from "zustand";
import type { MarketState } from "@/lib/engine/signal";

interface AppState {
  selectedToken: string;
  setSelectedToken: (token: string) => void;
  marketState: MarketState | null;
  setMarketState: (state: MarketState | null) => void;
  imprintHistory: Array<{ token: string; timestamp: number; state: MarketState; imageUrl?: string }>;
  addImprint: (imprint: { token: string; timestamp: number; state: MarketState; imageUrl?: string }) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedToken: "bitcoin",
  setSelectedToken: (token) => set({ selectedToken: token }),
  marketState: null,
  setMarketState: (state) => set({ marketState: state }),
  imprintHistory: [],
  addImprint: (imprint) =>
    set((s) => ({
      imprintHistory: [imprint, ...s.imprintHistory].slice(0, 20),
    })),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  isGenerating: false,
  setIsGenerating: (val) => set({ isGenerating: val }),
}));
