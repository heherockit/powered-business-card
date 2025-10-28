import fs from 'fs'
import path from 'path'
import type { BusinessCardTemplate } from '../models/BusinessCardTemplate'

export interface ITemplateRepository {
  getAll(): BusinessCardTemplate[]
}

export class JsonTemplateRepository implements ITemplateRepository {
  private templates: BusinessCardTemplate[]

  constructor() {
    this.templates = this.loadTemplates()
  }

  getAll(): BusinessCardTemplate[] {
    return [...this.templates]
  }

  private loadTemplates(): BusinessCardTemplate[] {
    // When compiled, __dirname will be dist/repositories; src/data will be copied to dist/data
    const dataPath = path.join(__dirname, '../data/templates.json')
    try {
      const raw = fs.readFileSync(dataPath, 'utf-8')
      const parsed = JSON.parse(raw) as BusinessCardTemplate[]
      return parsed
    } catch (err) {
      // Fallback: attempt to read from source during dev
      const devPath = path.join(__dirname, '../../src/data/templates.json')
      try {
        const raw = fs.readFileSync(devPath, 'utf-8')
        const parsed = JSON.parse(raw) as BusinessCardTemplate[]
        return parsed
      } catch (inner) {
        throw new Error(`Failed to load templates.json: ${String(err)}`)
      }
    }
  }
}