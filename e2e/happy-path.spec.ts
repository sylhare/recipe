import { test, expect } from '@playwright/test'

test.describe('Recipe App Happy Path', () => {
  test('complete shopping flow', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    await expect(page.getByRole('heading', { name: 'Choose Your Recipes' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Spaghetti Bolognese' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Chicken Curry' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Caesar Salad' })).toBeVisible()

    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('checkbox').click()
    await expect(spaghettiCard.getByRole('checkbox')).toHaveAttribute('data-state', 'checked')

    await expect(spaghettiCard.getByLabel('Servings')).toBeVisible()
    await expect(spaghettiCard.getByRole('spinbutton')).toHaveValue('4')

    await spaghettiCard.getByRole('button', { name: 'Increase' }).click()
    await spaghettiCard.getByRole('button', { name: 'Increase' }).click()
    await spaghettiCard.getByRole('button', { name: 'Increase' }).click()
    await spaghettiCard.getByRole('button', { name: 'Increase' }).click()
    await expect(spaghettiCard.getByRole('spinbutton')).toHaveValue('8')

    const saladCard = page.locator('.recipe-card').filter({ hasText: 'Caesar Salad' })
    await saladCard.getByRole('checkbox').click()
    await expect(saladCard.getByRole('checkbox')).toHaveAttribute('data-state', 'checked')

    await expect(page.getByText('2', { exact: true }).first()).toBeVisible()

    await page.getByRole('link', { name: /Shopping List/ }).click()
    await expect(page.getByRole('heading', { name: 'Shopping List' })).toBeVisible()

    await expect(page.getByText('Spaghetti - 800 g')).toBeVisible()
    await expect(page.getByText('Ground Beef - 1000 g')).toBeVisible()
    await expect(page.getByText(/Onion - 2 piece/)).toBeVisible()

    await expect(page.getByText('Produce')).toBeVisible()
    await expect(page.getByText('Meat')).toBeVisible()
    await expect(page.getByText('Pantry')).toBeVisible()

    const onionItem = page.getByText('Onion - 2 piece')
    await onionItem.click()

    await expect(page.locator('.checkbox-label--checked').filter({ hasText: 'Onion' })).toBeVisible()
    await expect(page.getByText(/1 of \d+ items checked/)).toBeVisible()

    await page.reload()

    await expect(page.getByRole('heading', { name: 'Shopping List' })).toBeVisible()
    await expect(page.getByText('Spaghetti - 800 g')).toBeVisible()
    await expect(page.locator('.checkbox-label--checked').filter({ hasText: 'Onion' })).toBeVisible()

    await page.getByRole('link', { name: 'Recipes', exact: true }).click()
    const spaghettiCardAfterReload = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await expect(spaghettiCardAfterReload.getByRole('checkbox')).toHaveAttribute('data-state', 'checked')
    await expect(spaghettiCardAfterReload.getByRole('spinbutton')).toHaveValue('8')

    await page.getByRole('link', { name: /Shopping List/ }).click()
    await page.getByRole('button', { name: 'Clear All' }).click()

    await expect(page.getByText('Clear Shopping List')).toBeVisible()
    await expect(page.getByText(/This will remove all selected recipes/)).toBeVisible()

    await page.getByRole('button', { name: 'Yes, Clear All' }).click()

    await expect(page.getByRole('heading', { name: 'Choose Your Recipes' })).toBeVisible()

    const allCheckboxes = page.locator('.recipe-card').getByRole('checkbox')
    const checkboxCount = await allCheckboxes.count()
    for (let i = 0; i < checkboxCount; i++) {
      await expect(allCheckboxes.nth(i)).toHaveAttribute('data-state', 'unchecked')
    }
  })

  test('empty shopping list shows message', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/#/shopping-list')

    await expect(page.getByText('No items in your shopping list.')).toBeVisible()
    await expect(page.getByText('Select some recipes to get started.')).toBeVisible()

    await expect(page.getByRole('button', { name: 'Clear All' })).not.toBeVisible()
  })

  test('navigation between pages works correctly', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /Shopping List/ }).click()
    await expect(page).toHaveURL(/\/shopping-list$/)

    await page.getByRole('link', { name: 'Recipes', exact: true }).click()
    await expect(page).toHaveURL(/recipe\/#\/?$/)

    await page.getByRole('link', { name: /Shopping List/ }).click()
    await page.getByRole('link', { name: 'Recipe App' }).click()
    await expect(page).toHaveURL(/recipe\/#\/?$/)
  })

  test('recipe images are displayed correctly', async ({ page }) => {
    await page.goto('/')

    const recipeImages = page.locator('.recipe-card__image')
    const count = await recipeImages.count()
    expect(count).toBeGreaterThan(0)

    const imagesToCheck = Math.min(count, 5)
    for (let i = 0; i < imagesToCheck; i++) {
      const img = recipeImages.nth(i)
      await expect(img).toBeVisible()
      await expect(async () => {
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)
        expect(naturalWidth).toBeGreaterThan(0)
      }).toPass({ timeout: 5000 })
    }
  })
})
