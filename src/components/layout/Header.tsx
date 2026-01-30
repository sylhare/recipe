import { Link, useLocation } from 'react-router-dom'
import { useRecipeContext } from '../../context/RecipeContext'
import './Header.css'

export function Header() {
  const location = useLocation()
  const { selections } = useRecipeContext()

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          Recipe App
        </Link>
        <nav className="header__nav">
          <Link
            to="/"
            className={`header__link ${location.pathname === '/' ? 'header__link--active' : ''}`}
          >
            Recipes
          </Link>
          <Link
            to="/cooking"
            className={`header__link ${location.pathname === '/cooking' ? 'header__link--active' : ''}`}
          >
            Cooking
            {selections.length > 0 && (
              <span className="header__badge">{selections.length}</span>
            )}
          </Link>
          <Link
            to="/shopping-list"
            className={`header__link ${location.pathname === '/shopping-list' ? 'header__link--active' : ''}`}
          >
            Shopping List
          </Link>
        </nav>
      </div>
    </header>
  )
}
