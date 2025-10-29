"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const env_1 = require("../src/config/env");
describe('env config', () => {
    it('throws when no api key present', () => {
        assert_1.strict.throws(() => (0, env_1.loadConfig)({}), /Missing OpenAI API key/);
    });
    it('parses comma-separated keys', () => {
        const cfg = (0, env_1.loadConfig)({ OPENAI_API_KEYS: 'a, b ,c', RATE_LIMIT_MAX: '5', RATE_LIMIT_WINDOW_MS: '1000' });
        assert_1.strict.deepEqual(cfg.openai.apiKeys, ['a', 'b', 'c']);
        assert_1.strict.equal(cfg.rateLimit.max, 5);
        assert_1.strict.equal(cfg.rateLimit.timeWindowMs, 1000);
    });
});
