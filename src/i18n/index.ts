import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from '../locales/en/common.json'
import frCommon from '../locales/fr/common.json'

const savedLanguage = typeof localStorage !== 'undefined'
  ? (localStorage.getItem('language') ?? 'en')
  : 'en'

i18next
  .use(initReactI18next)
  .init({
    lng: savedLanguage,
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    resources: {
      en: { common: enCommon },
      fr: { common: frCommon },
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18next
