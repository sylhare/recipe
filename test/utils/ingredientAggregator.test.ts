import { describe, it, expect, vi } from 'vitest'
import { aggregateIngredients, groupByCategory, formatQuantity, convertToMl } from '../../src/utils/ingredientAggregator'
import type { Recipe, RecipeSelection } from '../../src/types'

const nameResolver = (names: Record<string, string>) =>
  (_recipeId: string, ingredientId: string) => names[ingredientId] ?? ingredientId

const mockRecipes: Recipe[] = [
  {
    id: 'recipe-1',
    imageUrl: '/images/pasta.png',
    defaultServings: 4,
    ingredients: [
      { id: '1', quantity: 400, unit: 'g', category: 'pantry' },
      { id: '2', quantity: 1, unit: 'piece', category: 'produce' },
      { id: '3', quantity: 2, unit: 'piece', category: 'produce' },
    ],
  },
  {
    id: 'recipe-2',
    imageUrl: '/images/salad.png',
    defaultServings: 2,
    ingredients: [
      { id: '4', quantity: 1, unit: 'piece', category: 'produce' },
      { id: '5', quantity: 200, unit: 'g', category: 'produce' },
    ],
  },
]

const mockNames: Record<string, string> = {
  '1': 'Pasta', '2': 'Onion', '3': 'Garlic', '4': 'Onion', '5': 'Lettuce',
}

