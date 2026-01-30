import { describe, it, expect } from 'vitest'
import { getDishType, getProteinType, filterRecipes } from '../../src/utils/recipeFilters'
import type { Recipe } from '../../src/types'

const createMockRecipe = (
  id: string,
  name: string,
  description: string,
  ingredientNames: string[] = []
): Recipe => ({
  id,
  name,
  description,
  imageUrl: '/test.png',
  defaultServings: 4,
  ingredients: ingredientNames.map((n, i) => ({
    id: `${id}-ing-${i}`,
    name: n,
    quantity: 1,
    unit: 'piece',
    category: 'other',
  })),
  instructions: [],
})

describe('recipeFilters', () => {
  describe('getDishType', () => {
    it('returns salad for salad recipes', () => {
      const recipe = createMockRecipe('1', 'Greek Salad', 'A fresh Mediterranean salad')
      expect(getDishType(recipe)).toBe('salad')
    })

    it('returns pasta for pasta recipes', () => {
      const recipe = createMockRecipe('2', 'Spaghetti Bolognese', 'Classic Italian pasta dish')
      expect(getDishType(recipe)).toBe('pasta')
    })

    it('returns pasta for mac and cheese', () => {
      const recipe = createMockRecipe('3', 'Mac and Cheese', 'Creamy cheese pasta')
      expect(getDishType(recipe)).toBe('pasta')
    })

    it('returns rice for rice dishes', () => {
      const recipe = createMockRecipe('4', 'Chicken Fried Rice', 'Asian-style rice dish')
      expect(getDishType(recipe)).toBe('rice')
    })

    it('returns rice for risotto', () => {
      const recipe = createMockRecipe('5', 'Mushroom Risotto', 'Creamy Italian rice dish')
      expect(getDishType(recipe)).toBe('rice')
    })

    it('returns noodles for udon dishes', () => {
      const recipe = createMockRecipe('6', 'Beef Udon', 'Japanese udon noodle soup')
      expect(getDishType(recipe)).toBe('noodles')
    })

    it('returns noodles for stroganoff', () => {
      const recipe = createMockRecipe('7', 'Beef Stroganoff', 'Creamy beef over noodles')
      expect(getDishType(recipe)).toBe('noodles')
    })

    it('returns soup for soup dishes', () => {
      const recipe = createMockRecipe('8', 'Chicken Soup', 'Comforting chicken soup')
      expect(getDishType(recipe)).toBe('soup')
    })

    it('returns soup for stew dishes', () => {
      const recipe = createMockRecipe('9', 'Beef Stew', 'Hearty beef stew')
      expect(getDishType(recipe)).toBe('soup')
    })

    it('returns tacos for taco dishes', () => {
      const recipe = createMockRecipe('10', 'Chicken Tacos', 'Mexican-style tacos')
      expect(getDishType(recipe)).toBe('tacos')
    })

    it('returns tacos for quesadilla dishes', () => {
      const recipe = createMockRecipe('11', 'Cheese Quesadilla', 'Crispy quesadilla')
      expect(getDishType(recipe)).toBe('tacos')
    })

    it('returns sandwich for burger dishes', () => {
      const recipe = createMockRecipe('12', 'Classic Burger', 'Juicy beef burger')
      expect(getDishType(recipe)).toBe('sandwich')
    })

    it('returns sandwich for wrap dishes', () => {
      const recipe = createMockRecipe('13', 'Chicken Wrap', 'Grilled chicken wrap')
      expect(getDishType(recipe)).toBe('sandwich')
    })

    it('returns bowl for bowl dishes', () => {
      const recipe = createMockRecipe('14', 'Buddha Bowl', 'Healthy grain bowl')
      expect(getDishType(recipe)).toBe('bowl')
    })

    it('returns other for unmatched dishes', () => {
      const recipe = createMockRecipe('15', 'Roasted Chicken', 'Herb-roasted whole chicken')
      expect(getDishType(recipe)).toBe('other')
    })
  })

  describe('getProteinType', () => {
    it('returns beef for beef recipes', () => {
      const recipe = createMockRecipe('1', 'Beef Stir Fry', 'Quick beef dish', ['Beef strips'])
      expect(getProteinType(recipe)).toBe('beef')
    })

    it('returns beef for steak recipes', () => {
      const recipe = createMockRecipe('2', 'Grilled Steak', 'Perfect steak', ['Sirloin steak'])
      expect(getProteinType(recipe)).toBe('beef')
    })

    it('returns chicken for chicken recipes', () => {
      const recipe = createMockRecipe('3', 'Chicken Parmesan', 'Italian chicken', ['Chicken breast'])
      expect(getProteinType(recipe)).toBe('chicken')
    })

    it('returns pork for pork recipes', () => {
      const recipe = createMockRecipe('4', 'Pork Chops', 'Pan-seared pork', ['Pork chop'])
      expect(getProteinType(recipe)).toBe('pork')
    })

    it('returns lamb for lamb recipes', () => {
      const recipe = createMockRecipe('5', 'Lamb Curry', 'Spiced lamb dish', ['Lamb shoulder'])
      expect(getProteinType(recipe)).toBe('lamb')
    })

    it('returns fish for salmon recipes', () => {
      const recipe = createMockRecipe('6', 'Grilled Salmon', 'Healthy fish', ['Salmon fillet'])
      expect(getProteinType(recipe)).toBe('fish')
    })

    it('returns seafood for shrimp recipes', () => {
      const recipe = createMockRecipe('7', 'Shrimp Scampi', 'Garlic shrimp', ['Shrimp'])
      expect(getProteinType(recipe)).toBe('seafood')
    })

    it('returns vegetarian for tofu recipes', () => {
      const recipe = createMockRecipe('8', 'Tofu Stir Fry', 'Crispy tofu', ['Firm tofu'])
      expect(getProteinType(recipe)).toBe('vegetarian')
    })

    it('returns vegetarian when no protein found', () => {
      const recipe = createMockRecipe('9', 'Garden Vegetables', 'Fresh veggies', ['Carrots', 'Broccoli'])
      expect(getProteinType(recipe)).toBe('vegetarian')
    })

    it('detects protein from ingredients when not in name/description', () => {
      const recipe = createMockRecipe('10', 'Stir Fry', 'Quick Asian dish', ['Chicken breast', 'Vegetables'])
      expect(getProteinType(recipe)).toBe('chicken')
    })
  })

  describe('filterRecipes', () => {
    const recipes: Recipe[] = [
      createMockRecipe('1', 'Beef Tacos', 'Mexican beef tacos', ['Ground beef']),
      createMockRecipe('2', 'Chicken Salad', 'Fresh chicken salad', ['Chicken breast']),
      createMockRecipe('3', 'Spaghetti Bolognese', 'Italian pasta with beef', ['Ground beef']),
      createMockRecipe('4', 'Vegetable Stir Fry', 'Healthy veggie dish', ['Tofu', 'Vegetables']),
      createMockRecipe('5', 'Salmon Rice Bowl', 'Japanese-inspired bowl', ['Salmon fillet', 'Rice']),
    ]

    it('returns all recipes when both filters are "all"', () => {
      const result = filterRecipes(recipes, 'all', 'all')
      expect(result).toHaveLength(5)
    })

    it('filters by dish type only', () => {
      const result = filterRecipes(recipes, 'tacos', 'all')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Beef Tacos')
    })

    it('filters by protein type only', () => {
      const result = filterRecipes(recipes, 'all', 'beef')
      expect(result).toHaveLength(2)
      expect(result.map(r => r.name)).toContain('Beef Tacos')
      expect(result.map(r => r.name)).toContain('Spaghetti Bolognese')
    })

    it('filters by both dish type and protein type', () => {
      const result = filterRecipes(recipes, 'pasta', 'beef')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Spaghetti Bolognese')
    })

    it('returns empty array when no recipes match', () => {
      const result = filterRecipes(recipes, 'soup', 'lamb')
      expect(result).toHaveLength(0)
    })

    it('filters salads correctly', () => {
      const result = filterRecipes(recipes, 'salad', 'all')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Chicken Salad')
    })

    it('filters vegetarian correctly', () => {
      const result = filterRecipes(recipes, 'all', 'vegetarian')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Vegetable Stir Fry')
    })

    it('filters fish correctly', () => {
      const result = filterRecipes(recipes, 'all', 'fish')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Salmon Rice Bowl')
    })
  })
})
