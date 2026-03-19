import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRecipeContext } from '../../context/RecipeContext'
import './Header.css'

export function Header() {
  const location = useLocation()
  const { selections } = useRecipeContext()
  const { t, i18n } = useTranslation()

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
  }

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo" aria-label="Recipe App">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="header__logo-icon" />
        </Link>
        <nav className="header__nav">
          <Link
            to="/"
            className={`header__link ${location.pathname === '/' ? 'header__link--active' : ''}`}
          >
            {t('nav.recipes')}
          </Link>
          <Link
            to="/cooking"
            className={`header__link ${location.pathname === '/cooking' ? 'header__link--active' : ''}`}
          >
            {t('nav.cooking')}
            {selections.length > 0 && (
              <span className="header__badge">{selections.length}</span>
            )}
          </Link>
          <Link
            to="/shopping-list"
            className={`header__link ${location.pathname === '/shopping-list' ? 'header__link--active' : ''}`}
          >
            {t('nav.shoppingList')}
          </Link>
        </nav>
        <div className="header__lang-switcher">
          <button
            className={`header__lang-btn ${i18n.language === 'en' ? 'header__lang-btn--active' : ''}`}
            onClick={() => handleLanguageChange('en')}
            aria-label="Switch to English"
          >
            {t('language.en')}
          </button>
          <span className="header__lang-sep" aria-hidden="true">|</span>
          <button
            className={`header__lang-btn ${i18n.language === 'fr' ? 'header__lang-btn--active' : ''}`}
            onClick={() => handleLanguageChange('fr')}
            aria-label="Switch to French"
          >
            {t('language.fr')}
          </button>
        </div>
      </div>
    </header>
  )
}
