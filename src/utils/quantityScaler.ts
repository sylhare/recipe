import type { Ingredient } from '../types'

export interface ScaledIngredient extends Ingredient {
  scaledQuantity: number
}

export function scaleQuantity(
  quantity: number,
  defaultServings: number,
  targetServings: number
): number {
  if (defaultServings <= 0) {
    throw new Error('Default servings must be greater than 0')
  }
  if (targetServings < 0) {
    throw new Error('Target servings cannot be negative')
  }

  const scaleFactor = targetServings / defaultServings
  return Math.round(quantity * scaleFactor * 100) / 100
}

export function scaleIngredients(
  ingredients: Ingredient[],
  defaultServings: number,
  targetServings: number
): ScaledIngredient[] {
  return ingredients.map(ingredient => ({
    ...ingredient,
    scaledQuantity: scaleQuantity(ingredient.quantity, defaultServings, targetServings),
  }))
}

/**
 * Formats a quantity as a human-readable string, converting common decimal
 * values to unicode fractions (½, ¼, ¾, ⅓, ⅔) for better readability.
 * Handles mixed numbers (e.g., 1.5 → "1½") and rounds other decimals to 1 place.
 */
export function formatQuantity(quantity: number): string {
  if (quantity === 0.25) return '¼'
  if (quantity === 0.5) return '½'
  if (quantity === 0.75) return '¾'
  if (quantity === 0.33 || quantity === 0.34) return '⅓'
  if (quantity === 0.67 || quantity === 0.66) return '⅔'

  const whole = Math.floor(quantity)
  const decimal = quantity - whole

  if (whole > 0 && decimal > 0) {
    if (decimal >= 0.24 && decimal <= 0.26) return `${whole}¼`
    if (decimal >= 0.49 && decimal <= 0.51) return `${whole}½`
    if (decimal >= 0.74 && decimal <= 0.76) return `${whole}¾`
    if (decimal >= 0.32 && decimal <= 0.35) return `${whole}⅓`
    if (decimal >= 0.65 && decimal <= 0.68) return `${whole}⅔`
  }

  if (Number.isInteger(quantity)) {
    return quantity.toString()
  }
  return (Math.round(quantity * 10) / 10).toString()
}
