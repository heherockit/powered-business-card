import { Page, Locator } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly label: Locator
  readonly input: Locator

  constructor(page: Page) {
    this.page = page
    this.label = page.locator('label[for="card-input"]')
    this.input = page.locator('#card-input')
  }

  async goto() {
    await this.page.goto('/')
  }

  async enterDescription(text: string) {
    await this.input.fill(text)
  }
}