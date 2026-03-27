import { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { Recipe } from '../../types'
import { useRecipeLocale } from '../../hooks/useRecipeLocale'
import { formatQuantity } from '../../utils'
import { TipsBlock } from '../cooking/TipsBlock'
import '../cooking/RecipeInstructionCard.css'
import './RecipeDetailModal.css'

interface RecipeDetailModalProps {
  recipe: Recipe
  onClose: () => void
}

export function RecipeDetailModal({ recipe, onClose }: RecipeDetailModalProps) {
  const { t } = useTranslation()
  const { getTranslation } = useRecipeLocale()
  const translation = getTranslation(recipe)
  const titleId = useId()
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="recipe-detail-modal-overlay" onClick={handleOverlayClick}>
      <div className="recipe-detail-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="recipe-detail-modal__header">
          <h2 id={titleId} className="recipe-detail-modal__title">{translation.name}</h2>
          <button className="recipe-detail-modal__close" onClick={onClose} aria-label={t('common.close')}>✕</button>
        </div>
        <div className="recipe-detail-modal__body">
          <section className="recipe-detail-modal__section">
            <h3 className="recipe-detail-modal__section-title">{t('cooking.ingredients')}</h3>
            <ul className="ingredients-list">
              {recipe.ingredients.map(ingredient => (
                <li key={ingredient.id} className="ingredients-list__item">
                  <span className="ingredients-list__quantity">
                    {formatQuantity(ingredient.quantity)} {ingredient.unit}
                  </span>
                  <span className="ingredients-list__name">
                    {translation.ingredientNames[ingredient.id] ?? ingredient.id}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="recipe-detail-modal__section">
            <h3 className="recipe-detail-modal__section-title">{t('cooking.instructions')}</h3>
            <ol className="instruction-phase__steps">
              {translation.instructions.steps.map((step, index) => (
                <li key={index} className="instruction-step">{step}</li>
              ))}
            </ol>
          </section>

          <TipsBlock tips={translation.instructions.tips} />
        </div>
      </div>
    </div>
  )
}
