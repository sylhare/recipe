import type { Ingredient } from './Ingredient'

export interface Recipe {
  id: string
  name: string
  description: string
  imageUrl: string
  defaultServings: number
  ingredients: Ingredient[]
  instructions: string[]
}

export interface RecipeSelection {
  recipeId: string
  servings: number
}
