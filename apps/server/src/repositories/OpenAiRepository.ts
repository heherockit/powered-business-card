import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import type { ITemplateRepository } from './TemplateRepository';
import { JsonTemplateRepository } from './TemplateRepository';

export interface AnalysisField {
  label: string;
  value: string;
}
export interface ExtractedInformation {
  title: string;
  subtitle?: string;
  fields: AnalysisField[];
  notes?: string;
}

export interface RelevantTemplate {
  id: string;
  name: string;
  description: string;
}

export interface CombinedAnalysis {
  info: ExtractedInformation;
  relevantTemplates: RelevantTemplate[];
}

export interface IOpenAiRepository {
  analyzeRequest(inputText: string, version: 'web' | 'mobile'): Promise<CombinedAnalysis>;
}

export interface OpenAiRepositoryOptions {
  baseUrl: string;
  apiKeys: string[];
  organization?: string;
  model: string;
  timeoutMs: number;
  client?: OpenAI; // for testing/mocking
  templateRepo?: ITemplateRepository; // for testing/mocking
}

export class OpenAiRepository implements IOpenAiRepository {
  private clients: OpenAI[];
  private model: string;
  private timeoutMs: number;
  private idx = 0;
  private templateRepo?: ITemplateRepository;

  constructor(options: OpenAiRepositoryOptions) {
    this.model = options.model;
    this.timeoutMs = options.timeoutMs;
    this.templateRepo = options.templateRepo;

    if (options.client) {
      this.clients = [options.client];
    } else {
      this.clients = options.apiKeys.map(
        (key) => new OpenAI({ apiKey: key, organization: options.organization })
      );
    }

    if (this.clients.length === 0) {
      throw new Error('OpenAiRepository requires at least one OpenAI client');
    }
  }

  private nextClient(): OpenAI {
    const client = this.clients[this.idx % this.clients.length];

    this.idx++;

    return client;
  }

  /**
   * Validate and normalize input text and version.
   */
  private validateInputs(inputText: string, version: 'web' | 'mobile') {
    if (!inputText || typeof inputText !== 'string' || inputText.trim().length === 0) {
      throw new Error('inputText must be a non-empty string');
    }
    if (version !== 'web' && version !== 'mobile') {
      throw new Error('version must be either "web" or "mobile"');
    }
  }

