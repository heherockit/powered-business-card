"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const UserRepository_1 = require("../src/repositories/UserRepository");
const GetUserCommand_1 = require("../src/commands/user/GetUserCommand");
describe('GetUserCommand', () => {
    it('returns a user when it exists', () => {
        const repo = new UserRepository_1.InMemoryUserRepository();
        const cmd = new GetUserCommand_1.GetUserCommand(repo);
        const user = cmd.execute('1');
        assert_1.strict.ok(user);
    });
    it('returns undefined for missing users', () => {
        const repo = new UserRepository_1.InMemoryUserRepository();
        const cmd = new GetUserCommand_1.GetUserCommand(repo);
        const user = cmd.execute('missing');
        assert_1.strict.equal(user, undefined);
    });
});
