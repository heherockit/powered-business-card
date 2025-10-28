"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryUserRepository = void 0;
class InMemoryUserRepository {
    constructor() {
        this.users = [
            { id: '1', name: 'Alice Example', email: 'alice@example.com' },
            { id: '2', name: 'Bob Example', email: 'bob@example.com' },
        ];
    }
    getById(id) {
        return this.users.find((u) => u.id === id);
    }
    list() {
        return [...this.users];
    }
    add(user) {
        this.users.push(user);
    }
    remove(id) {
        const idx = this.users.findIndex((u) => u.id === id);
        if (idx >= 0) {
            this.users.splice(idx, 1);
            return true;
        }
        return false;
    }
}
exports.InMemoryUserRepository = InMemoryUserRepository;
