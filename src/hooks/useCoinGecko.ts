import { useQuery } from "@tanstack/react-query";
import { getTopCoins, getCoinChart, getCoinDetail, searchCoins, getGlobalData } from "@/lib/api/coingecko";

export function useTopCoins(limit = 20) {
  return useQuery({
    queryKey: ["topCoins", limit],
    queryFn: () => getTopCoins(limit),
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

export function useGlobalStats() {
  return useQuery({
    queryKey: ["globalStats"],
    queryFn: getGlobalData,
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

export function useCoinChart(id: string, days = 7) {
  return useQuery({
    queryKey: ["coinChart", id, days],
    queryFn: () => getCoinChart(id, days),
    refetchInterval: 60000,
    enabled: !!id,
  });
}

export function useCoinDetail(id: string) {
  return useQuery({
    queryKey: ["coinDetail", id],
    queryFn: () => getCoinDetail(id),
    enabled: !!id,
    staleTime: 60000,
  });
}

export function useCoinSearch(query: string) {
  return useQuery({
    queryKey: ["coinSearch", query],
    queryFn: () => searchCoins(query),
    enabled: query.length >= 2,
    staleTime: 60000,
  });
}
