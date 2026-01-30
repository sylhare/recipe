import type { DishType, ProteinType } from '../../utils/recipeFilters'
import { DISH_TYPE_LABELS, PROTEIN_TYPE_LABELS } from '../../utils/recipeFilters'
import './RecipeFilters.css'

interface RecipeFiltersProps {
  dishTypeFilter: DishType | 'all'
  proteinTypeFilter: ProteinType | 'all'
  onDishTypeChange: (value: DishType | 'all') => void
  onProteinTypeChange: (value: ProteinType | 'all') => void
  resultCount: number
  totalCount: number
}

export function RecipeFilters({
  dishTypeFilter,
  proteinTypeFilter,
  onDishTypeChange,
  onProteinTypeChange,
  resultCount,
  totalCount,
}: RecipeFiltersProps) {
  const dishTypes = Object.keys(DISH_TYPE_LABELS) as DishType[]
  const proteinTypes = Object.keys(PROTEIN_TYPE_LABELS) as ProteinType[]

  const hasActiveFilters = dishTypeFilter !== 'all' || proteinTypeFilter !== 'all'

  const handleClearFilters = () => {
    onDishTypeChange('all')
    onProteinTypeChange('all')
  }

  return (
    <div className="recipe-filters">
      <div className="recipe-filters__controls">
        <div className="recipe-filters__group">
          <label htmlFor="dish-type-filter" className="recipe-filters__label">
            Dish Type
          </label>
          <select
            id="dish-type-filter"
            className="recipe-filters__select"
            value={dishTypeFilter}
            onChange={e => onDishTypeChange(e.target.value as DishType | 'all')}
          >
            <option value="all">All Dishes</option>
            {dishTypes.map(type => (
              <option key={type} value={type}>
                {DISH_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        <div className="recipe-filters__group">
          <label htmlFor="protein-type-filter" className="recipe-filters__label">
            Protein
          </label>
          <select
            id="protein-type-filter"
            className="recipe-filters__select"
            value={proteinTypeFilter}
            onChange={e => onProteinTypeChange(e.target.value as ProteinType | 'all')}
          >
            <option value="all">All Proteins</option>
            {proteinTypes.map(type => (
              <option key={type} value={type}>
                {PROTEIN_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            className="recipe-filters__clear"
            onClick={handleClearFilters}
            type="button"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="recipe-filters__results">
        {hasActiveFilters ? (
          <span>Showing {resultCount} of {totalCount} recipes</span>
        ) : (
          <span>{totalCount} recipes</span>
        )}
      </div>
    </div>
  )
}
