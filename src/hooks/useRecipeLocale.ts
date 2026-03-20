import { useTranslation } from 'react-i18next'
import type { Recipe, RecipeTranslation } from '../types'

export function useRecipeLocale() {
  const { i18n } = useTranslation('recipes')

  const getTranslation = (recipe: Recipe): RecipeTranslation => {
    const bundle: Record<string, RecipeTranslation> =
      i18n.getResourceBundle(i18n.language, 'recipes') ??
      i18n.getResourceBundle('en', 'recipes') ??
      {}

    return bundle[recipe.id] ?? {
      name: recipe.id,
      description: '',
      ingredientNames: Object.fromEntries(recipe.ingredients.map(i => [i.id, i.id])),
      instructions: { steps: [] },
    }
  }

  const getIngredientName = (recipe: Recipe, ingredientId: string): string => {
    const translation = getTranslation(recipe)
    return translation.ingredientNames[ingredientId] ?? ingredientId
  }

  return { getTranslation, getIngredientName }
}
