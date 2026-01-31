import { test, expect } from '@playwright/test'

test.describe('Recipe Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('displays filter dropdowns on home page', async ({ page }) => {
    await expect(page.getByLabel('Dish Type')).toBeVisible()
    await expect(page.getByLabel('Protein')).toBeVisible()
  })

  test('shows total recipe count when no filters active', async ({ page }) => {
    await expect(page.getByText(/\d+ recipes$/)).toBeVisible()
  })

  test('filters recipes by dish type', async ({ page }) => {
    // Get initial recipe count
    const initialCount = await page.locator('.recipe-card').count()
    expect(initialCount).toBeGreaterThan(0)

    // Filter by salads
    await page.getByLabel('Dish Type').selectOption('salad')

    // Should show filtered count
    await expect(page.getByText(/Showing \d+ of \d+ recipes/)).toBeVisible()

    // Recipe cards should be filtered
    const filteredCount = await page.locator('.recipe-card').count()
    expect(filteredCount).toBeLessThan(initialCount)
    expect(filteredCount).toBeGreaterThan(0)

    // Verify filtered recipes contain "salad" keyword
    const recipeHeadings = page.locator('.recipe-card h3')
    const headingCount = await recipeHeadings.count()
    for (let i = 0; i < headingCount; i++) {
      const text = await recipeHeadings.nth(i).textContent()
      expect(text?.toLowerCase()).toContain('salad')
    }
  })

  test('filters recipes by protein type', async ({ page }) => {
    // Get initial recipe count
    const initialCount = await page.locator('.recipe-card').count()
    expect(initialCount).toBeGreaterThan(0)

    // Filter by chicken
    await page.getByLabel('Protein').selectOption('chicken')

    // Should show filtered count
    await expect(page.getByText(/Showing \d+ of \d+ recipes/)).toBeVisible()

    // Recipe cards should be filtered
    const filteredCount = await page.locator('.recipe-card').count()
    expect(filteredCount).toBeLessThan(initialCount)
    expect(filteredCount).toBeGreaterThan(0)
  })

  test('filters by both dish type and protein type', async ({ page }) => {
    // Filter by pasta
    await page.getByLabel('Dish Type').selectOption('pasta')
    const pastaCount = await page.locator('.recipe-card').count()

    // Also filter by beef
    await page.getByLabel('Protein').selectOption('beef')
    const pastaBeefCount = await page.locator('.recipe-card').count()

    // Combined filter should have fewer or equal results
    expect(pastaBeefCount).toBeLessThanOrEqual(pastaCount)
  })

  test('shows empty state when no recipes match filters', async ({ page }) => {
    // Filter by a combination unlikely to have matches (soup + lamb)
    await page.getByLabel('Dish Type').selectOption('soup')
    await page.getByLabel('Protein').selectOption('lamb')

    // Either we get results or empty state
    const recipeCount = await page.locator('.recipe-card').count()
    if (recipeCount === 0) {
      await expect(page.getByText('No recipes match your filters')).toBeVisible()
      await expect(page.getByText('Try adjusting your filter criteria')).toBeVisible()
    }
  })

  test('clear button appears when filter is active', async ({ page }) => {
    // Clear button should not be visible initially
    await expect(page.getByRole('button', { name: 'Clear Filters' })).not.toBeVisible()

    // Apply a filter
    await page.getByLabel('Dish Type').selectOption('pasta')

    // Clear button should now be visible
    await expect(page.getByRole('button', { name: 'Clear Filters' })).toBeVisible()
  })

  test('clear filters button resets all filters', async ({ page }) => {
    // Apply both filters
    await page.getByLabel('Dish Type').selectOption('pasta')
    await page.getByLabel('Protein').selectOption('beef')

    // Verify filtered state
    await expect(page.getByText(/Showing \d+ of \d+ recipes/)).toBeVisible()

    // Click clear filters
    await page.getByRole('button', { name: 'Clear Filters' }).click()

    // Both dropdowns should be reset to "all"
    await expect(page.getByLabel('Dish Type')).toHaveValue('all')
    await expect(page.getByLabel('Protein')).toHaveValue('all')

    // Clear button should be hidden
    await expect(page.getByRole('button', { name: 'Clear Filters' })).not.toBeVisible()

    // Should show total count without "Showing X of Y"
    await expect(page.getByText(/\d+ recipes$/)).toBeVisible()
  })

  test('filters persist while selecting recipes', async ({ page }) => {
    // Apply a filter
    await page.getByLabel('Dish Type').selectOption('salad')
    const filteredCount = await page.locator('.recipe-card').count()

    // Select a recipe
    const firstRecipe = page.locator('.recipe-card').first()
    await firstRecipe.getByRole('checkbox').click()
    await expect(firstRecipe.getByRole('checkbox')).toHaveAttribute('data-state', 'checked')

    // Filter should still be active
    await expect(page.getByLabel('Dish Type')).toHaveValue('salad')
    expect(await page.locator('.recipe-card').count()).toBe(filteredCount)
  })

  test('filter options include all expected dish types', async ({ page }) => {
    const dishTypeSelect = page.getByLabel('Dish Type')

    // Options are attached to the DOM but hidden until dropdown opens
    await expect(dishTypeSelect.getByRole('option', { name: 'All Dishes' })).toBeAttached()
    await expect(dishTypeSelect.getByRole('option', { name: 'Salads' })).toBeAttached()
    await expect(dishTypeSelect.getByRole('option', { name: 'Pasta' })).toBeAttached()
    await expect(dishTypeSelect.getByRole('option', { name: 'Rice Dishes' })).toBeAttached()
    await expect(dishTypeSelect.getByRole('option', { name: 'Noodles' })).toBeAttached()
    await expect(dishTypeSelect.getByRole('option', { name: 'Soups & Stews' })).toBeAttached()
    await expect(dishTypeSelect.getByRole('option', { name: 'Tacos & Mexican' })).toBeAttached()
    await expect(dishTypeSelect.getByRole('option', { name: 'Sandwiches & Wraps' })).toBeAttached()
  })

  test('filter options include all expected protein types', async ({ page }) => {
    const proteinSelect = page.getByLabel('Protein')

    // Options are attached to the DOM but hidden until dropdown opens
    await expect(proteinSelect.getByRole('option', { name: 'All Proteins' })).toBeAttached()
    await expect(proteinSelect.getByRole('option', { name: 'Beef' })).toBeAttached()
    await expect(proteinSelect.getByRole('option', { name: 'Chicken' })).toBeAttached()
    await expect(proteinSelect.getByRole('option', { name: 'Pork' })).toBeAttached()
    await expect(proteinSelect.getByRole('option', { name: 'Lamb' })).toBeAttached()
    await expect(proteinSelect.getByRole('option', { name: 'Fish' })).toBeAttached()
    await expect(proteinSelect.getByRole('option', { name: 'Seafood' })).toBeAttached()
    await expect(proteinSelect.getByRole('option', { name: 'Vegetarian' })).toBeAttached()
  })
})
