"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateCardCommand = void 0;
class GenerateCardCommand {
    constructor(repo) {
        this.repo = repo;
    }
    async execute(input) {
        const description = (input.description ?? '').trim();
        if (!description) {
            throw new Error('Description is required');
        }
        const sanitized = sanitize(description);
        const version = input.version === 'mobile' ? 'mobile' : 'web';
        return this.repo.analyzeRequest(sanitized, version);
    }
}
exports.GenerateCardCommand = GenerateCardCommand;
function sanitize(text) {
    // Basic sanitization: trim, collapse whitespace, strip control chars, limit length
    const collapsed = text.replace(/\s+/g, ' ').trim();
    const stripped = collapsed.replace(/[\u0000-\u001F\u007F]/g, '');
    return stripped.slice(0, 1000);
}
