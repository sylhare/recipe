import { describe, it, expect } from 'vitest'
import { scaleQuantity, scaleIngredients } from '../../src/utils/quantityScaler'
import type { Ingredient } from '../../src/types'

describe('quantityScaler', () => {
  describe('scaleQuantity', () => {
    it('returns same quantity when servings are equal', () => {
      expect(scaleQuantity(100, 4, 4)).toBe(100)
    })

    it('doubles quantity when doubling servings', () => {
      expect(scaleQuantity(100, 4, 8)).toBe(200)
    })

    it('halves quantity when halving servings', () => {
      expect(scaleQuantity(100, 4, 2)).toBe(50)
    })

    it('handles fractional scaling', () => {
      expect(scaleQuantity(100, 4, 6)).toBe(150)
    })

    it('rounds to 2 decimal places', () => {
      expect(scaleQuantity(100, 3, 7)).toBe(233.33)
    })

    it('returns 0 when target servings is 0', () => {
      expect(scaleQuantity(100, 4, 0)).toBe(0)
    })

    it('throws error when default servings is 0', () => {
      expect(() => scaleQuantity(100, 0, 4)).toThrow('Default servings must be greater than 0')
    })

    it('throws error when default servings is negative', () => {
      expect(() => scaleQuantity(100, -1, 4)).toThrow('Default servings must be greater than 0')
    })

    it('throws error when target servings is negative', () => {
      expect(() => scaleQuantity(100, 4, -1)).toThrow('Target servings cannot be negative')
    })
  })

  describe('scaleIngredients', () => {
    const ingredients: Ingredient[] = [
      { id: '1', name: 'Flour', quantity: 200, unit: 'g', category: 'pantry' },
      { id: '2', name: 'Eggs', quantity: 2, unit: 'piece', category: 'dairy' },
    ]

    it('scales all ingredients proportionally', () => {
      const scaled = scaleIngredients(ingredients, 4, 8)

      expect(scaled[0].scaledQuantity).toBe(400)
      expect(scaled[1].scaledQuantity).toBe(4)
    })

    it('preserves original ingredient properties', () => {
      const scaled = scaleIngredients(ingredients, 4, 8)

      expect(scaled[0].id).toBe('1')
      expect(scaled[0].name).toBe('Flour')
      expect(scaled[0].unit).toBe('g')
      expect(scaled[0].category).toBe('pantry')
      expect(scaled[0].quantity).toBe(200) // Original unchanged
    })

    it('returns empty array for empty ingredients', () => {
      const scaled = scaleIngredients([], 4, 8)
      expect(scaled).toEqual([])
    })
  })
})
