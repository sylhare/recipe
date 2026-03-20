import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from '../locales/en/common.json'
import frCommon from '../locales/fr/common.json'
import enRecipes from '../locales/en/recipes.json'
import frRecipes from '../locales/fr/recipes.json'

export const SUPPORTED_LANGUAGES = ['en', 'fr']

function detectLanguage(): string {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('language')
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) return saved
  }
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.split('-')[0]
    if (SUPPORTED_LANGUAGES.includes(browserLang)) return browserLang
  }
  return 'en'
}

i18next
  .use(initReactI18next)
  .init({
    lng: detectLanguage(),
    fallbackLng: 'en',
    ns: ['common', 'recipes'],
    defaultNS: 'common',
    resources: {
      en: { common: enCommon, recipes: enRecipes },
      fr: { common: frCommon, recipes: frRecipes },
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18next
