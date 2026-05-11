import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Recipe, Ingredient } from '../../types'
import { useRecipeContext } from '../../context/RecipeContext'
import { useRecipeLocale } from '../../hooks/useRecipeLocale'
import { formatQuantity, highlightIngredients } from '../../utils'
import { ConfirmDialog, NumberInput } from '../common'
import { TipsBlock } from './TipsBlock'
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

  const highlightStep = (text: string) =>
    highlightIngredients(text, {
      ingredients: recipe.ingredients,
      translation,
      formatQuantity: (ingredient) => `${scaleQuantity(ingredient.quantity)} ${ingredient.unit}`,
    })

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
            aria-label={isExpanded ? t('cooking.collapse') : t('cooking.expand')}
          >
            <span className={`recipe-instruction-card__chevron ${isExpanded ? 'recipe-instruction-card__chevron--expanded' : ''}`}>
              ›
            </span>
          </button>
          <button
            className="recipe-instruction-card__remove"
            onClick={() => setShowRemoveConfirm(true)}
            title={t('cooking.removeRecipe')}
          >
            ✕
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showRemoveConfirm}
        onOpenChange={setShowRemoveConfirm}
        title={t('cooking.removeRecipe')}
        description={t('cooking.removeRecipeConfirm', { name: translation.name })}
        confirmLabel={t('cooking.removeConfirmLabel')}
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
                  {highlightStep(step)}
                </li>
              ))}
            </ol>
            <TipsBlock tips={translation.instructions.tips} />
          </div>
        </div>
      )}
    </div>
  )
}
