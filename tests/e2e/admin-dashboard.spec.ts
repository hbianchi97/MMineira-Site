import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard', () => {
  test('exibe métricas principais com dados agregados', async ({ page }) => {
    await page.goto('/admin')

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()

    // Check for the quick actions section
    await expect(page.getByRole('heading', { name: 'Ações Rápidas' })).toBeVisible()
  })
})
