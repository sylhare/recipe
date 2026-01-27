import type { Unit, IngredientCategory } from './Ingredient'

export interface ShoppingListItem {
  id: string
  ingredientName: string
  totalQuantity: number
  unit: Unit
  category: IngredientCategory
  isChecked: boolean
  sourceRecipes: string[]
}
