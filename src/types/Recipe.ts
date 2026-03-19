import type { Ingredient } from './Ingredient'

export interface EnhancedInstructions {
  steps: string[]
  tips?: string[]
}

export interface RecipeTranslation {
  name: string
  description: string
  ingredientNames: Record<string, string>
  instructions: EnhancedInstructions
}

export interface Recipe {
  id: string
  name: string
  description: string
  imageUrl: string
  defaultServings: number
  ingredients: Ingredient[]
  instructions: EnhancedInstructions
  translations?: Record<string, RecipeTranslation>
}

export interface RecipeSelection {
  recipeId: string
  servings: number
}
