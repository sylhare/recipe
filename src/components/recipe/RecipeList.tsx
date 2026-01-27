import { useRecipeContext } from '../../context/RecipeContext'
import { RecipeCard } from './RecipeCard'
import './RecipeList.css'

export function RecipeList() {
  const {
    recipes,
    selectRecipe,
    deselectRecipe,
    updateServings,
    isSelected,
    getServings,
  } = useRecipeContext()

  return (
    <div className="recipe-list">
      {recipes.map(recipe => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isSelected={isSelected(recipe.id)}
          servings={getServings(recipe.id)}
          onSelect={() => selectRecipe(recipe.id)}
          onDeselect={() => deselectRecipe(recipe.id)}
          onServingsChange={servings => updateServings(recipe.id, servings)}
        />
      ))}
    </div>
  )
}
