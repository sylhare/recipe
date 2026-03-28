import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../../i18n'
import { STORAGE_KEYS } from '../../utils/storage'
import './Footer.css'

export function Footer() {
  const { t, i18n } = useTranslation()

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang)
  }

  return (
    <footer className="footer">
      <div className="footer__lang-switcher">
        {SUPPORTED_LANGUAGES.map((lang, i) => (
          <Fragment key={lang}>
            {i > 0 && <span className="footer__lang-sep" aria-hidden="true">|</span>}
            <button
              className={`footer__lang-btn ${i18n.language === lang ? 'footer__lang-btn--active' : ''}`}
              onClick={() => handleLanguageChange(lang)}
              aria-label={`Switch to ${lang.toUpperCase()}`}
            >
              {t(`language.${lang}`)}
            </button>
          </Fragment>
        ))}
      </div>
    </footer>
  )
}
