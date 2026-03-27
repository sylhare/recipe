import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { Recipe } from '../../types'
import { useRecipeLocale } from '../../hooks/useRecipeLocale'
import { formatQuantity } from '../../utils'
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="recipe-detail-modal-overlay" onClick={handleOverlayClick}>
      <div className="recipe-detail-modal" role="dialog" aria-modal="true" aria-labelledby="recipe-detail-title">
        <div className="recipe-detail-modal__header">
          <h2 id="recipe-detail-title" className="recipe-detail-modal__title">{translation.name}</h2>
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

          {(translation.instructions.tips?.length ?? 0) > 0 && (
            <div className="instruction-tips">
              <h4 className="instruction-tips__title">
                <span className="instruction-tips__icon">💡</span>
                {t('cooking.tips')}
              </h4>
              <ul className="instruction-tips__list">
                {translation.instructions.tips!.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
