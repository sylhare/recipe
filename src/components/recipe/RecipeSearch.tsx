import { useTranslation } from 'react-i18next'
import './RecipeSearch.css'

interface RecipeSearchProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function RecipeSearch({ searchQuery, onSearchChange }: RecipeSearchProps) {
  const { t } = useTranslation()

  return (
    <div className="recipe-search">
      <label htmlFor="recipe-search" className="recipe-search__label">
        {t('home.search.label')}
      </label>
      <div className="recipe-search__wrapper">
        <input
          id="recipe-search"
          type="search"
          className="recipe-search__input"
          placeholder={t('home.search.placeholder')}
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className="recipe-search__clear"
            onClick={() => onSearchChange('')}
            type="button"
            aria-label={t('home.clearSearch')}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
