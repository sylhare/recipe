import { test, expect } from '@playwright/test'

test.describe('Recipe and Ingredient Images', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('new recipes appear in the recipe list', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Spaghetti Carbonara' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Garlic Butter Beef Fried Rice' })).toBeVisible()
  })

  test('all recipe card images load at correct size (500x500)', async ({ page }) => {
    const images = page.locator('.recipe-card__image')
    const count = await images.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      await img.scrollIntoViewIfNeeded()
      await expect(img).toBeVisible()
      await expect(async () => {
        const { naturalWidth, naturalHeight } = await img.evaluate((el: HTMLImageElement) => ({
          naturalWidth: el.naturalWidth,
          naturalHeight: el.naturalHeight,
        }))
        expect(naturalWidth, `Image ${i} width`).toBe(500)
        expect(naturalHeight, `Image ${i} height`).toBe(500)
      }).toPass({ timeout: 10000 })
    }
  })

  test('new recipe images load at correct size (500x500)', async ({ page }) => {
    for (const recipeName of ['Spaghetti Carbonara', 'Garlic Butter Beef Fried Rice']) {
      const card = page.locator('.recipe-card').filter({ hasText: recipeName })
      const img = card.locator('.recipe-card__image')
      await img.scrollIntoViewIfNeeded()
      await expect(img).toBeVisible()

      await expect(async () => {
        const { naturalWidth, naturalHeight } = await img.evaluate((el: HTMLImageElement) => ({
          naturalWidth: el.naturalWidth,
          naturalHeight: el.naturalHeight,
        }))
        expect(naturalWidth, `${recipeName} image width`).toBe(500)
        expect(naturalHeight, `${recipeName} image height`).toBe(500)
      }).toPass({ timeout: 10000 })
    }
  })

  test('ingredient images in shopping list load at correct size (128x128)', async ({ page }) => {
    const card = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Carbonara' })
    await card.getByRole('checkbox').click()

    await page.getByRole('link', { name: /Shopping List/ }).click()
    await expect(page.getByRole('heading', { name: 'Shopping List' })).toBeVisible()

    const ingredientImages = page.locator('.shopping-list-item-image img')
    const count = await ingredientImages.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const img = ingredientImages.nth(i)
      await expect(img).toBeVisible()
      await expect(async () => {
        const { naturalWidth, naturalHeight } = await img.evaluate((el: HTMLImageElement) => ({
          naturalWidth: el.naturalWidth,
          naturalHeight: el.naturalHeight,
        }))
        expect(naturalWidth, `Ingredient image ${i} width`).toBe(128)
        expect(naturalHeight, `Ingredient image ${i} height`).toBe(128)
      }).toPass({ timeout: 10000 })
    }
  })

  test('ingredient images in shopping list load for fried rice recipe', async ({ page }) => {
    const card = page.locator('.recipe-card').filter({ hasText: 'Garlic Butter Beef Fried Rice' })
    await card.getByRole('checkbox').click()

    await page.getByRole('link', { name: /Shopping List/ }).click()
    await expect(page.getByRole('heading', { name: 'Shopping List' })).toBeVisible()

    const ingredientImages = page.locator('.shopping-list-item-image img')
    const count = await ingredientImages.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const img = ingredientImages.nth(i)
      await expect(img).toBeVisible()
      await expect(async () => {
        const { naturalWidth, naturalHeight } = await img.evaluate((el: HTMLImageElement) => ({
          naturalWidth: el.naturalWidth,
          naturalHeight: el.naturalHeight,
        }))
        expect(naturalWidth, `Ingredient image ${i} width`).toBe(128)
        expect(naturalHeight, `Ingredient image ${i} height`).toBe(128)
      }).toPass({ timeout: 10000 })
    }
  })
})
