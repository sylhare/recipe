import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from '../locales/en/common.json'
import frCommon from '../locales/fr/common.json'
import enRecipes from '../locales/en/recipes.json'
import frRecipes from '../locales/fr/recipes.json'

const savedLanguage = typeof localStorage !== 'undefined'
  ? (localStorage.getItem('language') ?? 'en')
  : 'en'

i18next
  .use(initReactI18next)
  .init({
    lng: savedLanguage,
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
