import type { Recipe } from '../types'

export type DishType = 'salad' | 'pasta' | 'rice' | 'noodles' | 'soup' | 'tacos' | 'sandwich' | 'bowl' | 'other'
export type ProteinType = 'beef' | 'chicken' | 'pork' | 'lamb' | 'fish' | 'seafood' | 'vegetarian' | 'mixed'

const DISH_TYPE_KEYWORDS: Record<DishType, string[]> = {
  salad: ['salad'],
  pasta: ['pasta', 'spaghetti', 'fettuccine', 'linguine', 'penne', 'rigatoni', 'alfredo', 'bolognese', 'parmesan', 'mac and cheese', 'macaroni'],
  rice: ['rice', 'risotto', 'bibimbap', 'fried rice'],
  noodles: ['noodle', 'udon', 'ramen', 'pad thai', 'stroganoff'],
  soup: ['soup', 'stew', 'chowder', 'chili'],
  tacos: ['taco', 'taquito', 'quesadilla', 'fajita', 'burrito'],
  sandwich: ['sandwich', 'wrap', 'burger', 'shawarma', 'kofta', 'gyro'],
  bowl: ['bowl'],
  other: [],
}

const PROTEIN_KEYWORDS: Record<ProteinType, string[]> = {
  beef: ['beef', 'steak', 'sirloin', 'ribeye', 'flank', 'ground beef', 'bulgogi'],
  chicken: ['chicken'],
  pork: ['pork', 'bacon'],
  lamb: ['lamb'],
  fish: ['salmon', 'tuna', 'fish', 'tilapia', 'cod'],
  seafood: ['shrimp', 'prawn', 'scallop', 'crab', 'lobster'],
  vegetarian: ['tofu', 'tempeh', 'vegetable', 'vegetarian', 'vegan', 'bean', 'lentil', 'chickpea', 'eggplant'],
  mixed: [],
}

export function getDishType(recipe: Recipe): DishType {
  const searchText = `${recipe.name} ${recipe.description}`.toLowerCase()

  for (const [type, keywords] of Object.entries(DISH_TYPE_KEYWORDS)) {
    if (type === 'other') continue
    if (keywords.some(keyword => searchText.includes(keyword))) {
      return type as DishType
    }
  }

  return 'other'
}

export function getProteinType(recipe: Recipe): ProteinType {
  const nameAndDesc = `${recipe.name} ${recipe.description}`.toLowerCase()
  const ingredientNames = recipe.ingredients.map(i => i.name.toLowerCase()).join(' ')
  const searchText = `${nameAndDesc} ${ingredientNames}`

  const foundProteins: ProteinType[] = []

  for (const [type, keywords] of Object.entries(PROTEIN_KEYWORDS)) {
    if (type === 'mixed') continue
    if (keywords.some(keyword => searchText.includes(keyword))) {
      foundProteins.push(type as ProteinType)
    }
  }

  if (foundProteins.length === 0) {
    return 'vegetarian'
  }
  if (foundProteins.length === 1) {
    return foundProteins[0]
  }
  // If multiple proteins found, check if it's just beef variations or truly mixed
  const meatProteins = foundProteins.filter(p => !['vegetarian', 'seafood', 'fish'].includes(p))
  if (meatProteins.length <= 1) {
    return foundProteins[0]
  }
  return 'mixed'
}

export function filterRecipes(
  recipes: Recipe[],
  dishTypeFilter: DishType | 'all',
  proteinTypeFilter: ProteinType | 'all'
): Recipe[] {
  return recipes.filter(recipe => {
    const matchesDishType = dishTypeFilter === 'all' || getDishType(recipe) === dishTypeFilter
    const matchesProteinType = proteinTypeFilter === 'all' || getProteinType(recipe) === proteinTypeFilter
    return matchesDishType && matchesProteinType
  })
}

export const DISH_TYPE_LABELS: Record<DishType, string> = {
  salad: 'Salads',
  pasta: 'Pasta',
  rice: 'Rice Dishes',
  noodles: 'Noodles',
  soup: 'Soups & Stews',
  tacos: 'Tacos & Mexican',
  sandwich: 'Sandwiches & Wraps',
  bowl: 'Bowls',
  other: 'Other',
}

export function searchRecipes(recipes: Recipe[], query: string): Recipe[] {
  const trimmed = query.trim()
  if (!trimmed) return recipes

  const words = trimmed.toLowerCase().split(/\s+/).filter(w => w.length >= 2)
  if (words.length === 0) return recipes

  type Scored = { recipe: Recipe; titleScore: number; ingredientScore: number }

  const scored: Scored[] = recipes.map(recipe => {
    const titleLower = recipe.name.toLowerCase()

    const titleScore = words.filter(w => titleLower.includes(w)).length

    const ingredientScore = words.filter(w =>
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(w))
    ).length

    return { recipe, titleScore, ingredientScore }
  })

  const matches = scored.filter(s => s.titleScore > 0 || s.ingredientScore > 0)

  matches.sort((a, b) => {
    if (a.titleScore !== b.titleScore) return b.titleScore - a.titleScore
    return b.ingredientScore - a.ingredientScore
  })

  return matches.map(s => s.recipe)
}

export const PROTEIN_TYPE_LABELS: Record<ProteinType, string> = {
  beef: 'Beef',
  chicken: 'Chicken',
  pork: 'Pork',
  lamb: 'Lamb',
  fish: 'Fish',
  seafood: 'Seafood',
  vegetarian: 'Vegetarian',
  mixed: 'Mixed',
}
