import { useTranslation } from 'react-i18next'
import type { Recipe, RecipeTranslation } from '../types'

export function useRecipeLocale() {
  const { i18n } = useTranslation()
  const lang = i18n.language

  const getTranslation = (recipe: Recipe): RecipeTranslation => {
    if (recipe.translations) {
      const t = recipe.translations[lang] ?? recipe.translations['en']
      if (t) return t
    }
    return {
      name: recipe.name,
      description: recipe.description,
      ingredientNames: Object.fromEntries(recipe.ingredients.map(i => [i.id, i.name])),
      instructions: recipe.instructions,
    }
  }

  const getIngredientName = (recipe: Recipe, ingredientId: string): string => {
    const translation = getTranslation(recipe)
    if (translation.ingredientNames[ingredientId]) {
      return translation.ingredientNames[ingredientId]
    }
    return recipe.ingredients.find(i => i.id === ingredientId)?.name ?? ingredientId
  }

  return { getTranslation, getIngredientName }
}
