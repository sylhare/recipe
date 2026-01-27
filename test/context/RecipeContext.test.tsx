import { describe, it, expect } from 'vitest'
import { recipeReducer } from '../../src/context/RecipeContext'
import type { Recipe, RecipeSelection } from '../../src/types'

const mockRecipe: Recipe = {
  id: 'test-recipe',
  name: 'Test Recipe',
  description: 'A test',
  imageUrl: '/test.png',
  defaultServings: 4,
  ingredients: [],
  instructions: [],
}

describe('recipeReducer', () => {
  const initialState = {
    recipes: [mockRecipe],
    selections: [] as RecipeSelection[],
  }

  describe('SELECT_RECIPE', () => {
    it('adds recipe to selections', () => {
      const result = recipeReducer(initialState, {
        type: 'SELECT_RECIPE',
        recipeId: 'test-recipe',
        servings: 4,
      })

      expect(result.selections).toHaveLength(1)
      expect(result.selections[0]).toEqual({ recipeId: 'test-recipe', servings: 4 })
    })

    it('does not add duplicate selections', () => {
      const stateWithSelection = {
        ...initialState,
        selections: [{ recipeId: 'test-recipe', servings: 4 }],
      }

      const result = recipeReducer(stateWithSelection, {
        type: 'SELECT_RECIPE',
        recipeId: 'test-recipe',
        servings: 4,
      })

      expect(result.selections).toHaveLength(1)
    })
  })

  describe('DESELECT_RECIPE', () => {
    it('removes recipe from selections', () => {
      const stateWithSelection = {
        ...initialState,
        selections: [{ recipeId: 'test-recipe', servings: 4 }],
      }

      const result = recipeReducer(stateWithSelection, {
        type: 'DESELECT_RECIPE',
        recipeId: 'test-recipe',
      })

      expect(result.selections).toHaveLength(0)
    })

    it('does nothing when recipe not selected', () => {
      const result = recipeReducer(initialState, {
        type: 'DESELECT_RECIPE',
        recipeId: 'test-recipe',
      })

      expect(result.selections).toHaveLength(0)
    })
  })

  describe('UPDATE_SERVINGS', () => {
    it('updates servings for selected recipe', () => {
      const stateWithSelection = {
        ...initialState,
        selections: [{ recipeId: 'test-recipe', servings: 4 }],
      }

      const result = recipeReducer(stateWithSelection, {
        type: 'UPDATE_SERVINGS',
        recipeId: 'test-recipe',
        servings: 8,
      })

      expect(result.selections[0].servings).toBe(8)
    })

    it('does not modify other selections', () => {
      const stateWithSelections = {
        ...initialState,
        selections: [
          { recipeId: 'test-recipe', servings: 4 },
          { recipeId: 'other-recipe', servings: 2 },
        ],
      }

      const result = recipeReducer(stateWithSelections, {
        type: 'UPDATE_SERVINGS',
        recipeId: 'test-recipe',
        servings: 8,
      })

      expect(result.selections[1].servings).toBe(2)
    })
  })

  describe('CLEAR_ALL', () => {
    it('removes all selections', () => {
      const stateWithSelections = {
        ...initialState,
        selections: [
          { recipeId: 'recipe-1', servings: 4 },
          { recipeId: 'recipe-2', servings: 2 },
        ],
      }

      const result = recipeReducer(stateWithSelections, { type: 'CLEAR_ALL' })

      expect(result.selections).toHaveLength(0)
    })
  })

  describe('LOAD_SELECTIONS', () => {
    it('loads selections from storage', () => {
      const selections = [{ recipeId: 'loaded-recipe', servings: 6 }]

      const result = recipeReducer(initialState, {
        type: 'LOAD_SELECTIONS',
        selections,
      })

      expect(result.selections).toEqual(selections)
    })
  })
})
