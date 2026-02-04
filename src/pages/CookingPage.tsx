import { useState } from 'react'
import { useRecipeContext } from '../context/RecipeContext'
import { RecipeInstructionCard } from '../components/cooking/RecipeInstructionCard'
import { Button, ConfirmDialog } from '../components/common'
import './CookingPage.css'

export default function CookingPage() {
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const { recipes, selections, clearAll } = useRecipeContext()

  const selectedRecipes = selections
    .map(sel => {
      const recipe = recipes.find(r => r.id === sel.recipeId)
      return recipe ? { recipe, servings: sel.servings } : null
    })
    .filter((item): item is { recipe: typeof recipes[0]; servings: number } => item !== null)

  if (selectedRecipes.length === 0) {
    return (
      <div className="cooking-page">
        <div className="cooking-page__empty">
          <h2>No recipes selected</h2>
          <p>Select some recipes from the Recipes tab to see cooking instructions here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cooking-page">
      <header className="cooking-page__header">
        <div className="cooking-page__header-content">
          <h1>Cooking Instructions</h1>
          <p className="cooking-page__subtitle">
            {selectedRecipes.length} recipe{selectedRecipes.length !== 1 ? 's' : ''} selected
          </p>
        </div>
        <Button variant="danger" onClick={() => setShowClearConfirm(true)}>
          Clear All
        </Button>
      </header>
      <div className="cooking-page__list">
        {selectedRecipes.map(({ recipe, servings }) => (
          <RecipeInstructionCard
            key={recipe.id}
            recipe={recipe}
            servings={servings}
          />
        ))}
      </div>
      <ConfirmDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Clear All Recipes"
        description="Are you sure you want to remove all recipes from your cooking list?"
        confirmLabel="Yes, Clear All"
        onConfirm={clearAll}
      />
    </div>
  )
}
