import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import i18next from '../../src/i18n/index'
import { useRecipeLocale } from '../../src/hooks/useRecipeLocale'
import type { Recipe } from '../../src/types'

const mockRecipeWithTranslations: Recipe = {
  id: 'test-recipe',
  name: 'Test Recipe',
  description: 'English description',
  imageUrl: '/test.png',
  defaultServings: 4,
  ingredients: [
    { id: 'ing-1', name: 'Flour', quantity: 200, unit: 'g', category: 'pantry' },
    { id: 'ing-2', name: 'Eggs', quantity: 2, unit: 'piece', category: 'produce' },
  ],
  instructions: { steps: ['Step 1', 'Step 2'], tips: ['Tip 1'] },
  translations: {
    en: {
      name: 'Test Recipe',
      description: 'English description',
      ingredientNames: { 'ing-1': 'Flour', 'ing-2': 'Eggs' },
      instructions: { steps: ['Step 1', 'Step 2'], tips: ['Tip 1'] },
    },
    fr: {
      name: 'Recette de test',
      description: 'Description en français',
      ingredientNames: { 'ing-1': 'Farine', 'ing-2': 'Œufs' },
      instructions: { steps: ['Étape 1', 'Étape 2'], tips: ['Conseil 1'] },
    },
  },
}

const mockRecipeWithoutTranslations: Recipe = {
  id: 'no-translations',
  name: 'No Translations Recipe',
  description: 'No translations here',
  imageUrl: '/test.png',
  defaultServings: 2,
  ingredients: [
    { id: 'a-1', name: 'Sugar', quantity: 100, unit: 'g', category: 'pantry' },
  ],
  instructions: { steps: ['Mix well'] },
}

describe('useRecipeLocale', () => {
  beforeEach(async () => {
    await act(async () => {
      await i18next.changeLanguage('en')
    })
  })

  describe('getTranslation', () => {
    it('returns EN translation when language is en', () => {
      const { result } = renderHook(() => useRecipeLocale())
      const translation = result.current.getTranslation(mockRecipeWithTranslations)

      expect(translation.name).toBe('Test Recipe')
      expect(translation.description).toBe('English description')
    })

    it('returns FR translation when language is fr', async () => {
      await act(async () => {
        await i18next.changeLanguage('fr')
      })

      const { result } = renderHook(() => useRecipeLocale())
      const translation = result.current.getTranslation(mockRecipeWithTranslations)

      expect(translation.name).toBe('Recette de test')
      expect(translation.description).toBe('Description en français')
    })

    it('falls back to EN when FR translation is missing', async () => {
      const recipeWithEnOnly: Recipe = {
        ...mockRecipeWithTranslations,
        translations: {
          en: mockRecipeWithTranslations.translations!['en'],
        },
      }

      await act(async () => {
        await i18next.changeLanguage('fr')
      })

      const { result } = renderHook(() => useRecipeLocale())
      const translation = result.current.getTranslation(recipeWithEnOnly)

      expect(translation.name).toBe('Test Recipe')
    })

    it('falls back to root fields when translations object is missing', () => {
      const { result } = renderHook(() => useRecipeLocale())
      const translation = result.current.getTranslation(mockRecipeWithoutTranslations)

      expect(translation.name).toBe('No Translations Recipe')
      expect(translation.description).toBe('No translations here')
      expect(translation.instructions.steps).toEqual(['Mix well'])
    })
  })

  describe('getIngredientName', () => {
    it('returns translated ingredient name in EN', () => {
      const { result } = renderHook(() => useRecipeLocale())

      expect(result.current.getIngredientName(mockRecipeWithTranslations, 'ing-1')).toBe('Flour')
      expect(result.current.getIngredientName(mockRecipeWithTranslations, 'ing-2')).toBe('Eggs')
    })

    it('returns translated ingredient name in FR', async () => {
      await act(async () => {
        await i18next.changeLanguage('fr')
      })

      const { result } = renderHook(() => useRecipeLocale())

      expect(result.current.getIngredientName(mockRecipeWithTranslations, 'ing-1')).toBe('Farine')
      expect(result.current.getIngredientName(mockRecipeWithTranslations, 'ing-2')).toBe('Œufs')
    })

    it('falls back to ingredient name from recipe when translations missing', () => {
      const { result } = renderHook(() => useRecipeLocale())

      expect(result.current.getIngredientName(mockRecipeWithoutTranslations, 'a-1')).toBe('Sugar')
    })

    it('falls back to ingredient id when ingredient not found', () => {
      const { result } = renderHook(() => useRecipeLocale())

      expect(result.current.getIngredientName(mockRecipeWithTranslations, 'unknown-id')).toBe('unknown-id')
    })
  })
})
