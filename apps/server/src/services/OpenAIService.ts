import OpenAI from 'openai';

export type CardVersion = 'web' | 'mobile';

export interface CardRequest {
  description: string;
  version: CardVersion;
}

export interface CardResponse {
  title: string;
  subtitle?: string;
  fields: Array<{ label: string; value: string }>;
  notes?: string;
}

export class OpenAIService {
  private client: OpenAI;
  private model: string;

  constructor(
    apiKey = process.env.OPENAI_API_KEY,
    model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  ) {
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async generateCard(req: CardRequest): Promise<CardResponse> {
    const prompt = `You are a formatter for a business card (${req.version} version).
Return JSON with keys: title, subtitle, fields[{label,value}], notes.
Description: ${req.description}`;

    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: 'You strictly output JSON only.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    });

    const content = completion.choices?.[0]?.message?.content || '{}';
    try {
      const data = JSON.parse(content);
      return data as CardResponse;
    } catch {
      return { title: 'Business Card', fields: [{ label: 'Info', value: req.description }] };
    }
  }
}
