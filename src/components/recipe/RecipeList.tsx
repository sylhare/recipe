import type { Recipe } from '../../types'
import { useRecipeContext } from '../../context/RecipeContext'
import { RecipeCard } from './RecipeCard'
import './RecipeList.css'

interface RecipeListProps {
  recipes?: Recipe[]
}

export function RecipeList({ recipes: filteredRecipes }: RecipeListProps) {
  const {
    recipes: allRecipes,
    selectRecipe,
    deselectRecipe,
    updateServings,
    isSelected,
    getServings,
  } = useRecipeContext()

  const recipes = filteredRecipes ?? allRecipes

  return (
    <div className="recipe-list">
      {recipes.length === 0 ? (
        <div className="recipe-list__empty">
          <p>No recipes match your filters.</p>
          <p>Try adjusting your filter criteria.</p>
        </div>
      ) : (
        recipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isSelected={isSelected(recipe.id)}
            servings={getServings(recipe.id)}
            onSelect={() => selectRecipe(recipe.id)}
            onDeselect={() => deselectRecipe(recipe.id)}
            onServingsChange={servings => updateServings(recipe.id, servings)}
          />
        ))
      )}
    </div>
  )
}
