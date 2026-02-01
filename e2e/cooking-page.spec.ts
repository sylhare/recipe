import { test, expect } from '@playwright/test'

test.describe('Cooking Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('shows empty state when no recipes selected', async ({ page }) => {
    await page.getByRole('link', { name: 'Cooking' }).click()
    await expect(page).toHaveURL(/\/cooking$/)

    await expect(page.getByText('No recipes selected')).toBeVisible()
    await expect(page.getByText('Select some recipes from the Recipes tab to see cooking instructions here.')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Cooking Instructions' })).not.toBeVisible()
  })

  test('displays selected recipes with cooking instructions', async ({ page }) => {
    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('checkbox').click()

    await page.getByRole('link', { name: 'Cooking' }).click()

    await expect(page.getByRole('heading', { name: 'Cooking Instructions' })).toBeVisible()
    await expect(page.getByText('1 recipe selected')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Spaghetti Bolognese' })).toBeVisible()
  })

  test('shows plural subtitle for multiple recipes', async ({ page }) => {
    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('checkbox').click()

    const curryCard = page.locator('.recipe-card').filter({ hasText: 'Chicken Curry' })
    await curryCard.getByRole('checkbox').click()

    await page.getByRole('link', { name: 'Cooking' }).click()

    await expect(page.getByText('2 recipes selected')).toBeVisible()
  })

  test('displays scaled ingredients based on servings', async ({ page }) => {
    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('checkbox').click()

    for (let i = 0; i < 4; i++) {
      await spaghettiCard.getByRole('button', { name: 'Increase' }).click()
    }
    await expect(spaghettiCard.getByRole('spinbutton')).toHaveValue('8')

    await page.getByRole('link', { name: 'Cooking' }).click()

    await page.locator('.recipe-instruction-card__header').click()

    const ingredientsList = page.locator('.ingredients-list')
    await expect(ingredientsList.getByText('800 g').first()).toBeVisible()
    await expect(ingredientsList.getByText('Spaghetti')).toBeVisible()
  })

  test('can expand and collapse recipe card', async ({ page }) => {
    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('checkbox').click()

    await page.getByRole('link', { name: 'Cooking' }).click()

    await expect(page.locator('.recipe-instruction-card__content')).not.toBeVisible()
    await expect(page.locator('.recipe-instruction-card__toggle').getByText('▶')).toBeVisible()

    await page.locator('.recipe-instruction-card__header').click()

    await expect(page.getByRole('heading', { name: 'Ingredients' })).toBeVisible()
    await expect(page.locator('.recipe-instruction-card__toggle').getByText('▼')).toBeVisible()

    await page.locator('.recipe-instruction-card__header').click()

    await expect(page.locator('.recipe-instruction-card__content')).not.toBeVisible()
    await expect(page.locator('.recipe-instruction-card__toggle').getByText('▶')).toBeVisible()
  })

  test('can remove recipe from cooking page', async ({ page }) => {
    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('checkbox').click()

    const curryCard = page.locator('.recipe-card').filter({ hasText: 'Chicken Curry' })
    await curryCard.getByRole('checkbox').click()

    await page.getByRole('link', { name: 'Cooking' }).click()

    await expect(page.getByText('2 recipes selected')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Spaghetti Bolognese' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Chicken Curry' })).toBeVisible()

    const spaghettiInstructionCard = page.locator('.recipe-instruction-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiInstructionCard.getByRole('button', { name: '✕' }).click()

    await expect(page.getByText('1 recipe selected')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Spaghetti Bolognese' })).not.toBeVisible()
    await expect(page.getByRole('heading', { name: 'Chicken Curry' })).toBeVisible()
  })

  test('removing last recipe shows empty state', async ({ page }) => {
    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('checkbox').click()

    await page.getByRole('link', { name: 'Cooking' }).click()

    await expect(page.getByRole('heading', { name: 'Spaghetti Bolognese' })).toBeVisible()

    await page.getByRole('button', { name: '✕' }).click()

    await expect(page.getByText('No recipes selected')).toBeVisible()
  })

  test('displays instruction sections', async ({ page }) => {
    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('checkbox').click()

    await page.getByRole('link', { name: 'Cooking' }).click()

    await page.locator('.recipe-instruction-card__header').click()

    const instructionPhases = page.locator('.instruction-phase')
    await expect(instructionPhases.first()).toBeVisible()

    const instructionSteps = page.locator('.instruction-step')
    const stepCount = await instructionSteps.count()
    expect(stepCount).toBeGreaterThan(0)
  })

  test('cooking page badge updates with selection count', async ({ page }) => {
    const cookingLink = page.getByRole('link', { name: 'Cooking' })
    await expect(cookingLink).toBeVisible()

    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('checkbox').click()

    await expect(page.locator('.header__badge').getByText('1')).toBeVisible()

    const curryCard = page.locator('.recipe-card').filter({ hasText: 'Chicken Curry' })
    await curryCard.getByRole('checkbox').click()

    await expect(page.locator('.header__badge').getByText('2')).toBeVisible()
  })

  test('recipe selections persist after page reload', async ({ page }) => {
    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('checkbox').click()

    await page.getByRole('link', { name: 'Cooking' }).click()
    await expect(page.getByRole('heading', { name: 'Spaghetti Bolognese' })).toBeVisible()

    await page.reload()

    await expect(page.getByRole('heading', { name: 'Spaghetti Bolognese' })).toBeVisible()
  })
})
