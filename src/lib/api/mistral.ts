const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";

export async function analyzeNarrative(marketData: unknown, newsData: unknown) {
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
  if (!apiKey) throw new Error("Mistral API key not set");

  const prompt = `Analyze the following crypto data and extract SIGNAL from NOISE. Provide:
1. Dominant narrative (1-3 words)
2. Signal/Noise ratio (0.0-1.0)
3. Key signal themes (max 3)
4. Visual mood descriptor for retinal imprint
5. Color palette suggestion (3 hex colors)
6. Market state: EXTREME_BULL, BULL, NEUTRAL, BEAR, or EXTREME_BEAR

Market Data: ${JSON.stringify(marketData)}
News Context: ${JSON.stringify(newsData)}

Respond in JSON format only.`;

  const res = await fetch(MISTRAL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) throw new Error("Mistral API error");
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(content);
}
