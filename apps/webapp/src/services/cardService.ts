type CardField = { label: string; value: string };
export type GeneratedCard = {
  title?: string;
  subtitle?: string;
  fields?: CardField[];
  notes?: string;
};

export type RelevantTemplate = { id: string; name: string };

export type GenerateCardResponse = {
  card: GeneratedCard;
  templates: RelevantTemplate[];
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export async function generateCard(description: string): Promise<GenerateCardResponse> {
  const endpoint = `${API_BASE}/api/card`;
  const payload = { description };
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text || 'Request failed'}`);
    }
    const json = (await res.json()) as GenerateCardResponse;
    if (!json || typeof json !== 'object' || !json.card) {
      throw new Error('Invalid response shape');
    }
    return json;
  } catch (err) {
    console.error('generateCard failed', err);
    throw err instanceof Error ? err : new Error('Unknown error');
  }
}