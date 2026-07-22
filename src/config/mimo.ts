// Xiaomi MiMo AI Agent API
const MIMO_API_URL = 'https://api.xiaomimimo.com/v1';
const MIMO_API_KEY = 'sk-szsjdjw70m8t5bwy8tgx4n0taa4egpnicnidvpt3im9exf3l';
const MIMO_MODEL = 'mimo-v2.5-pro';

export interface MimoMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chatWithMimo(messages: MimoMessage[]): Promise<string> {
  const response = await fetch(`${MIMO_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MIMO_API_KEY}`,
    },
    body: JSON.stringify({
      model: MIMO_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are Global Payments AI Financial Assistant — a smart, helpful AI built into a digital banking app on Arc Testnet. You help users with:
- Financial advice and spending insights
- Transaction explanations and summaries  
- Budget planning and savings tips
- Cross-border remittance guidance
- Bill splitting calculations
- USDC/stablecoin education

Always respond in English. Be concise, friendly, and professional. Use emojis sparingly. When asked about transactions or balances, remind users to connect their wallet for real-time data.`
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.';
}
