import type { Ingredient } from './Ingredient'

export interface EnhancedInstructions {
  steps: string[]
  tips?: string[]
}

export interface Recipe {
  id: string
  name: string
  description: string
  imageUrl: string
  defaultServings: number
  ingredients: Ingredient[]
  instructions: EnhancedInstructions
}

export interface RecipeSelection {
  recipeId: string
  servings: number
}
