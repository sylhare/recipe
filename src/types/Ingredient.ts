export type Unit = 'g' | 'kg' | 'ml' | 'cup' | 'tbsp' | 'tsp' | 'piece'

export type IngredientCategory = 'produce' | 'meat' | 'dairy' | 'pantry' | 'spices'

export interface Ingredient {
  id: string
  name: string
  quantity: number
  unit: Unit
  category: IngredientCategory
}
