"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserCommand = void 0;
class GetUserCommand {
    constructor(repo) {
        this.repo = repo;
    }
    execute(id) {
        return this.repo.getById(id);
    }
}
exports.GetUserCommand = GetUserCommand;
