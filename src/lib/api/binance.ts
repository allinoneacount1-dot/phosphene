const BASE = "https://api.binance.com/api/v3";

export async function get24hrTicker(symbol: string) {
  const res = await fetch(`${BASE}/ticker/24hr?symbol=${symbol}`);
  if (!res.ok) throw new Error("Binance ticker failed");
  return res.json();
}

export async function getKlines(symbol: string, interval = "1h", limit = 168) {
  const res = await fetch(
    `${BASE}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  );
  if (!res.ok) throw new Error("Binance klines failed");
  return res.json();
}

export async function getOrderBook(symbol: string, limit = 20) {
  const res = await fetch(`${BASE}/depth?symbol=${symbol}&limit=${limit}`);
  if (!res.ok) throw new Error("Binance orderbook failed");
  return res.json();
}
