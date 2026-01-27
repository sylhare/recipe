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
