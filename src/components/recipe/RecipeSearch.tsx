import './RecipeSearch.css'

interface RecipeSearchProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function RecipeSearch({ searchQuery, onSearchChange }: RecipeSearchProps) {
  return (
    <div className="recipe-search">
      <label htmlFor="recipe-search" className="recipe-search__label">
        Search
      </label>
      <div className="recipe-search__wrapper">
        <input
          id="recipe-search"
          type="search"
          className="recipe-search__input"
          placeholder="Search by name or ingredient…"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className="recipe-search__clear"
            onClick={() => onSearchChange('')}
            type="button"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
