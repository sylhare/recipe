import { test, expect } from '@playwright/test'

test.describe('Language Switcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('default language is English', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Recipes', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: /Cooking/ })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Shopping List' })).toBeVisible()

    await expect(page.getByRole('heading', { name: 'Choose Your Recipes' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Spaghetti Bolognese' })).toBeVisible()
  })

  test('clicking FR switches nav labels to French', async ({ page }) => {
    await page.getByRole('button', { name: 'Switch to FR' }).click()

    await expect(page.getByRole('link', { name: 'Recettes' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Cuisine/ })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Liste de courses' })).toBeVisible()

    await expect(page.getByRole('heading', { name: 'Choisissez vos recettes' })).toBeVisible()
  })

  test('recipe names and descriptions switch to French for translated recipes', async ({ page }) => {
    await page.getByRole('button', { name: 'Switch to FR' }).click()

    await expect(page.getByRole('heading', { name: 'Spaghetti Bolognaise' })).toBeVisible()
    await expect(page.getByText('Pâtes italiennes classiques avec une riche sauce à la viande')).toBeVisible()

    await expect(page.getByRole('heading', { name: 'Galette de Sarrasin' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Crêpe Bretonne' })).toBeVisible()
  })

  test('ingredient names in shopping list switch to French', async ({ page }) => {
    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('checkbox').click()

    await page.getByRole('button', { name: 'Switch to FR' }).click()

    await page.getByRole('link', { name: 'Liste de courses' }).click()
    await expect(page.getByRole('heading', { name: 'Liste de courses' })).toBeVisible()

    await expect(page.getByText(/Bœuf haché/)).toBeVisible()
    await expect(page.getByText(/Oignon/)).toBeVisible()
    await expect(page.getByText(/Parmesan/)).toBeVisible()

    await expect(page.getByText('Viandes')).toBeVisible()
    await expect(page.getByText('Épicerie')).toBeVisible()
  })

  test('language persists after page refresh', async ({ page }) => {
    await page.getByRole('button', { name: 'Switch to FR' }).click()
    await expect(page.getByRole('link', { name: 'Recettes' })).toBeVisible()

    await page.reload()

    await expect(page.getByRole('link', { name: 'Recettes' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Choisissez vos recettes' })).toBeVisible()
  })

  test('clicking EN reverts to English', async ({ page }) => {
    await page.getByRole('button', { name: 'Switch to FR' }).click()
    await expect(page.getByRole('link', { name: 'Recettes' })).toBeVisible()

    await page.getByRole('button', { name: 'Switch to EN' }).click()

    await expect(page.getByRole('link', { name: 'Recipes', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Choose Your Recipes' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Spaghetti Bolognese' })).toBeVisible()
  })

  test('full cooking flow in French', async ({ page }) => {
    await page.getByRole('button', { name: 'Switch to FR' }).click()
    await expect(page.getByRole('heading', { name: 'Choisissez vos recettes' })).toBeVisible()

    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognaise' })
    await spaghettiCard.getByRole('checkbox').click()

    await page.getByRole('link', { name: /Cuisine/ }).click()
    await expect(page.getByRole('heading', { name: 'Instructions de cuisine' })).toBeVisible()

    const instructionCard = page.locator('.recipe-instruction-card').filter({ hasText: 'Spaghetti Bolognaise' })
    await instructionCard.locator('.recipe-instruction-card__header').click()

    await expect(instructionCard.getByRole('heading', { name: 'Spaghetti Bolognaise' })).toBeVisible()
    await expect(instructionCard.locator('.ingredients-list__name', { hasText: 'Bœuf haché' })).toBeVisible()
    await expect(instructionCard.locator('.instruction-step').first()).toBeVisible()
  })
})
