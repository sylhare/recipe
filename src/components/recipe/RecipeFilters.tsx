import { useTranslation } from 'react-i18next'
import type { DishType, ProteinType } from '../../utils/recipeFilters'
import { DISH_TYPE_LABELS, PROTEIN_TYPE_LABELS } from '../../utils/recipeFilters'
import { RecipeSearch } from './RecipeSearch'
import './RecipeFilters.css'

interface RecipeFiltersProps {
  dishTypeFilter: DishType | 'all'
  proteinTypeFilter: ProteinType | 'all'
  onDishTypeChange: (value: DishType | 'all') => void
  onProteinTypeChange: (value: ProteinType | 'all') => void
  searchQuery: string
  onSearchChange: (value: string) => void
  resultCount: number
  totalCount: number
}

export function RecipeFilters({
  dishTypeFilter,
  proteinTypeFilter,
  onDishTypeChange,
  onProteinTypeChange,
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
}: RecipeFiltersProps) {
  const { t } = useTranslation()
  const dishTypes = Object.keys(DISH_TYPE_LABELS) as DishType[]
  const proteinTypes = Object.keys(PROTEIN_TYPE_LABELS) as ProteinType[]

  const hasActiveFilters = dishTypeFilter !== 'all' || proteinTypeFilter !== 'all' || searchQuery !== ''

  const handleClearFilters = () => {
    onDishTypeChange('all')
    onProteinTypeChange('all')
    onSearchChange('')
  }

  return (
    <div className="recipe-filters">
      <RecipeSearch searchQuery={searchQuery} onSearchChange={onSearchChange} />

      <div className="recipe-filters__controls">
        <div className="recipe-filters__group">
          <label htmlFor="dish-type-filter" className="recipe-filters__label">
            {t('home.filters.dishLabel')}
          </label>
          <select
            id="dish-type-filter"
            className="recipe-filters__select"
            value={dishTypeFilter}
            onChange={e => onDishTypeChange(e.target.value as DishType | 'all')}
          >
            <option value="all">{t('home.filters.allDishes')}</option>
            {dishTypes.map(type => (
              <option key={type} value={type}>
                {t(`home.filters.dish.${type}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="recipe-filters__group">
          <label htmlFor="protein-type-filter" className="recipe-filters__label">
            {t('home.filters.proteinLabel')}
          </label>
          <select
            id="protein-type-filter"
            className="recipe-filters__select"
            value={proteinTypeFilter}
            onChange={e => onProteinTypeChange(e.target.value as ProteinType | 'all')}
          >
            <option value="all">{t('home.filters.allProteins')}</option>
            {proteinTypes.map(type => (
              <option key={type} value={type}>
                {t(`home.filters.protein.${type}`)}
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
            {t('home.filters.clearFilters')}
          </button>
        )}
      </div>

      <div className="recipe-filters__results">
        <span>
          {hasActiveFilters
            ? t('home.filters.showing', { count: resultCount, total: totalCount })
            : t('home.filters.total', { count: totalCount })}
        </span>
      </div>
    </div>
  )
}
