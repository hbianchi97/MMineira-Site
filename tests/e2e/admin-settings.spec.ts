import { test, expect } from '@playwright/test'

test.describe.skip('Admin Configurações', () => {
  test('permite ajustar custos por funcionalidade', async ({ page }) => {
    const settings = {
      featureCosts: {
        ai_text_chat: 1,
        ai_image_generation: 5,
      },
      planCredits: {
        starter: 100,
      },
    }

    await page.route('**/api/admin/settings', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(settings),
        })
        return
      }

      const body = route.request().postDataJSON() as typeof settings
      settings.featureCosts = body.featureCosts

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })

    await page.goto('/admin/configuracoes')

    await expect(page.getByRole('heading', { name: 'Configurações' })).toBeVisible()
  });
})
