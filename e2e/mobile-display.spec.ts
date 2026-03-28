import { test, expect } from '@playwright/test'

const MOBILE_VIEWPORT = { width: 390, height: 844 }
const DESKTOP_VIEWPORT = { width: 1024, height: 768 }

test.describe('Mobile Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test.describe('language switcher placement', () => {
    test('header lang switcher is hidden on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)

      const headerSwitcher = page.locator('.header__lang-switcher')
      await expect(headerSwitcher).toBeHidden()
    })

    test('footer lang switcher is visible on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)

      const footerSwitcher = page.locator('.footer__lang-switcher')
      await expect(footerSwitcher).toBeVisible()
    })

    test('footer lang switcher is hidden on desktop', async ({ page }) => {
      await page.setViewportSize(DESKTOP_VIEWPORT)

      const footer = page.locator('.footer')
      await expect(footer).toBeHidden()
    })

    test('header lang switcher is visible on desktop', async ({ page }) => {
      await page.setViewportSize(DESKTOP_VIEWPORT)

      const headerSwitcher = page.locator('.header__lang-switcher')
      await expect(headerSwitcher).toBeVisible()
    })
  })

  test.describe('footer lang switcher functionality on mobile', () => {
    test('footer switches language to French', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)

      await page.getByRole('button', { name: 'Switch to FR' }).click()

      await expect(page.getByRole('link', { name: 'Recettes' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Choisissez vos recettes' })).toBeVisible()
    })

    test('footer switches language back to English', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)

      await page.getByRole('button', { name: 'Switch to FR' }).click()
      await page.getByRole('button', { name: 'Switch to EN' }).click()

      await expect(page.getByRole('link', { name: 'Recipes', exact: true })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Choose Your Recipes' })).toBeVisible()
    })

    test('language switched in footer persists after reload', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)

      await page.getByRole('button', { name: 'Switch to FR' }).click()
      await page.reload()

      await expect(page.getByRole('link', { name: 'Recettes' })).toBeVisible()
    })
  })

  test.describe('nav is usable on mobile', () => {
    test('nav links are visible on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)

      await expect(page.getByRole('link', { name: 'Recipes', exact: true })).toBeVisible()
      await expect(page.getByRole('link', { name: /Cooking/ })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Shopping List' })).toBeVisible()
    })
  })
})
