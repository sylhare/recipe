import { describe, it, expect } from 'vitest'
import { aggregateIngredients, groupByCategory, formatQuantity } from '../../src/utils/ingredientAggregator'
import type { Recipe, RecipeSelection } from '../../src/types'

const mockRecipes: Recipe[] = [
  {
    id: 'recipe-1',
    name: 'Pasta',
    description: 'Simple pasta',
    imageUrl: '/images/pasta.png',
    defaultServings: 4,
    ingredients: [
      { id: '1', name: 'Pasta', quantity: 400, unit: 'g', category: 'pantry' },
      { id: '2', name: 'Onion', quantity: 1, unit: 'piece', category: 'produce' },
      { id: '3', name: 'Garlic', quantity: 2, unit: 'piece', category: 'produce' },
    ],
    instructions: ['Cook pasta'],
  },
  {
    id: 'recipe-2',
    name: 'Salad',
    description: 'Fresh salad',
    imageUrl: '/images/salad.png',
    defaultServings: 2,
    ingredients: [
      { id: '4', name: 'Onion', quantity: 1, unit: 'piece', category: 'produce' },
      { id: '5', name: 'Lettuce', quantity: 200, unit: 'g', category: 'produce' },
    ],
    instructions: ['Chop vegetables'],
  },
]

describe('ingredientAggregator', () => {
  describe('aggregateIngredients', () => {
    it('returns empty array when no selections', () => {
      const result = aggregateIngredients(mockRecipes, [])
      expect(result).toEqual([])
    })

    it('returns ingredients from single recipe', () => {
      const selections: RecipeSelection[] = [{ recipeId: 'recipe-1', servings: 4 }]
      const result = aggregateIngredients(mockRecipes, selections)

      expect(result).toHaveLength(3)
      expect(result.find(i => i.ingredientName === 'Pasta')?.totalQuantity).toBe(400)
    })

    it('scales ingredients based on servings', () => {
      const selections: RecipeSelection[] = [{ recipeId: 'recipe-1', servings: 8 }]
      const result = aggregateIngredients(mockRecipes, selections)

      expect(result.find(i => i.ingredientName === 'Pasta')?.totalQuantity).toBe(800)
      expect(result.find(i => i.ingredientName === 'Onion')?.totalQuantity).toBe(2)
    })

    it('aggregates same ingredients from multiple recipes', () => {
      const selections: RecipeSelection[] = [
        { recipeId: 'recipe-1', servings: 4 },
        { recipeId: 'recipe-2', servings: 2 },
      ]
      const result = aggregateIngredients(mockRecipes, selections)

      const onion = result.find(i => i.ingredientName === 'Onion')
      expect(onion?.totalQuantity).toBe(2) // 1 from each recipe
      expect(onion?.sourceRecipes).toContain('recipe-1')
      expect(onion?.sourceRecipes).toContain('recipe-2')
    })

    it('ignores non-existent recipe selections', () => {
      const selections: RecipeSelection[] = [{ recipeId: 'non-existent', servings: 4 }]
      const result = aggregateIngredients(mockRecipes, selections)
      expect(result).toEqual([])
    })

    it('sorts items by category then name', () => {
      const selections: RecipeSelection[] = [
        { recipeId: 'recipe-1', servings: 4 },
        { recipeId: 'recipe-2', servings: 2 },
      ]
      const result = aggregateIngredients(mockRecipes, selections)

      // Produce should come before pantry
      const produceIndex = result.findIndex(i => i.category === 'produce')
      const pantryIndex = result.findIndex(i => i.category === 'pantry')
      expect(produceIndex).toBeLessThan(pantryIndex)
    })

    it('sets isChecked to false for all items', () => {
      const selections: RecipeSelection[] = [{ recipeId: 'recipe-1', servings: 4 }]
      const result = aggregateIngredients(mockRecipes, selections)

      expect(result.every(item => item.isChecked === false)).toBe(true)
    })
  })

  describe('groupByCategory', () => {
    it('groups items by their category', () => {
      const selections: RecipeSelection[] = [
        { recipeId: 'recipe-1', servings: 4 },
        { recipeId: 'recipe-2', servings: 2 },
      ]
      const items = aggregateIngredients(mockRecipes, selections)
      const groups = groupByCategory(items)

      expect(groups.get('produce')).toHaveLength(3) // Onion, Garlic, Lettuce
      expect(groups.get('pantry')).toHaveLength(1) // Pasta
    })

    it('returns empty map for empty items', () => {
      const groups = groupByCategory([])
      expect(groups.size).toBe(0)
    })
  })

  describe('formatQuantity', () => {
    it('formats whole numbers without decimals', () => {
      expect(formatQuantity(100, 'g')).toBe('100 g')
    })

    it('formats decimals with up to 2 places', () => {
      expect(formatQuantity(1.5, 'cup')).toBe('1.5 cup')
    })

    it('removes trailing zeros', () => {
      expect(formatQuantity(1.50, 'tbsp')).toBe('1.5 tbsp')
    })

    it('handles pieces', () => {
      expect(formatQuantity(3, 'piece')).toBe('3 piece')
    })
  })
})
