import type { IOpenAiRepository, CombinedAnalysis } from '../../repositories/OpenAiRepository';

export interface GenerateCardInput {
  description: string;
  version?: 'web' | 'mobile';
}

export class GenerateCardCommand {
  constructor(private readonly repo: IOpenAiRepository) {}

  async execute(input: GenerateCardInput): Promise<CombinedAnalysis> {
    const description = (input.description ?? '').trim();
    if (!description) {
      throw new Error('Description is required');
    }
    const sanitized = sanitize(description);
    const version = input.version === 'mobile' ? 'mobile' : 'web';
    return this.repo.analyzeRequest(sanitized, version);
  }
}

function sanitize(text: string): string {
  // Basic sanitization: trim, collapse whitespace, strip control chars, limit length
  const collapsed = text.replace(/\s+/g, ' ').trim();
  const stripped = collapsed.replace(/[\u0000-\u001F\u007F]/g, '');
  return stripped.slice(0, 1000);
}
