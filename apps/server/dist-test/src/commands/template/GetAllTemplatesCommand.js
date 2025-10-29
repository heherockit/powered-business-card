"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllTemplatesCommand = void 0;
class GetAllTemplatesCommand {
    constructor(repo) {
        this.repo = repo;
    }
    execute() {
        return this.repo.getAll();
    }
}
exports.GetAllTemplatesCommand = GetAllTemplatesCommand;
