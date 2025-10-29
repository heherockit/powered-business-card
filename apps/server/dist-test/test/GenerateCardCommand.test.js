"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const GenerateCardCommand_1 = require("../src/commands/card/GenerateCardCommand");
class MockRepo {
    async analyzeRequest(input, _version) {
        return { info: { title: 'ok', fields: [{ label: 'd', value: input }] }, relevantTemplates: [] };
    }
}
describe('GenerateCardCommand', () => {
    it('validates and sanitizes description', async () => {
        const cmd = new GenerateCardCommand_1.GenerateCardCommand(new MockRepo());
        const res = await cmd.execute({ description: '  hello   \nworld\t' });
        assert_1.strict.equal(res.info.fields[0].value, 'hello world');
    });
    it('rejects empty description', async () => {
        const cmd = new GenerateCardCommand_1.GenerateCardCommand(new MockRepo());
        await assert_1.strict.rejects(() => cmd.execute({ description: '   ' }), /required/i);
    });
});
