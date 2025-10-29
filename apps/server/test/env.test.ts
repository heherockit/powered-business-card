import { strict as assert } from 'assert';
import { loadConfig } from '../src/config/env';

describe('env config', () => {
  it('throws when no api key present', () => {
    assert.throws(() => loadConfig({}), /Missing OpenAI API key/);
  });

  it('parses comma-separated keys', () => {
    const cfg = loadConfig({
      OPENAI_API_KEYS: 'a, b ,c',
      RATE_LIMIT_MAX: '5',
      RATE_LIMIT_WINDOW_MS: '1000',
    } as any);
    assert.deepEqual(cfg.openai.apiKeys, ['a', 'b', 'c']);
    assert.equal(cfg.rateLimit.max, 5);
    assert.equal(cfg.rateLimit.timeWindowMs, 1000);
  });
});
