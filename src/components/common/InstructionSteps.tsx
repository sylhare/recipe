import type { Ingredient, RecipeTranslation } from '../../types'
import { highlightIngredients } from '../../utils'

interface InstructionStepsProps {
  steps: string[]
  ingredients: Ingredient[]
  translation: RecipeTranslation
  formatQuantity?: (ingredient: Ingredient) => string
}

export function InstructionSteps({ steps, ingredients, translation, formatQuantity }: InstructionStepsProps) {
  return (
    <ol className="instruction-phase__steps">
      {steps.map((step, index) => (
        <li key={index} className="instruction-step">
          {highlightIngredients(step, { ingredients, translation, formatQuantity })}
        </li>
      ))}
    </ol>
  )
}
