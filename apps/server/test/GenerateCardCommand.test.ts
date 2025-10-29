import { strict as assert } from 'assert';
import { GenerateCardCommand } from '../src/commands/card/GenerateCardCommand';

class MockRepo {
  async analyzeRequest(input: string, _version: 'web' | 'mobile') {
    return { info: { title: 'ok', fields: [{ label: 'd', value: input }] }, relevantTemplates: [] };
  }
}

describe('GenerateCardCommand', () => {
  it('validates and sanitizes description', async () => {
    const cmd = new GenerateCardCommand(new MockRepo() as any);
    const res = await cmd.execute({ description: '  hello   \nworld\t' });
    assert.equal(res.info.fields[0].value, 'hello world');
  });

  it('rejects empty description', async () => {
    const cmd = new GenerateCardCommand(new MockRepo() as any);
    await assert.rejects(() => cmd.execute({ description: '   ' }), /required/i);
  });
});
