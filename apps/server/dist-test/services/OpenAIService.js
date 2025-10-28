"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIService = void 0;
const openai_1 = __importDefault(require("openai"));
class OpenAIService {
    constructor(apiKey = process.env.OPENAI_API_KEY, model = process.env.OPENAI_MODEL || 'gpt-4o-mini') {
        if (!apiKey)
            throw new Error('OPENAI_API_KEY is not set');
        this.client = new openai_1.default({ apiKey });
        this.model = model;
    }
    async generateCard(req) {
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
            return data;
        }
        catch {
            return { title: 'Business Card', fields: [{ label: 'Info', value: req.description }] };
        }
    }
}
exports.OpenAIService = OpenAIService;
