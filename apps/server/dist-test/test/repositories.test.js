"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const UserRepository_1 = require("../src/repositories/UserRepository");
describe('InMemoryUserRepository', () => {
    it('lists default users', () => {
        const repo = new UserRepository_1.InMemoryUserRepository();
        const users = repo.list();
        assert_1.strict.ok(users.length >= 2);
    });
    it('adds and removes a user', () => {
        const repo = new UserRepository_1.InMemoryUserRepository();
        const id = '99';
        repo.add({ id, name: 'Test User', email: 'test@example.com' });
        assert_1.strict.equal(repo.getById(id)?.name, 'Test User');
        assert_1.strict.equal(repo.remove(id), true);
        assert_1.strict.equal(repo.getById(id), undefined);
    });
});
