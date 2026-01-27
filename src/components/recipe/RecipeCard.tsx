import { useState } from 'react'
import type { Recipe } from '../../types'
import { Card } from '../common/Card'
import { Checkbox } from '../common/Checkbox'
import { NumberInput } from '../common/NumberInput'
import './RecipeCard.css'

interface RecipeCardProps {
  recipe: Recipe
  isSelected: boolean
  servings?: number
  onSelect: () => void
  onDeselect: () => void
  onServingsChange: (servings: number) => void
}

export function RecipeCard({
  recipe,
  isSelected,
  servings,
  onSelect,
  onDeselect,
  onServingsChange,
}: RecipeCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleCheckChange = (checked: boolean) => {
    if (checked) {
      onSelect()
    } else {
      onDeselect()
    }
  }

  return (
    <Card selected={isSelected} className="recipe-card">
      <div className="recipe-card__image-container">
        {imageError ? (
          <div className="recipe-card__image-placeholder">
            <span>{recipe.name[0]}</span>
          </div>
        ) : (
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="recipe-card__image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="recipe-card__content">
        <h3 className="recipe-card__title">{recipe.name}</h3>
        <p className="recipe-card__description">{recipe.description}</p>
        <div className="recipe-card__footer">
          <Checkbox
            id={`recipe-${recipe.id}`}
            checked={isSelected}
            onChange={handleCheckChange}
            label="Add to shopping list"
          />
          {isSelected && servings !== undefined && (
            <NumberInput
              id={`servings-${recipe.id}`}
              value={servings}
              onChange={onServingsChange}
              label="Servings:"
              min={1}
              max={20}
            />
          )}
        </div>
      </div>
    </Card>
  )
}
