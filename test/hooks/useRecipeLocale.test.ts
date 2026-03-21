import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import i18next from '../../src/i18n/index'
import { useRecipeLocale } from '../../src/hooks/useRecipeLocale'
import type { Recipe } from '../../src/types'

const mockRecipe: Recipe = {
  id: 'test-recipe',
  imageUrl: '/test.png',
  defaultServings: 4,
  ingredients: [
    { id: 'ing-1', quantity: 200, unit: 'g', category: 'pantry' },
    { id: 'ing-2', quantity: 2, unit: 'piece', category: 'produce' },
  ],
}

const mockRecipeNoLocale: Recipe = {
  id: 'no-locale-recipe',
  imageUrl: '/test.png',
  defaultServings: 2,
  ingredients: [
    { id: 'a-1', quantity: 100, unit: 'g', category: 'pantry' },
  ],
}

beforeEach(async () => {
  i18next.addResourceBundle('en', 'recipes', {
    'test-recipe': {
      name: 'Test Recipe',
      description: 'English description',
      ingredientNames: { 'ing-1': 'Flour', 'ing-2': 'Eggs' },
      instructions: { steps: ['Step 1', 'Step 2'], tips: ['Tip 1'] },
    },
  }, true, true)
  i18next.addResourceBundle('fr', 'recipes', {
    'test-recipe': {
      name: 'Recette de test',
      description: 'Description en français',
      ingredientNames: { 'ing-1': 'Farine', 'ing-2': 'Œufs' },
      instructions: { steps: ['Étape 1', 'Étape 2'], tips: ['Conseil 1'] },
    },
  }, true, true)
  await act(async () => {
    await i18next.changeLanguage('en')
  })
})

describe('useRecipeLocale', () => {
  describe('getTranslation', () => {
    it('returns EN translation when language is en', () => {
      const { result } = renderHook(() => useRecipeLocale())
      const translation = result.current.getTranslation(mockRecipe)

      expect(translation.name).toEqual('Test Recipe')
      expect(translation.description).toEqual('English description')
    })

    it('returns FR translation when language is fr', async () => {
      await act(async () => {
        await i18next.changeLanguage('fr')
      })

      const { result } = renderHook(() => useRecipeLocale())
      const translation = result.current.getTranslation(mockRecipe)

      expect(translation.name).toEqual('Recette de test')
      expect(translation.description).toEqual('Description en français')
    })

    it('falls back to EN when FR translation is missing', async () => {
      await act(async () => {
        await i18next.changeLanguage('fr')
      })

      const { result } = renderHook(() => useRecipeLocale())
      const translation = result.current.getTranslation(mockRecipeNoLocale)

      expect(translation.name).toEqual('no-locale-recipe')
    })

    it('falls back to recipe id when recipe has no locale entry', () => {
      const { result } = renderHook(() => useRecipeLocale())
      const translation = result.current.getTranslation(mockRecipeNoLocale)

      expect(translation.name).toEqual('no-locale-recipe')
      expect(translation.description).toEqual('')
      expect(translation.instructions.steps).toEqual([])
    })
  })

  describe('getIngredientName', () => {
    it('returns translated ingredient name in EN', () => {
      const { result } = renderHook(() => useRecipeLocale())

      expect(result.current.getIngredientName(mockRecipe, 'ing-1')).toEqual('Flour')
      expect(result.current.getIngredientName(mockRecipe, 'ing-2')).toEqual('Eggs')
    })

    it('returns translated ingredient name in FR', async () => {
      await act(async () => {
        await i18next.changeLanguage('fr')
      })

      const { result } = renderHook(() => useRecipeLocale())

      expect(result.current.getIngredientName(mockRecipe, 'ing-1')).toEqual('Farine')
      expect(result.current.getIngredientName(mockRecipe, 'ing-2')).toEqual('Œufs')
    })

    it('falls back to ingredient id when no locale entry', () => {
      const { result } = renderHook(() => useRecipeLocale())

      expect(result.current.getIngredientName(mockRecipeNoLocale, 'a-1')).toEqual('a-1')
    })

    it('falls back to ingredient id when ingredient not found', () => {
      const { result } = renderHook(() => useRecipeLocale())

      expect(result.current.getIngredientName(mockRecipe, 'unknown-id')).toEqual('unknown-id')
    })
  })
})
