import type { Ingredient } from './Ingredient'

export interface EnhancedInstructions {
  preparation: string[]
  cooking: string[]
  serving: string[]
  tips?: string[]
}

export interface Recipe {
  id: string
  name: string
  description: string
  imageUrl: string
  defaultServings: number
  ingredients: Ingredient[]
  instructions: string[]
  enhancedInstructions?: EnhancedInstructions
}

export interface RecipeSelection {
  recipeId: string
  servings: number
}
