import { useState, useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Recipe, Ingredient } from '../../types'
import { useRecipeContext } from '../../context/RecipeContext'
import { useRecipeLocale } from '../../hooks/useRecipeLocale'
import { formatQuantity } from '../../utils'
import { ConfirmDialog, NumberInput } from '../common'
import './RecipeInstructionCard.css'

interface RecipeInstructionCardProps {
  recipe: Recipe
  servings: number
}

interface MergedIngredient extends Ingredient {
  mergedQuantity: number
}

function mergeIngredients(ingredients: Ingredient[], getName: (id: string) => string): MergedIngredient[] {
  const merged = new Map<string, MergedIngredient>()

  for (const ingredient of ingredients) {
    const key = `${getName(ingredient.id).toLowerCase()}|${ingredient.unit}`
    const existing = merged.get(key)

    if (existing) {
      existing.mergedQuantity += ingredient.quantity
    } else {
      merged.set(key, { ...ingredient, mergedQuantity: ingredient.quantity })
    }
  }

  return Array.from(merged.values())
}

export function RecipeInstructionCard({ recipe, servings }: RecipeInstructionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const { deselectRecipe, updateServings } = useRecipeContext()
  const [imageError, setImageError] = useState(false)
  const { t } = useTranslation()
  const { getTranslation } = useRecipeLocale()

  const translation = getTranslation(recipe)
  const scaleFactor = servings / recipe.defaultServings

  const mergedIngredients = useMemo(
    () => mergeIngredients(recipe.ingredients, id => translation.ingredientNames[id] ?? id),
    [recipe.ingredients, translation.ingredientNames]
  )

  const scaleQuantity = (quantity: number): string => {
    const scaled = quantity * scaleFactor
    return formatQuantity(scaled)
  }

  const highlightIngredients = (text: string): ReactNode => {
    const parts: ReactNode[] = []
    let lastIndex = 0

    // Sort ingredients by translated name length (longest first) to avoid partial matches
    const sortedIngredients = [...recipe.ingredients].sort(
      (a, b) => {
        const nameA = translation.ingredientNames[a.id] ?? a.id
        const nameB = translation.ingredientNames[b.id] ?? b.id
        return nameB.length - nameA.length
      }
    )

    // Find all ingredient mentions and their positions
    const mentions: { start: number; end: number; ingredient: typeof recipe.ingredients[0] }[] = []

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

    // Sort mentions by position
    mentions.sort((a, b) => a.start - b.start)

    // Build result with highlighted ingredients
    for (const mention of mentions) {
      if (mention.start > lastIndex) {
        parts.push(text.slice(lastIndex, mention.start))
      }
      const scaledQty = scaleQuantity(mention.ingredient.quantity)
      parts.push(
        <strong key={`${mention.ingredient.id}-${mention.start}`} className="ingredient-highlight">
          {text.slice(mention.start, mention.end)}
          <span className="ingredient-quantity">
            ({scaledQty} {mention.ingredient.unit})
          </span>
        </strong>
      )
      lastIndex = mention.end
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }

    return <>{parts.length > 0 ? parts : text}</>
  }

  const renderTips = (tips: string[]) => {
    if (!tips || tips.length === 0) return null

    return (
      <div className="instruction-tips">
        <h4 className="instruction-tips__title">
          <span className="instruction-tips__icon">💡</span>
          {t('cooking.tips')}
        </h4>
        <ul className="instruction-tips__list">
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className={`recipe-instruction-card ${isExpanded ? 'recipe-instruction-card--expanded' : ''}`}>
      <div className="recipe-instruction-card__header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="recipe-instruction-card__image-container">
          {!imageError ? (
            <img
              src={`${import.meta.env.BASE_URL}${recipe.imageUrl.replace(/^\//, '')}`}
              alt={translation.name}
              className="recipe-instruction-card__image"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="recipe-instruction-card__image-placeholder">
              🍽️
            </div>
          )}
        </div>
        <div className="recipe-instruction-card__info">
          <h3 className="recipe-instruction-card__title">{translation.name}</h3>
          <p className="recipe-instruction-card__description">{translation.description}</p>
        </div>
        <div className="recipe-instruction-card__actions" onClick={e => e.stopPropagation()}>
          <button
            className="recipe-instruction-card__expand"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <span className={`recipe-instruction-card__chevron ${isExpanded ? 'recipe-instruction-card__chevron--expanded' : ''}`}>
              ›
            </span>
          </button>
          <button
            className="recipe-instruction-card__remove"
            onClick={() => setShowRemoveConfirm(true)}
            title="Remove recipe"
          >
            ✕
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showRemoveConfirm}
        onOpenChange={setShowRemoveConfirm}
        title="Remove Recipe"
        description={`Are you sure you want to remove "${translation.name}" from your cooking list?`}
        confirmLabel="Yes, Remove"
        onConfirm={() => deselectRecipe(recipe.id)}
      />

      {isExpanded && (
        <div className="recipe-instruction-card__content">
          <div className="recipe-instruction-card__servings">
            <NumberInput
              id={`servings-${recipe.id}`}
              label={t('cooking.servings')}
              value={servings}
              onChange={v => updateServings(recipe.id, v)}
              min={1}
              max={20}
            />
          </div>

          <div className="recipe-instruction-card__ingredients">
            <h4>{t('cooking.ingredients')}</h4>
            <ul className="ingredients-list">
              {mergedIngredients.map(ingredient => (
                <li key={ingredient.id} className="ingredients-list__item">
                  <span className="ingredients-list__quantity">
                    {scaleQuantity(ingredient.mergedQuantity)} {ingredient.unit}
                  </span>
                  <span className="ingredients-list__name">{translation.ingredientNames[ingredient.id] ?? ingredient.id}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="recipe-instruction-card__instructions">
            <ol className="instruction-phase__steps">
              {translation.instructions.steps.map((step, index) => (
                <li key={index} className="instruction-step">
                  {highlightIngredients(step)}
                </li>
              ))}
            </ol>
            {renderTips(translation.instructions.tips || [])}
          </div>
        </div>
      )}
    </div>
  )
}
