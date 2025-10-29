"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
function loadConfig(env = process.env) {
    const port = Number(env.PORT || 8080);
    const timeoutMs = Number(env.OPENAI_TIMEOUT_MS || 15000);
    const baseUrl = env.OPENAI_BASE_URL || 'https://api.openai.com';
    const model = env.OPENAI_MODEL || 'gpt-4o-mini';
    const organization = env.OPENAI_ORG_ID || undefined;
    const apiKeysEnv = env.OPENAI_API_KEYS || env.OPENAI_API_KEY || '';
    const apiKeys = apiKeysEnv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    if (apiKeys.length === 0) {
        throw new Error('Missing OpenAI API key(s): set OPENAI_API_KEY or OPENAI_API_KEYS');
    }
    const max = Number(env.RATE_LIMIT_MAX || 20);
    const timeWindowMs = Number(env.RATE_LIMIT_WINDOW_MS || 60000);
    return {
        port,
        openai: { baseUrl, apiKeys, organization, model, timeoutMs },
        rateLimit: { max, timeWindowMs },
    };
}
