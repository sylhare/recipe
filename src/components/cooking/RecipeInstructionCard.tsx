import { useState, type ReactNode } from 'react'
import type { Recipe } from '../../types'
import { useRecipeContext } from '../../context/RecipeContext'
import { NumberInput } from '../common/NumberInput'
import { formatQuantity } from '../../utils'
import './RecipeInstructionCard.css'

interface RecipeInstructionCardProps {
  recipe: Recipe
  servings: number
}

export function RecipeInstructionCard({ recipe, servings }: RecipeInstructionCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { deselectRecipe, updateServings } = useRecipeContext()
  const [imageError, setImageError] = useState(false)

  const scaleFactor = servings / recipe.defaultServings

  const scaleQuantity = (quantity: number): string => {
    const scaled = quantity * scaleFactor
    return formatQuantity(scaled)
  }

  const highlightIngredients = (text: string): ReactNode => {
    const parts: ReactNode[] = []
    let lastIndex = 0

    // Sort ingredients by name length (longest first) to avoid partial matches
    const sortedIngredients = [...recipe.ingredients].sort(
      (a, b) => b.name.length - a.name.length
    )

    // Find all ingredient mentions and their positions
    const mentions: { start: number; end: number; ingredient: typeof recipe.ingredients[0] }[] = []

    for (const ingredient of sortedIngredients) {
      const regex = new RegExp(`\\b${ingredient.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      let match
      while ((match = regex.exec(text)) !== null) {
        // Check if this position overlaps with existing mentions
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

  const renderInstructionPhase = (title: string, icon: string, steps: string[]) => {
    if (!steps || steps.length === 0) return null

    return (
      <div className="instruction-phase">
        <h4 className="instruction-phase__title">
          <span className="instruction-phase__icon">{icon}</span>
          {title}
        </h4>
        <ol className="instruction-phase__steps">
          {steps.map((step, index) => (
            <li key={index} className="instruction-step">
              {highlightIngredients(step)}
            </li>
          ))}
        </ol>
      </div>
    )
  }

  const renderTips = (tips: string[]) => {
    if (!tips || tips.length === 0) return null

    return (
      <div className="instruction-tips">
        <h4 className="instruction-tips__title">
          <span className="instruction-tips__icon">💡</span>
          Pro Tips
        </h4>
        <ul className="instruction-tips__list">
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    )
  }

  const hasEnhancedInstructions = recipe.enhancedInstructions && (
    recipe.enhancedInstructions.preparation.length > 0 ||
    recipe.enhancedInstructions.cooking.length > 0 ||
    recipe.enhancedInstructions.serving.length > 0
  )

  return (
    <div className={`recipe-instruction-card ${isExpanded ? 'recipe-instruction-card--expanded' : ''}`}>
      <div className="recipe-instruction-card__header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="recipe-instruction-card__image-container">
          {!imageError ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="recipe-instruction-card__image"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="recipe-instruction-card__image-placeholder">
              🍽️
            </div>
          )}
        </div>
        <div className="recipe-instruction-card__info">
          <h3 className="recipe-instruction-card__title">{recipe.name}</h3>
          <p className="recipe-instruction-card__description">{recipe.description}</p>
        </div>
        <div className="recipe-instruction-card__actions" onClick={e => e.stopPropagation()}>
          <div className="recipe-instruction-card__servings">
            <label>Servings:</label>
            <NumberInput
              value={servings}
              onChange={(value) => updateServings(recipe.id, value)}
              min={1}
              max={20}
            />
          </div>
          <button
            className="recipe-instruction-card__remove"
            onClick={() => deselectRecipe(recipe.id)}
            title="Remove recipe"
          >
            ✕
          </button>
        </div>
        <div className="recipe-instruction-card__toggle">
          {isExpanded ? '▼' : '▶'}
        </div>
      </div>

      {isExpanded && (
        <div className="recipe-instruction-card__content">
          <div className="recipe-instruction-card__ingredients">
            <h4>Ingredients for {servings} serving{servings !== 1 ? 's' : ''}</h4>
            <ul className="ingredients-list">
              {recipe.ingredients.map(ingredient => (
                <li key={ingredient.id} className="ingredients-list__item">
                  <span className="ingredients-list__quantity">
                    {scaleQuantity(ingredient.quantity)} {ingredient.unit}
                  </span>
                  <span className="ingredients-list__name">{ingredient.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="recipe-instruction-card__instructions">
            {hasEnhancedInstructions ? (
              <>
                {renderInstructionPhase('Preparation', '🔪', recipe.enhancedInstructions!.preparation)}
                {renderInstructionPhase('Cooking', '🍳', recipe.enhancedInstructions!.cooking)}
                {renderInstructionPhase('Serving', '🍽️', recipe.enhancedInstructions!.serving)}
                {renderTips(recipe.enhancedInstructions!.tips || [])}
              </>
            ) : (
              <div className="instruction-phase">
                <h4 className="instruction-phase__title">
                  <span className="instruction-phase__icon">📝</span>
                  Instructions
                </h4>
                <ol className="instruction-phase__steps">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="instruction-step">
                      {highlightIngredients(step)}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