describe('ingredientAggregator', () => {
  describe('aggregateIngredients', () => {
    it('returns empty array when no selections', () => {
      const result = aggregateIngredients(mockRecipes, [], nameResolver(mockNames))
      expect(result).toEqual([])
    })

    it('returns ingredients from single recipe', () => {
      const selections: RecipeSelection[] = [{ recipeId: 'recipe-1', servings: 4 }]
      const result = aggregateIngredients(mockRecipes, selections, nameResolver(mockNames))

      expect(result).toHaveLength(3)
      expect(result.find(i => i.ingredientName === 'Pasta')?.totalQuantity).toEqual(400)
    })

    it('scales ingredients based on servings', () => {
      const selections: RecipeSelection[] = [{ recipeId: 'recipe-1', servings: 8 }]
      const result = aggregateIngredients(mockRecipes, selections, nameResolver(mockNames))

      expect(result.find(i => i.ingredientName === 'Pasta')?.totalQuantity).toEqual(800)
      expect(result.find(i => i.ingredientName === 'Onion')?.totalQuantity).toEqual(2)
    })

    it('aggregates same ingredients from multiple recipes', () => {
      const selections: RecipeSelection[] = [
        { recipeId: 'recipe-1', servings: 4 },
        { recipeId: 'recipe-2', servings: 2 },
      ]
      const result = aggregateIngredients(mockRecipes, selections, nameResolver(mockNames))

      const onion = result.find(i => i.ingredientName === 'Onion')
      expect(onion?.totalQuantity).toEqual(2)
      expect(onion?.sourceRecipes).toContain('recipe-1')
      expect(onion?.sourceRecipes).toContain('recipe-2')
    })

    it('ignores non-existent recipe selections', () => {
      const selections: RecipeSelection[] = [{ recipeId: 'non-existent', servings: 4 }]
      const result = aggregateIngredients(mockRecipes, selections, nameResolver(mockNames))
      expect(result).toEqual([])
    })

    it('sorts items by category then name', () => {
      const selections: RecipeSelection[] = [
        { recipeId: 'recipe-1', servings: 4 },
        { recipeId: 'recipe-2', servings: 2 },
      ]
      const result = aggregateIngredients(mockRecipes, selections, nameResolver(mockNames))

      const produceIndex = result.findIndex(i => i.category === 'produce')
      const pantryIndex = result.findIndex(i => i.category === 'pantry')
      expect(produceIndex).toBeLessThan(pantryIndex)
    })

    it('sets isChecked to false for all items', () => {
      const selections: RecipeSelection[] = [{ recipeId: 'recipe-1', servings: 4 }]
      const result = aggregateIngredients(mockRecipes, selections, nameResolver(mockNames))
      expect(result.every(item => item.isChecked === false)).toEqual(true)
    })

    it('uses nameResolver for display names', () => {
      const selections: RecipeSelection[] = [{ recipeId: 'recipe-1', servings: 4 }]
      const resolver = vi.fn((_recipeId: string, ingredientId: string) => {
        if (ingredientId === '1') return 'Pâtes'
        return ingredientId
      })
      const result = aggregateIngredients(mockRecipes, selections, resolver)
      expect(resolver).toHaveBeenCalled()
      expect(result.find(i => i.ingredientName === 'Pâtes')).toBeDefined()
    })
  })

  describe('groupByCategory', () => {
    it('groups items by their category', () => {
      const selections: RecipeSelection[] = [
        { recipeId: 'recipe-1', servings: 4 },
        { recipeId: 'recipe-2', servings: 2 },
      ]
      const items = aggregateIngredients(mockRecipes, selections, nameResolver(mockNames))
      const groups = groupByCategory(items)

      expect(groups.get('produce')).toHaveLength(3)
      expect(groups.get('pantry')).toHaveLength(1)
    })

    it('returns empty map for empty items', () => {
      expect(groupByCategory([])).toEqual(new Map())
    })
  })

  describe('formatQuantity', () => {
    it('formats whole numbers without decimals', () => {
      expect(formatQuantity(100, 'g')).toEqual('100 g')
    })

    it('formats decimals with up to 2 places', () => {
      expect(formatQuantity(1.5, 'cup')).toEqual('1.5 cup')
    })

    it('removes trailing zeros', () => {
      expect(formatQuantity(1.50, 'tbsp')).toEqual('1.5 tbsp')
    })

    it('handles pieces', () => {
      expect(formatQuantity(3, 'piece')).toEqual('3 piece')
    })
  })

  describe('convertToMl', () => {
    it('converts tsp to ml (1 tsp = 5ml)', () => {
      expect(convertToMl(2, 'tsp')).toEqual({ quantity: 10, unit: 'ml' })
    })

    it('converts tbsp to ml (1 tbsp = 15ml)', () => {
      expect(convertToMl(3, 'tbsp')).toEqual({ quantity: 45, unit: 'ml' })
    })

    it('converts cup to ml (1 cup = 240ml)', () => {
      expect(convertToMl(2, 'cup')).toEqual({ quantity: 480, unit: 'ml' })
    })

    it('does not convert g', () => {
      expect(convertToMl(100, 'g')).toEqual({ quantity: 100, unit: 'g' })
    })

    it('does not convert ml', () => {
      expect(convertToMl(50, 'ml')).toEqual({ quantity: 50, unit: 'ml' })
    })

    it('does not convert piece', () => {
      expect(convertToMl(3, 'piece')).toEqual({ quantity: 3, unit: 'piece' })
    })
  })

  describe('unit conversion in aggregation', () => {
    const recipesWithMixedUnits: Recipe[] = [
      {
        id: 'recipe-a',
        imageUrl: '/test.png',
        defaultServings: 4,
        ingredients: [{ id: '1', quantity: 1, unit: 'tbsp', category: 'produce' }],
      },
      {
        id: 'recipe-b',
        imageUrl: '/test.png',
        defaultServings: 4,
        ingredients: [{ id: '2', quantity: 2, unit: 'tsp', category: 'produce' }],
      },
    ]
    const gingerNames: Record<string, string> = { '1': 'Ginger', '2': 'Ginger' }

    it('converts and merges ingredients with tsp and tbsp to ml', () => {
      const selections: RecipeSelection[] = [
        { recipeId: 'recipe-a', servings: 4 },
        { recipeId: 'recipe-b', servings: 4 },
      ]
      const result = aggregateIngredients(recipesWithMixedUnits, selections, nameResolver(gingerNames))

      const ginger = result.find(i => i.ingredientName === 'Ginger')
      expect(ginger).toBeDefined()
      expect(ginger?.unit).toEqual('ml')
      expect(ginger?.totalQuantity).toEqual(25)
    })

    it('converts tbsp to ml in shopping list', () => {
      const result = aggregateIngredients(recipesWithMixedUnits, [{ recipeId: 'recipe-a', servings: 4 }], nameResolver(gingerNames))
      const ginger = result.find(i => i.ingredientName === 'Ginger')
      expect(ginger?.unit).toEqual('ml')
      expect(ginger?.totalQuantity).toEqual(15)
    })

    it('converts tsp to ml in shopping list', () => {
      const result = aggregateIngredients(recipesWithMixedUnits, [{ recipeId: 'recipe-b', servings: 4 }], nameResolver(gingerNames))
      const ginger = result.find(i => i.ingredientName === 'Ginger')
      expect(ginger?.unit).toEqual('ml')
      expect(ginger?.totalQuantity).toEqual(10)
    })
  })
})
