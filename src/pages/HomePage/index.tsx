import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RecipeList, RecipeFilters } from '../../components/recipe'
import { useRecipeContext } from '../../context/RecipeContext'
import { filterRecipes, searchRecipes, type DishType, type ProteinType } from '../../utils/recipeFilters'
import './index.css'

export default function HomePage() {
  const { recipes } = useRecipeContext()
  const { t } = useTranslation()
  const [dishTypeFilter, setDishTypeFilter] = useState<DishType | 'all'>('all')
  const [proteinTypeFilter, setProteinTypeFilter] = useState<ProteinType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRecipes = filterRecipes(recipes, dishTypeFilter, proteinTypeFilter)
  const displayedRecipes = searchRecipes(filteredRecipes, searchQuery)

  return (
    <div className="home-page">
      <div className="home-page__header">
        <h1>{t('home.title')}</h1>
        <p>{t('home.subtitle')}</p>
      </div>
      <RecipeFilters
        dishTypeFilter={dishTypeFilter}
        proteinTypeFilter={proteinTypeFilter}
        onDishTypeChange={setDishTypeFilter}
        onProteinTypeChange={setProteinTypeFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={displayedRecipes.length}
        totalCount={recipes.length}
      />
      <RecipeList recipes={displayedRecipes} />
    </div>
  )
}
