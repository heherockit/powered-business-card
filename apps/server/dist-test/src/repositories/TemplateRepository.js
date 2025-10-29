"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonTemplateRepository = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class JsonTemplateRepository {
    constructor() {
        this.templates = this.loadTemplates();
    }
    getAll() {
        return [...this.templates];
    }
    loadTemplates() {
        // When compiled, __dirname will be dist/repositories; src/data will be copied to dist/data
        const dataPath = path_1.default.join(__dirname, '../data/templates.json');
        try {
            const raw = fs_1.default.readFileSync(dataPath, 'utf-8');
            const parsed = JSON.parse(raw);
            return parsed;
        }
        catch (err) {
            // Fallback: attempt to read from source during dev
            const devPath = path_1.default.join(__dirname, '../../src/data/templates.json');
            try {
                const raw = fs_1.default.readFileSync(devPath, 'utf-8');
                const parsed = JSON.parse(raw);
                return parsed;
            }
            catch (inner) {
                throw new Error(`Failed to load templates.json: ${String(err)}`);
            }
        }
    }
}
exports.JsonTemplateRepository = JsonTemplateRepository;
