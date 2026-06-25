export async function searchDexPairs(query: string) {
  const res = await fetch(
    `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("DexScreener search failed");
  return res.json();
}

export async function getDexTokens(addresses: string) {
  const res = await fetch(
    `https://api.dexscreener.com/tokens/v1/solana/${addresses}`
  );
  if (!res.ok) throw new Error("DexScreener tokens failed");
  return res.json();
}
