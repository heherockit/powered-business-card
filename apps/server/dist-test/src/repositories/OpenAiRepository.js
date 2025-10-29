"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiRepository = void 0;
const openai_1 = __importDefault(require("openai"));
const TemplateRepository_1 = require("./TemplateRepository");
class OpenAiRepository {
    constructor(options) {
        this.idx = 0;
        this.model = options.model;
        this.timeoutMs = options.timeoutMs;
        this.templateRepo = options.templateRepo;
        if (options.client) {
            this.clients = [options.client];
        }
        else {
            this.clients = options.apiKeys.map((key) => new openai_1.default({ apiKey: key, organization: options.organization }));
        }
        if (this.clients.length === 0) {
            throw new Error('OpenAiRepository requires at least one OpenAI client');
        }
    }
    nextClient() {
        const client = this.clients[this.idx % this.clients.length];
        this.idx++;
        return client;
    }
    /**
     * Validate and normalize input text and version.
     */
    validateInputs(inputText, version) {
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
    async extractInformation(inputText, version, assistantMessages = []) {
        console.info('[OpenAiRepository] extractInformation:start');
        const controller = new AbortController();
        const timeoutErr = new Error('OpenAI request timed out');
        const prompt = `You are a formatter for a business card (${version} version).\nReturn JSON with keys: title, subtitle, fields[{label,value}], notes.\nDescription: ${inputText}`;
        const client = this.nextClient();
        const messages = [
            { role: 'system', content: 'You strictly output JSON only.' },
            ...assistantMessages,
            { role: 'user', content: prompt },
        ];
        try {
            const createPromise = client.chat.completions.create({
                model: this.model,
                messages,
                temperature: 0.2,
            }, { signal: controller.signal });
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    controller.abort(timeoutErr);
                    reject(timeoutErr);
                }, this.timeoutMs);
            });
            const completion = await Promise.race([createPromise, timeoutPromise]);
            const content = completion.choices?.[0]?.message?.content || '{}';
            let parsed;
            try {
                parsed = JSON.parse(content);
            }
            catch (_err) {
                parsed = { title: 'Business Card', fields: [{ label: 'Info', value: inputText }] };
            }
            const info = {
                title: String(parsed.title ?? 'Business Card'),
                subtitle: parsed.subtitle ? String(parsed.subtitle) : undefined,
                fields: Array.isArray(parsed.fields)
                    ? parsed.fields.map((f) => ({ label: String(f.label), value: String(f.value) }))
                    : [{ label: 'Info', value: inputText }],
                notes: parsed.notes ? String(parsed.notes) : undefined,
            };
            console.info('[OpenAiRepository] extractInformation:complete');
            return info;
        }
        catch (err) {
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
    async findRelevantTemplates(inputText) {
        console.info('[OpenAiRepository] findRelevantTemplates:start');
        if (!inputText || typeof inputText !== 'string' || inputText.trim().length === 0) {
            throw new Error('Template selection input must be a non-empty string');
        }
        const repo = this.templateRepo ?? new TemplateRepository_1.JsonTemplateRepository();
        let allTemplates;
        try {
            allTemplates = repo.getAll();
        }
        catch (err) {
            console.error('[OpenAiRepository] findRelevantTemplates:repo_error', err?.message || err);
            allTemplates = [];
        }
        // Prepare assistant message catalog of available templates
        const catalog = allTemplates
            .map((t) => `ID:${t.id} NAME:${t.name} TAGS:${(t.tags || []).join('|')} DESC:${t.description}`)
            .join('\n');
        const client = this.nextClient();
        const controller = new AbortController();
        const timeoutErr = new Error('OpenAI request timed out');
        const messages = [
            { role: 'system', content: 'You are a template matcher. You strictly output JSON only.' },
            { role: 'assistant', content: `Available templates:\n${catalog || '(none)'}` },
            {
                role: 'user',
                content: `User description: ${inputText}\n` +
                    `Select exactly the top 3 most relevant templates from the catalog. ` +
                    `Return JSON with key matches: [{id,name}]. Output JSON only.`,
            },
        ];
        try {
            const createPromise = client.chat.completions.create({ model: this.model, messages, temperature: 0 }, { signal: controller.signal });
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    controller.abort(timeoutErr);
                    reject(timeoutErr);
                }, this.timeoutMs);
            });
            const completion = await Promise.race([createPromise, timeoutPromise]);
            const content = completion.choices?.[0]?.message?.content || '{}';
            let parsed = {};
            try {
                parsed = JSON.parse(content);
            }
            catch (err) {
                console.warn('[OpenAiRepository] findRelevantTemplates:parse_failed, falling back to heuristic');
            }
            let selected = [];
            if (parsed && Array.isArray(parsed.matches)) {
                selected = parsed.matches
                    .slice(0, 3)
                    .map((m) => ({ id: String(m.id), name: String(m.name) }));
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
                    const score = [...nameTokens, ...descTokens, ...tagTokens]
                        .reduce((acc, tok) => acc + (tokenSet.has(tok) ? 1 : 0), 0);
                    return { id: t.id, name: t.name, score };
                });
                selected = scored.sort((a, b) => b.score - a.score).slice(0, 3).map(({ id, name }) => ({ id, name }));
            }
            const assistantSummary = selected.length > 0
                ? `Selected relevant templates: ${selected.map((r) => `${r.name} (ID:${r.id})`).join(', ')}`
                : 'No relevant templates selected.';
            console.info('[OpenAiRepository] findRelevantTemplates:complete');
            return { templates: selected, assistantMessages: [{ role: 'assistant', content: assistantSummary }] };
        }
        catch (err) {
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
    async analyzeRequest(inputText, version) {
        this.validateInputs(inputText, version);
        console.info('[OpenAiRepository] analyzeRequest:start');
        const { templates, assistantMessages } = await this.findRelevantTemplates(inputText);
        console.info('[OpenAiRepository] analyzeRequest:templates_selected');
        const info = await this.extractInformation(inputText, version, assistantMessages);
        console.info('[OpenAiRepository] analyzeRequest:complete');
        return { info, relevantTemplates: templates };
    }
}
exports.OpenAiRepository = OpenAiRepository;
