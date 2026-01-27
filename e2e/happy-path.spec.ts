import { test, expect } from '@playwright/test'

test.describe('Recipe App Happy Path', () => {
  test('complete shopping flow', async ({ page }) => {
    // Clear localStorage before test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    // 1. Visit home page and see recipe list
    await expect(page.getByRole('heading', { name: 'Choose Your Recipes' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Spaghetti Bolognese' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Chicken Curry' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Caesar Salad' })).toBeVisible()

    // 2. Select first recipe (Spaghetti Bolognese)
    const spaghettiCard = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await spaghettiCard.getByRole('checkbox').click()
    await expect(spaghettiCard.getByRole('checkbox')).toHaveAttribute('data-state', 'checked')

    // Servings input should appear
    await expect(spaghettiCard.getByLabel('Servings:')).toBeVisible()
    await expect(spaghettiCard.getByRole('spinbutton')).toHaveValue('4')

    // 3. Adjust servings to 8
    await spaghettiCard.getByRole('button', { name: 'Increase' }).click()
    await spaghettiCard.getByRole('button', { name: 'Increase' }).click()
    await spaghettiCard.getByRole('button', { name: 'Increase' }).click()
    await spaghettiCard.getByRole('button', { name: 'Increase' }).click()
    await expect(spaghettiCard.getByRole('spinbutton')).toHaveValue('8')

    // 4. Select second recipe (Caesar Salad)
    const saladCard = page.locator('.recipe-card').filter({ hasText: 'Caesar Salad' })
    await saladCard.getByRole('checkbox').click()
    await expect(saladCard.getByRole('checkbox')).toHaveAttribute('data-state', 'checked')

    // Badge should show 2 selected recipes
    await expect(page.getByText('2', { exact: true }).first()).toBeVisible()

    // 5. Navigate to shopping list
    await page.getByRole('link', { name: /Shopping List/ }).click()
    await expect(page.getByRole('heading', { name: 'Shopping List' })).toBeVisible()

    // 6. Verify scaled quantities
    // Spaghetti Bolognese with 8 servings (2x default of 4)
    // Original: 400g Spaghetti -> 800g
    await expect(page.getByText('Spaghetti - 800 g')).toBeVisible()

    // Original: 500g Ground Beef -> 1000g
    await expect(page.getByText('Ground Beef - 1000 g')).toBeVisible()

    // Original: 1 Onion at 4 servings = 2 Onions at 8 servings
    // Plus 1 Onion from Caesar Salad (would be aggregated if same)
    // Caesar has no onion, so just 2 from Spaghetti
    await expect(page.getByText(/Onion - 2 piece/)).toBeVisible()

    // Verify categories are displayed
    await expect(page.getByText('Produce')).toBeVisible()
    await expect(page.getByText('Meat')).toBeVisible()
    await expect(page.getByText('Pantry')).toBeVisible()

    // 7. Check off some items
    const onionItem = page.getByText('Onion - 2 piece')
    await onionItem.click()

    // Verify strikethrough is applied
    await expect(page.locator('.checkbox-label--checked').filter({ hasText: 'Onion' })).toBeVisible()

    // Check counter updates
    await expect(page.getByText(/1 of \d+ items checked/)).toBeVisible()

    // 8. Reload page and verify persistence
    await page.reload()

    // Selections should persist
    await expect(page.getByRole('heading', { name: 'Shopping List' })).toBeVisible()
    await expect(page.getByText('Spaghetti - 800 g')).toBeVisible()

    // Checked state should persist
    await expect(page.locator('.checkbox-label--checked').filter({ hasText: 'Onion' })).toBeVisible()

    // 9. Go back to home and verify selections persist
    await page.getByRole('link', { name: 'Recipes', exact: true }).click()
    const spaghettiCardAfterReload = page.locator('.recipe-card').filter({ hasText: 'Spaghetti Bolognese' })
    await expect(spaghettiCardAfterReload.getByRole('checkbox')).toHaveAttribute('data-state', 'checked')
    await expect(spaghettiCardAfterReload.getByRole('spinbutton')).toHaveValue('8')

    // 10. Clear all and verify reset
    await page.getByRole('link', { name: /Shopping List/ }).click()
    await page.getByRole('button', { name: 'Clear All' }).click()

    // Confirmation dialog should appear
    await expect(page.getByText('Clear Shopping List')).toBeVisible()
    await expect(page.getByText(/This will remove all selected recipes/)).toBeVisible()

    // Confirm clear
    await page.getByRole('button', { name: 'Yes, Clear All' }).click()

    // Should redirect to home
    await expect(page.getByRole('heading', { name: 'Choose Your Recipes' })).toBeVisible()

    // All recipes should be deselected
    const allCheckboxes = page.locator('.recipe-card').getByRole('checkbox')
    const checkboxCount = await allCheckboxes.count()
    for (let i = 0; i < checkboxCount; i++) {
      await expect(allCheckboxes.nth(i)).toHaveAttribute('data-state', 'unchecked')
    }
  })

  test('empty shopping list shows message', async ({ page }) => {
    // Clear localStorage before test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.goto('shopping-list')

    await expect(page.getByText('No items in your shopping list.')).toBeVisible()
    await expect(page.getByText('Select some recipes to get started.')).toBeVisible()

    // Clear button should not be visible
    await expect(page.getByRole('button', { name: 'Clear All' })).not.toBeVisible()
  })

  test('navigation between pages works correctly', async ({ page }) => {
    await page.goto('/')

    // Navigate to shopping list
    await page.getByRole('link', { name: /Shopping List/ }).click()
    await expect(page).toHaveURL(/\/shopping-list$/)

    // Navigate back to recipes
    await page.getByRole('link', { name: 'Recipes', exact: true }).click()
    await expect(page).toHaveURL(/\/recipe\/?$/)

    // Navigate using logo
    await page.getByRole('link', { name: /Shopping List/ }).click()
    await page.getByRole('link', { name: 'Recipe App' }).click()
    await expect(page).toHaveURL(/\/recipe\/?$/)
  })
})
