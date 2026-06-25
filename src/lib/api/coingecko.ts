const BASE = "https://api.coingecko.com/api/v3";

export async function getTopCoins(limit = 20) {
  const res = await fetch(
    `${BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h`
  );
  if (!res.ok) throw new Error("Failed to fetch top coins");
  return res.json();
}

export async function getCoinChart(id: string, days = 7) {
  const res = await fetch(
    `${BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  );
  if (!res.ok) throw new Error("Failed to fetch chart data");
  const data = await res.json();
  return data.prices.map(([t, p]: [number, number]) => ({
    time: t / 1000,
    value: p,
  }));
}

export async function getCoinDetail(id: string) {
  const res = await fetch(
    `${BASE}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
  );
  if (!res.ok) throw new Error("Failed to fetch coin detail");
  return res.json();
}

export async function searchCoins(query: string) {
  const res = await fetch(`${BASE}/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function getGlobalData() {
  const res = await fetch(`${BASE}/global`);
  if (!res.ok) throw new Error("Failed to fetch global data");
  const json = await res.json();
  return json.data;
}
