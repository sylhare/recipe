import { describe, it, expect } from 'vitest'
import { scaleQuantity, scaleIngredients, formatQuantity } from '../../src/utils/quantityScaler'
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

  describe('formatQuantity', () => {
    describe('exact fractions', () => {
      it('converts 0.25 to ¼', () => {
        expect(formatQuantity(0.25)).toBe('¼')
      })

      it('converts 0.5 to ½', () => {
        expect(formatQuantity(0.5)).toBe('½')
      })

      it('converts 0.75 to ¾', () => {
        expect(formatQuantity(0.75)).toBe('¾')
      })

      it('converts 0.33 to ⅓', () => {
        expect(formatQuantity(0.33)).toBe('⅓')
      })

      it('converts 0.34 to ⅓', () => {
        expect(formatQuantity(0.34)).toBe('⅓')
      })

      it('converts 0.67 to ⅔', () => {
        expect(formatQuantity(0.67)).toBe('⅔')
      })

      it('converts 0.66 to ⅔', () => {
        expect(formatQuantity(0.66)).toBe('⅔')
      })
    })

    describe('mixed numbers', () => {
      it('converts 1.25 to 1¼', () => {
        expect(formatQuantity(1.25)).toBe('1¼')
      })

      it('converts 1.5 to 1½', () => {
        expect(formatQuantity(1.5)).toBe('1½')
      })

      it('converts 2.75 to 2¾', () => {
        expect(formatQuantity(2.75)).toBe('2¾')
      })

      it('converts 1.33 to 1⅓', () => {
        expect(formatQuantity(1.33)).toBe('1⅓')
      })

      it('converts 2.67 to 2⅔', () => {
        expect(formatQuantity(2.67)).toBe('2⅔')
      })
    })

    describe('tolerance ranges', () => {
      it('converts 1.24 to 1¼ (within tolerance)', () => {
        expect(formatQuantity(1.24)).toBe('1¼')
      })

      it('converts 1.26 to 1¼ (within tolerance)', () => {
        expect(formatQuantity(1.26)).toBe('1¼')
      })

      it('converts 1.49 to 1½ (within tolerance)', () => {
        expect(formatQuantity(1.49)).toBe('1½')
      })

      it('converts 1.51 to 1½ (within tolerance)', () => {
        expect(formatQuantity(1.51)).toBe('1½')
      })

      it('converts 1.74 to 1¾ (within tolerance)', () => {
        expect(formatQuantity(1.74)).toBe('1¾')
      })

      it('converts 1.76 to 1¾ (within tolerance)', () => {
        expect(formatQuantity(1.76)).toBe('1¾')
      })
    })

    describe('whole numbers', () => {
      it('returns "0" for 0', () => {
        expect(formatQuantity(0)).toBe('0')
      })

      it('returns "1" for 1', () => {
        expect(formatQuantity(1)).toBe('1')
      })

      it('returns "2" for 2', () => {
        expect(formatQuantity(2)).toBe('2')
      })

      it('returns "10" for 10', () => {
        expect(formatQuantity(10)).toBe('10')
      })
    })

    describe('decimal rounding', () => {
      it('rounds 1.23 to 1.2', () => {
        expect(formatQuantity(1.23)).toBe('1.2')
      })

      it('rounds 2.567 to 2.6', () => {
        expect(formatQuantity(2.567)).toBe('2.6')
      })

      it('rounds 3.14159 to 3.1', () => {
        expect(formatQuantity(3.14159)).toBe('3.1')
      })
    })
  })
})
