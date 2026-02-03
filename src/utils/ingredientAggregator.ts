import type { Recipe, RecipeSelection, ShoppingListItem, Unit, IngredientCategory } from '../types'
import { scaleQuantity } from './quantityScaler'

interface AggregationKey {
  name: string
  unit: Unit
  category: IngredientCategory
}

const UNIT_TO_ML: Record<string, number> = {
  'tsp': 5,
  'tbsp': 15,
  'cup': 240,
}

const CONVERTIBLE_UNITS = new Set(['tsp', 'tbsp', 'cup'])

export function convertToMl(quantity: number, unit: Unit): { quantity: number; unit: Unit } {
  if (CONVERTIBLE_UNITS.has(unit)) {
    const factor = UNIT_TO_ML[unit] || 1
    return { quantity: quantity * factor, unit: 'ml' }
  }
  return { quantity, unit }
}

function createAggregationKey(name: string, unit: Unit, category: IngredientCategory): string {
  const { unit: normalizedUnit } = convertToMl(1, unit)
  return `${name.toLowerCase()}|${normalizedUnit}|${category}`
}

function parseAggregationKey(key: string): AggregationKey {
  const [name, unit, category] = key.split('|')
  return { name, unit: unit as Unit, category: category as IngredientCategory }
}

export function aggregateIngredients(
  recipes: Recipe[],
  selections: RecipeSelection[]
): ShoppingListItem[] {
  const aggregated = new Map<string, {
    totalQuantity: number
    displayName: string
    unit: Unit
    category: IngredientCategory
    sourceRecipes: Set<string>
  }>()

  for (const selection of selections) {
    const recipe = recipes.find(r => r.id === selection.recipeId)
    if (!recipe) continue

    for (const ingredient of recipe.ingredients) {
      const key = createAggregationKey(ingredient.name, ingredient.unit, ingredient.category)
      const scaledQuantity = scaleQuantity(
        ingredient.quantity,
        recipe.defaultServings,
        selection.servings
      )

      const { quantity: convertedQuantity, unit: convertedUnit } = convertToMl(scaledQuantity, ingredient.unit)

      const existing = aggregated.get(key)
      if (existing) {
        existing.totalQuantity += convertedQuantity
        existing.sourceRecipes.add(recipe.id)
      } else {
        aggregated.set(key, {
          totalQuantity: convertedQuantity,
          displayName: ingredient.name,
          unit: convertedUnit,
          category: ingredient.category,
          sourceRecipes: new Set([recipe.id]),
        })
      }
    }
  }

  const items: ShoppingListItem[] = []
  let idCounter = 1

  for (const [key, value] of aggregated) {
    const { unit, category } = parseAggregationKey(key)
    items.push({
      id: `item-${idCounter++}`,
      ingredientName: value.displayName,
      totalQuantity: Math.round(value.totalQuantity * 100) / 100,
      unit,
      category,
      isChecked: false,
      sourceRecipes: Array.from(value.sourceRecipes),
    })
  }

  return items.sort((a, b) => {
    const categoryOrder: IngredientCategory[] = ['produce', 'meat', 'dairy', 'pantry', 'spices']
    const categoryDiff = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    if (categoryDiff !== 0) return categoryDiff
    return a.ingredientName.localeCompare(b.ingredientName)
  })
}

export function groupByCategory(items: ShoppingListItem[]): Map<IngredientCategory, ShoppingListItem[]> {
  const groups = new Map<IngredientCategory, ShoppingListItem[]>()

  for (const item of items) {
    const existing = groups.get(item.category)
    if (existing) {
      existing.push(item)
    } else {
      groups.set(item.category, [item])
    }
  }

  return groups
}

export function formatQuantity(quantity: number, unit: Unit): string {
  const rounded = Math.round(quantity * 100) / 100
  const displayQuantity = rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2).replace(/\.?0+$/, '')
  return `${displayQuantity} ${unit}`
}
