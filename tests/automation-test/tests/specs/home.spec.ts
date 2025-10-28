import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage'

test.describe('Webapp Homepage', () => {
  test('shows label and accepts long input', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()

    await expect(home.label).toHaveText(
      'Enter a description of what to show on the business card'
    )

    const longText = 'Name: Jane Doe; Title: Staff Engineer; Email: jane@company.com; Phone: +1-555-1234; Website: company.com; Address: 123 Main St, City, Country; Notes: Available M-F, 9-5; LinkedIn: linkedin.com/in/janedoe'
    await home.enterDescription(longText)
    await expect(home.input).toHaveValue(longText)
  })
})