  /**
   * Extract key information from a natural-language description by calling OpenAI.
   * Maintains original behavior and error handling, and accepts optional assistant
   * messages to provide template context to the model.
   *
   * @param inputText - The user's description text
   * @param version - Target rendering version ('web'|'mobile')
   * @param assistantMessages - Optional assistant role messages to include for context
   * @returns ExtractedInformation
   */
  private async extractInformation(inputText: string): Promise<ExtractedInformation> {
    const controller = new AbortController();

    const timeoutErr = new Error('OpenAI request timed out');

    const prompt = `Extract information from this description: ${inputText}. Return JSON object.`;

    const client = this.nextClient();

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: `You are a NLP expert and a formatter for a business card.
          You strictly output JSON only.
          Return JSON object with format: 
          {
            title: string,
            subtitle: string,
            fields: [{label: string, value: string}],
            notes: string
          }` 
      },
      { role: 'user', content: prompt },
    ];
    try {
      const createPromise = client.chat.completions.create(
        {
          model: this.model,
          messages,
          temperature: 0.2,
          response_format: { type: 'json_object' },
        },
        { signal: controller.signal as any }
      );

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          controller.abort(timeoutErr);
          reject(timeoutErr);
        }, this.timeoutMs);
      });

      const completion = await Promise.race([createPromise as any, timeoutPromise]);

      const content = completion.choices?.[0]?.message?.content || '{}';

      let parsed: any;

      try {
        parsed = JSON.parse(content);
      } catch (_err) {
        parsed = { title: 'Business Card', fields: [{ label: 'Info', value: inputText }] };
      }

      const info: ExtractedInformation = {
        title: String(parsed.title ?? 'Business Card'),
        subtitle: parsed.subtitle ? String(parsed.subtitle) : undefined,
        fields: Array.isArray(parsed.fields)
          ? parsed.fields.map((f: any) => ({ label: String(f.label), value: String(f.value) }))
          : [{ label: 'Info', value: inputText }],
        notes: parsed.notes ? String(parsed.notes) : undefined,
      };

      return info;
    } catch (err: any) {
      const msg = typeof err?.message === 'string' ? err.message : 'OpenAI error';

      console.error('[OpenAiRepository] extractInformation:error', msg);

      throw new Error(`Extraction error: ${msg}`);
    }
  }

  /**
   * Find the 3 most relevant templates to the input request using a simple
   * token-overlap scoring across name, description, and tags. Formats matches
   * as assistant role messages to provide contextual suggestions.
   *
   * @param inputText - The user's description text
   * @returns Relevant templates and assistant messages for the model
   */
  private async findRelevantTemplates(inputText: string): Promise<RelevantTemplate[]> {
    if (!inputText || typeof inputText !== 'string' || inputText.trim().length === 0) {
      throw new Error('Template selection input must be a non-empty string');
    }

    const repo = this.templateRepo ?? new JsonTemplateRepository();

    let allTemplates: ReturnType<typeof repo.getAll>;

    try {
      allTemplates = repo.getAll();
    } catch (err: any) {
      console.error('[OpenAiRepository] findRelevantTemplates:repo_error', err?.message || err);

      allTemplates = [] as any;
    }

    // Prepare assistant message catalog of available templates
    const catalog = allTemplates
      .map(
        (t) => `ID:${t.id} NAME:${t.name} TAGS:${(t.tags || []).join('|')} DESC:${t.description}`
      )
      .join('\n');

    const client = this.nextClient();
    const controller = new AbortController();
    const timeoutErr = new Error('OpenAI request timed out');

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: 'You are a template matcher. You strictly output JSON only.' },
      { role: 'assistant', content: `Available templates:\n${catalog || '(none)'}` },
      {
        role: 'user',
        content:
          `User description: ${inputText}\n` +
          `Select exactly the top 3 most relevant templates from the catalog. ` +
          `Return JSON with key matches: [{id,name,description}]. Output JSON only.`,
      },
    ];

    try {
      const createPromise = client.chat.completions.create(
        { model: this.model, messages, temperature: 0, response_format: { type: 'json_object' } },
        { signal: controller.signal as any }
      );

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          controller.abort(timeoutErr);
          reject(timeoutErr);
        }, this.timeoutMs);
      });

      const completion = await Promise.race([createPromise as any, timeoutPromise]);

      const content = completion.choices?.[0]?.message?.content || '{}';

      let parsed: any = {};

      try {
        parsed = JSON.parse(content);
      } catch (err) {
        console.warn(
          '[OpenAiRepository] findRelevantTemplates:parse_failed, falling back to heuristic'
        );
      }

      let selected: RelevantTemplate[] = [];

      if (parsed && Array.isArray(parsed.matches)) {
        selected = parsed.matches
          .slice(0, 3)
          .map((m: any) => ({ id: String(m.id), name: String(m.name) }));
      }

      if (!selected.length) {
        // Heuristic fallback: token overlap
        const text = inputText.toLowerCase();
        const tokens = text.match(/[a-z0-9]+/g) || [];
        const tokenSet = new Set(tokens);
        const scored = allTemplates.map((t) => {
          const nameTokens = t.name.toLowerCase().match(/[a-z0-9]+/g) || [];
          const descTokens = t.description.toLowerCase().match(/[a-z0-9]+/g) || [];
          const tagTokens = (t.tags || []).map((s) => s.toLowerCase());
          const score = [...nameTokens, ...descTokens, ...tagTokens].reduce(
            (acc, tok) => acc + (tokenSet.has(tok) ? 1 : 0),
            0
          );
          return { id: t.id, name: t.name, description: t.description, score };
        });
        selected = scored
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map(({ id, name, description }) => ({ id, name, description }));
      }

      return selected;
    } catch (err: any) {
      const msg = typeof err?.message === 'string' ? err.message : 'OpenAI error';

      console.error('[OpenAiRepository] findRelevantTemplates:error', msg);

      throw new Error(`Template selection error: ${msg}`);
    }
  }

  /**
   * Analyze a request by combining extracted information with relevant templates.
   * Maintains consistent error handling and input validation.
   *
   * @param inputText - The user's description text
   * @param version - Target rendering version ('web'|'mobile')
   * @returns CombinedAnalysis with extracted info and top 3 template names/IDs
   */
  async analyzeRequest(inputText: string, version: 'web' | 'mobile'): Promise<CombinedAnalysis> {
    this.validateInputs(inputText, version);

    const templates = await this.findRelevantTemplates(inputText);

    const info = await this.extractInformation(inputText);

    return { info, relevantTemplates: templates };
  }
}
