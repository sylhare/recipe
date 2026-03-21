import { describe, it, expect } from 'vitest'
import { getDishType, getProteinType, filterRecipes, searchRecipes } from '../../src/utils/recipeFilters'
import type { Recipe, RecipeTranslation } from '../../src/types'

const createMockRecipe = (id: string, ingredientIds: string[] = []): Recipe => ({
  id,
  imageUrl: '/test.png',
  defaultServings: 4,
  ingredients: ingredientIds.map((ingId, i) => ({
    id: `${id}-ing-${i}`,
    quantity: 1,
    unit: 'piece' as const,
    category: 'pantry' as const,
  })),
})

const t = (name: string, description: string, ingredientNames: string[] = [], ingredientIds: string[] = []): RecipeTranslation => ({
  name,
  description,
  ingredientNames: Object.fromEntries(ingredientIds.map((id, i) => [id, ingredientNames[i] ?? ''])),
  instructions: { steps: [] },
})

describe('recipeFilters', () => {
  describe('getDishType', () => {
    it('returns salad for salad recipes', () => {
      const recipe = createMockRecipe('1')
      expect(getDishType(recipe, t('Greek Salad', 'A fresh Mediterranean salad'))).toEqual('salad')
    })

    it('returns pasta for pasta recipes', () => {
      const recipe = createMockRecipe('2')
      expect(getDishType(recipe, t('Spaghetti Bolognese', 'Classic Italian pasta dish'))).toEqual('pasta')
    })

    it('returns pasta for mac and cheese', () => {
      const recipe = createMockRecipe('3')
      expect(getDishType(recipe, t('Mac and Cheese', 'Creamy cheese pasta'))).toEqual('pasta')
    })

    it('returns rice for rice dishes', () => {
      const recipe = createMockRecipe('4')
      expect(getDishType(recipe, t('Chicken Fried Rice', 'Asian-style rice dish'))).toEqual('rice')
    })

    it('returns rice for risotto', () => {
      const recipe = createMockRecipe('5')
      expect(getDishType(recipe, t('Mushroom Risotto', 'Creamy Italian rice dish'))).toEqual('rice')
    })

    it('returns noodles for udon dishes', () => {
      const recipe = createMockRecipe('6')
      expect(getDishType(recipe, t('Beef Udon', 'Japanese udon noodle soup'))).toEqual('noodles')
    })

    it('returns noodles for stroganoff', () => {
      const recipe = createMockRecipe('7')
      expect(getDishType(recipe, t('Beef Stroganoff', 'Creamy beef over noodles'))).toEqual('noodles')
    })

    it('returns soup for soup dishes', () => {
      const recipe = createMockRecipe('8')
      expect(getDishType(recipe, t('Chicken Soup', 'Comforting chicken soup'))).toEqual('soup')
    })

    it('returns soup for stew dishes', () => {
      const recipe = createMockRecipe('9')
      expect(getDishType(recipe, t('Beef Stew', 'Hearty beef stew'))).toEqual('soup')
    })

    it('returns tacos for taco dishes', () => {
      const recipe = createMockRecipe('10')
      expect(getDishType(recipe, t('Chicken Tacos', 'Mexican-style tacos'))).toEqual('tacos')
    })

    it('returns tacos for quesadilla dishes', () => {
      const recipe = createMockRecipe('11')
      expect(getDishType(recipe, t('Cheese Quesadilla', 'Crispy quesadilla'))).toEqual('tacos')
    })

    it('returns sandwich for burger dishes', () => {
      const recipe = createMockRecipe('12')
      expect(getDishType(recipe, t('Classic Burger', 'Juicy beef burger'))).toEqual('sandwich')
    })

    it('returns sandwich for wrap dishes', () => {
      const recipe = createMockRecipe('13')
      expect(getDishType(recipe, t('Chicken Wrap', 'Grilled chicken wrap'))).toEqual('sandwich')
    })

    it('returns bowl for bowl dishes', () => {
      const recipe = createMockRecipe('14')
      expect(getDishType(recipe, t('Buddha Bowl', 'Healthy grain bowl'))).toEqual('bowl')
    })

    it('returns other for unmatched dishes', () => {
      const recipe = createMockRecipe('15')
      expect(getDishType(recipe, t('Roasted Chicken', 'Herb-roasted whole chicken'))).toEqual('other')
    })
  })

  describe('getProteinType', () => {
    it('returns beef for beef recipes', () => {
      const ids = ['1-ing-0']
      const recipe = createMockRecipe('1', ids)
      expect(getProteinType(recipe, t('Beef Stir Fry', 'Quick beef dish', ['Beef strips'], ids))).toEqual('beef')
    })

    it('returns beef for steak recipes', () => {
      const ids = ['2-ing-0']
      const recipe = createMockRecipe('2', ids)
      expect(getProteinType(recipe, t('Grilled Steak', 'Perfect steak', ['Sirloin steak'], ids))).toEqual('beef')
    })

    it('returns chicken for chicken recipes', () => {
      const ids = ['3-ing-0']
      const recipe = createMockRecipe('3', ids)
      expect(getProteinType(recipe, t('Chicken Parmesan', 'Italian chicken', ['Chicken breast'], ids))).toEqual('chicken')
    })

    it('returns pork for pork recipes', () => {
      const ids = ['4-ing-0']
      const recipe = createMockRecipe('4', ids)
      expect(getProteinType(recipe, t('Pork Chops', 'Pan-seared pork', ['Pork chop'], ids))).toEqual('pork')
    })

    it('returns lamb for lamb recipes', () => {
      const ids = ['5-ing-0']
      const recipe = createMockRecipe('5', ids)
      expect(getProteinType(recipe, t('Lamb Curry', 'Spiced lamb dish', ['Lamb shoulder'], ids))).toEqual('lamb')
    })

    it('returns fish for salmon recipes', () => {
      const ids = ['6-ing-0']
      const recipe = createMockRecipe('6', ids)
      expect(getProteinType(recipe, t('Grilled Salmon', 'Healthy fish', ['Salmon fillet'], ids))).toEqual('fish')
    })

    it('returns seafood for shrimp recipes', () => {
      const ids = ['7-ing-0']
      const recipe = createMockRecipe('7', ids)
      expect(getProteinType(recipe, t('Shrimp Scampi', 'Garlic shrimp', ['Shrimp'], ids))).toEqual('seafood')
    })

    it('returns vegetarian for tofu recipes', () => {
      const ids = ['8-ing-0']
      const recipe = createMockRecipe('8', ids)
      expect(getProteinType(recipe, t('Tofu Stir Fry', 'Crispy tofu', ['Firm tofu'], ids))).toEqual('vegetarian')
    })

    it('returns vegetarian when no protein found', () => {
      const ids = ['9-ing-0', '9-ing-1']
      const recipe = createMockRecipe('9', ids)
      expect(getProteinType(recipe, t('Garden Vegetables', 'Fresh veggies', ['Carrots', 'Broccoli'], ids))).toEqual('vegetarian')
    })

    it('detects protein from ingredients when not in name/description', () => {
      const ids = ['10-ing-0', '10-ing-1']
      const recipe = createMockRecipe('10', ids)
      expect(getProteinType(recipe, t('Stir Fry', 'Quick Asian dish', ['Chicken breast', 'Vegetables'], ids))).toEqual('chicken')
    })
  })

  describe('filterRecipes', () => {
    const recipes: Recipe[] = [
      createMockRecipe('1'),
      createMockRecipe('2'),
      createMockRecipe('3'),
      createMockRecipe('4'),
      createMockRecipe('5'),
    ]
    const translations: Record<string, RecipeTranslation> = {
      '1': t('Beef Tacos', 'Mexican beef tacos', ['Ground beef'], ['1-ing-0']),
      '2': t('Chicken Salad', 'Fresh chicken salad', ['Chicken breast'], ['2-ing-0']),
      '3': t('Spaghetti Bolognese', 'Italian pasta with beef', ['Ground beef'], ['3-ing-0']),
      '4': t('Vegetable Stir Fry', 'Healthy veggie dish', ['Tofu', 'Vegetables'], ['4-ing-0', '4-ing-1']),
      '5': t('Salmon Rice Bowl', 'Japanese-inspired bowl', ['Salmon fillet', 'Rice'], ['5-ing-0', '5-ing-1']),
    }

    it('returns all recipes when both filters are "all"', () => {
      expect(filterRecipes(recipes, 'all', 'all', translations)).toHaveLength(5)
    })

    it('filters by dish type only', () => {
      const result = filterRecipes(recipes, 'tacos', 'all', translations)
      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual('1')
    })

    it('filters by protein type only', () => {
      const result = filterRecipes(recipes, 'all', 'beef', translations)
      expect(result).toHaveLength(2)
      expect(result.map(r => r.id)).toContain('1')
      expect(result.map(r => r.id)).toContain('3')
    })

    it('filters by both dish type and protein type', () => {
      const result = filterRecipes(recipes, 'pasta', 'beef', translations)
      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual('3')
    })

    it('returns empty array when no recipes match', () => {
      expect(filterRecipes(recipes, 'soup', 'lamb', translations)).toHaveLength(0)
    })

    it('filters salads correctly', () => {
      const result = filterRecipes(recipes, 'salad', 'all', translations)
      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual('2')
    })

    it('filters vegetarian correctly', () => {
      const result = filterRecipes(recipes, 'all', 'vegetarian', translations)
      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual('4')
    })

    it('filters fish correctly', () => {
      const result = filterRecipes(recipes, 'all', 'fish', translations)
      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual('5')
    })
  })

  describe('searchRecipes', () => {
    const recipes: Recipe[] = [
      createMockRecipe('1', ['1-ing-0', '1-ing-1']),
      createMockRecipe('2', ['2-ing-0', '2-ing-1', '2-ing-2']),
      createMockRecipe('3', ['3-ing-0', '3-ing-1']),
      createMockRecipe('4', ['4-ing-0', '4-ing-1']),
    ]
    const translations: Record<string, RecipeTranslation> = {
      '1': t('Garlic Pasta', 'Italian pasta dish', ['garlic', 'pasta'], ['1-ing-0', '1-ing-1']),
      '2': t('Chicken Soup', 'Comforting soup', ['chicken', 'garlic', 'onion'], ['2-ing-0', '2-ing-1', '2-ing-2']),
      '3': t('Beef Stir Fry', 'Quick Asian dish', ['beef', 'broccoli'], ['3-ing-0', '3-ing-1']),
      '4': t('Vegetable Bowl', 'Healthy bowl', ['spinach', 'tomato'], ['4-ing-0', '4-ing-1']),
    }

    it('returns all recipes for empty query', () => {
      expect(searchRecipes(recipes, '', translations)).toHaveLength(4)
    })

    it('returns all recipes for whitespace-only query', () => {
      expect(searchRecipes(recipes, '   ', translations)).toHaveLength(4)
    })

    it('matches recipe by title word', () => {
      const result = searchRecipes(recipes, 'pasta', translations)
      expect(result).toHaveLength(1)
      expect(result[0].id).toEqual('1')
    })

    it('title match comes before ingredient-only match', () => {
      const result = searchRecipes(recipes, 'garlic', translations)
      expect(result[0].id).toEqual('1')
      expect(result[1].id).toEqual('2')
    })

    it('ingredient-only matches sorted by ingredient match count', () => {
      const result = searchRecipes(recipes, 'chicken garlic', translations)
      expect(result[0].id).toEqual('2')
    })

    it('returns empty array when no matches', () => {
      expect(searchRecipes(recipes, 'xyz123', translations)).toHaveLength(0)
    })

    it('ignores short words under 2 chars', () => {
      expect(searchRecipes(recipes, 'a', translations)).toHaveLength(4)
    })

    it('is case-insensitive', () => {
      const result = searchRecipes(recipes, 'GARLIC', translations)
      expect(result.length).toBeGreaterThan(0)
      expect(result.some(r => r.id === '1')).toEqual(true)
    })

    describe('category aliases', () => {
      const categorised: Recipe[] = [
        { id: 'a', imageUrl: '', defaultServings: 2, ingredients: [{ id: 'a1', quantity: 200, unit: 'g', category: 'meat' }] },
        { id: 'b', imageUrl: '', defaultServings: 2, ingredients: [{ id: 'b1', quantity: 2, unit: 'piece', category: 'produce' }, { id: 'b2', quantity: 1, unit: 'piece', category: 'produce' }] },
        { id: 'c', imageUrl: '', defaultServings: 2, ingredients: [{ id: 'c1', quantity: 200, unit: 'g', category: 'pantry' }, { id: 'c2', quantity: 50, unit: 'g', category: 'dairy' }] },
      ]
      const catTranslations: Record<string, RecipeTranslation> = {
        'a': t('Beef Bowl', 'With meat', ['Sirloin'], ['a1']),
        'b': t('Garden Salad', 'Fresh', ['Tomato', 'Cucumber'], ['b1', 'b2']),
        'c': t('Pasta Bake', 'Italian', ['Pasta', 'Parmesan'], ['c1', 'c2']),
      }

      it('"meat" matches recipes with meat-category ingredients', () => {
        const result = searchRecipes(categorised, 'meat', catTranslations)
        expect(result.some(r => r.id === 'a')).toEqual(true)
        expect(result.some(r => r.id === 'b')).toEqual(false)
      })

      it('"protein" matches recipes with meat-category ingredients', () => {
        const result = searchRecipes(categorised, 'protein', catTranslations)
        expect(result.some(r => r.id === 'a')).toEqual(true)
      })

      it('"veggies" matches recipes with produce-category ingredients', () => {
        const result = searchRecipes(categorised, 'veggies', catTranslations)
        expect(result.some(r => r.id === 'b')).toEqual(true)
        expect(result.some(r => r.id === 'a')).toEqual(false)
      })

      it('"vegetables" matches recipes with produce-category ingredients', () => {
        const result = searchRecipes(categorised, 'vegetables', catTranslations)
        expect(result.some(r => r.id === 'b')).toEqual(true)
      })

      it('"dairy" matches recipes with dairy-category ingredients', () => {
        const result = searchRecipes(categorised, 'dairy', catTranslations)
        expect(result.some(r => r.id === 'c')).toEqual(true)
        expect(result.some(r => r.id === 'b')).toEqual(false)
      })
    })
  })
})
