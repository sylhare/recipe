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
  const whole = Math.floor(quantity)
  const decimal = quantity - whole

  if (decimal > 0) {
    const prefix = whole > 0 ? whole.toString() : ''
    if (decimal >= 0.24 && decimal <= 0.26) return `${prefix}¼`
    if (decimal >= 0.49 && decimal <= 0.51) return `${prefix}½`
    if (decimal >= 0.74 && decimal <= 0.76) return `${prefix}¾`
    if (decimal >= 0.32 && decimal <= 0.35) return `${prefix}⅓`
    if (decimal >= 0.65 && decimal <= 0.68) return `${prefix}⅔`
  }

  if (Number.isInteger(quantity)) {
    return quantity.toString()
  }
  return (Math.round(quantity * 10) / 10).toString()
}
