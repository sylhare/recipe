import { test, expect } from '@playwright/test'

test.describe('Recipe Detail Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('clicking recipe title opens detail modal with ingredients', async ({ page }) => {
    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('button', { name: 'Spaghetti Bolognese' }).click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('dialog').getByRole('heading', { name: 'Spaghetti Bolognese' })).toBeVisible()
    await expect(page.getByRole('dialog').getByRole('heading', { name: 'Ingredients' })).toBeVisible()
    await expect(page.getByRole('dialog').locator('.ingredients-list')).toBeVisible()
    await expect(page.getByRole('dialog').locator('.ingredients-list__item').first()).toBeVisible()
  })

  test('clicking recipe title opens detail modal with cooking instructions', async ({ page }) => {
    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('button', { name: 'Spaghetti Bolognese' }).click()

    await expect(page.getByRole('dialog').getByRole('heading', { name: 'Instructions' })).toBeVisible()
    const steps = page.getByRole('dialog').locator('.instruction-step')
    const stepCount = await steps.count()
    expect(stepCount).toBeGreaterThan(0)
    await expect(steps.first()).toBeVisible()
  })

  test('closing modal with close button hides the modal', async ({ page }) => {
    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('button', { name: 'Spaghetti Bolognese' }).click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: 'Close' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('closing modal by clicking overlay hides the modal', async ({ page }) => {
    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('button', { name: 'Spaghetti Bolognese' }).click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await page.locator('.recipe-detail-modal-overlay').click({ position: { x: 5, y: 5 } })
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('clicking recipe image opens detail modal', async ({ page }) => {
    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.locator('.recipe-card__image-container').click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('dialog').getByRole('heading', { name: 'Spaghetti Bolognese' })).toBeVisible()
  })

  test('modal does not affect recipe selection state', async ({ page }) => {
    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('button', { name: 'Spaghetti Bolognese' }).click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: 'Close' }).click()

    await expect(spaghettiCard.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked')
  })
})
