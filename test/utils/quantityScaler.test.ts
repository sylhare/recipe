import { describe, it, expect } from 'vitest'
import { scaleQuantity, scaleIngredients, formatQuantity } from '../../src/utils/quantityScaler'
import type { Ingredient } from '../../src/types'

describe('quantityScaler', () => {
  describe('scaleQuantity', () => {
    it('returns same quantity when servings are equal', () => {
      expect(scaleQuantity(100, 4, 4)).toEqual(100)
    })

    it('doubles quantity when doubling servings', () => {
      expect(scaleQuantity(100, 4, 8)).toEqual(200)
    })

    it('halves quantity when halving servings', () => {
      expect(scaleQuantity(100, 4, 2)).toEqual(50)
    })

    it('handles fractional scaling', () => {
      expect(scaleQuantity(100, 4, 6)).toEqual(150)
    })

    it('rounds to 2 decimal places', () => {
      expect(scaleQuantity(100, 3, 7)).toEqual(233.33)
    })

    it('returns 0 when target servings is 0', () => {
      expect(scaleQuantity(100, 4, 0)).toEqual(0)
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

      expect(scaled[0].scaledQuantity).toEqual(400)
      expect(scaled[1].scaledQuantity).toEqual(4)
    })

    it('preserves original ingredient properties', () => {
      const scaled = scaleIngredients(ingredients, 4, 8)

      expect(scaled[0].id).toEqual('1')
      expect(scaled[0].name).toEqual('Flour')
      expect(scaled[0].unit).toEqual('g')
      expect(scaled[0].category).toEqual('pantry')
      expect(scaled[0].quantity).toEqual(200)
    })

    it('returns empty array for empty ingredients', () => {
      const scaled = scaleIngredients([], 4, 8)
      expect(scaled).toEqual([])
    })
  })

  describe('formatQuantity', () => {
    describe('exact fractions', () => {
      it('converts 0.25 to ¼', () => {
        expect(formatQuantity(0.25)).toEqual('¼')
      })

      it('converts 0.5 to ½', () => {
        expect(formatQuantity(0.5)).toEqual('½')
      })

      it('converts 0.75 to ¾', () => {
        expect(formatQuantity(0.75)).toEqual('¾')
      })

      it('converts 0.33 to ⅓', () => {
        expect(formatQuantity(0.33)).toEqual('⅓')
      })

      it('converts 0.34 to ⅓', () => {
        expect(formatQuantity(0.34)).toEqual('⅓')
      })

      it('converts 0.67 to ⅔', () => {
        expect(formatQuantity(0.67)).toEqual('⅔')
      })

      it('converts 0.66 to ⅔', () => {
        expect(formatQuantity(0.66)).toEqual('⅔')
      })
    })

    describe('mixed numbers', () => {
      it('converts 1.25 to 1¼', () => {
        expect(formatQuantity(1.25)).toEqual('1¼')
      })

      it('converts 1.5 to 1½', () => {
        expect(formatQuantity(1.5)).toEqual('1½')
      })

      it('converts 2.75 to 2¾', () => {
        expect(formatQuantity(2.75)).toEqual('2¾')
      })

      it('converts 1.33 to 1⅓', () => {
        expect(formatQuantity(1.33)).toEqual('1⅓')
      })

      it('converts 2.67 to 2⅔', () => {
        expect(formatQuantity(2.67)).toEqual('2⅔')
      })
    })

    describe('tolerance ranges', () => {
      it('converts 1.24 to 1¼ (within tolerance)', () => {
        expect(formatQuantity(1.24)).toEqual('1¼')
      })

      it('converts 1.26 to 1¼ (within tolerance)', () => {
        expect(formatQuantity(1.26)).toEqual('1¼')
      })

      it('converts 1.49 to 1½ (within tolerance)', () => {
        expect(formatQuantity(1.49)).toEqual('1½')
      })

      it('converts 1.51 to 1½ (within tolerance)', () => {
        expect(formatQuantity(1.51)).toEqual('1½')
      })

      it('converts 1.74 to 1¾ (within tolerance)', () => {
        expect(formatQuantity(1.74)).toEqual('1¾')
      })

      it('converts 1.76 to 1¾ (within tolerance)', () => {
        expect(formatQuantity(1.76)).toEqual('1¾')
      })
    })

    describe('whole numbers', () => {
      it('returns "0" for 0', () => {
        expect(formatQuantity(0)).toEqual('0')
      })

      it('returns "1" for 1', () => {
        expect(formatQuantity(1)).toEqual('1')
      })

      it('returns "2" for 2', () => {
        expect(formatQuantity(2)).toEqual('2')
      })

      it('returns "10" for 10', () => {
        expect(formatQuantity(10)).toEqual('10')
      })
    })

    describe('decimal rounding', () => {
      it('rounds 1.23 to 1.2', () => {
        expect(formatQuantity(1.23)).toEqual('1.2')
      })

      it('rounds 2.567 to 2.6', () => {
        expect(formatQuantity(2.567)).toEqual('2.6')
      })

      it('rounds 3.14159 to 3.1', () => {
        expect(formatQuantity(3.14159)).toEqual('3.1')
      })
    })
  })
})
