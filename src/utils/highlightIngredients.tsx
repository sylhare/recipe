import type { ReactNode } from 'react'
import type { Ingredient, RecipeTranslation } from '../types'

interface HighlightOptions {
  ingredients: Ingredient[]
  translation: RecipeTranslation
  formatQuantity?: (ingredient: Ingredient) => string
}

export function highlightIngredients(text: string, options: HighlightOptions): ReactNode {
  const { ingredients, translation, formatQuantity } = options
  const parts: ReactNode[] = []
  let lastIndex = 0

  const sortedIngredients = [...ingredients].sort((a, b) => {
    const nameA = translation.ingredientNames[a.id] ?? a.id
    const nameB = translation.ingredientNames[b.id] ?? b.id
    return nameB.length - nameA.length
  })

  const mentions: { start: number; end: number; ingredient: Ingredient }[] = []

  for (const ingredient of sortedIngredients) {
    const translatedName = translation.ingredientNames[ingredient.id] ?? ingredient.id
    const regex = new RegExp(`\\b${translatedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    let match
    while ((match = regex.exec(text)) !== null) {
      const overlaps = mentions.some(
        m => (match!.index >= m.start && match!.index < m.end) ||
             (match!.index + match![0].length > m.start && match!.index + match![0].length <= m.end)
      )
      if (!overlaps) {
        mentions.push({
          start: match.index,
          end: match.index + match[0].length,
          ingredient
        })
      }
    }
  }

  mentions.sort((a, b) => a.start - b.start)

  for (const mention of mentions) {
    if (mention.start > lastIndex) {
      parts.push(text.slice(lastIndex, mention.start))
    }
    parts.push(
      <strong key={`${mention.ingredient.id}-${mention.start}`} className="ingredient-highlight">
        {text.slice(mention.start, mention.end)}
        {formatQuantity && (
          <span className="ingredient-quantity">
            ({formatQuantity(mention.ingredient)})
          </span>
        )}
      </strong>
    )
    lastIndex = mention.end
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <>{parts.length > 0 ? parts : text}</>
}
