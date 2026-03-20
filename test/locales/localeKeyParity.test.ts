import { describe, it, expect } from 'vitest'
import { SUPPORTED_LANGUAGES } from '../../src/i18n'

const commonLocales = import.meta.glob('../../src/locales/*/common.json', { eager: true }) as Record<string, { default: unknown }>
const recipesLocales = import.meta.glob('../../src/locales/*/recipes.json', { eager: true }) as Record<string, { default: unknown }>

function getLocale(locales: Record<string, { default: unknown }>, lang: string): unknown {
  const key = Object.keys(locales).find(k => k.includes(`/${lang}/`))
  return key ? locales[key].default : null
}

function missingKeys(source: unknown, target: unknown, path = ''): string[] {
  if (typeof source !== 'object' || source === null || Array.isArray(source)) return []
  const src = source as Record<string, unknown>
  const tgt = (typeof target === 'object' && target !== null && !Array.isArray(target))
    ? target as Record<string, unknown>
    : {}
  return Object.keys(src).flatMap(key => {
    const keyPath = path ? `${path}.${key}` : key
    if (!(key in tgt)) return [keyPath]
    return missingKeys(src[key], tgt[key], keyPath)
  })
}

const [reference, ...others] = SUPPORTED_LANGUAGES

const namespaces = [
  { namespace: 'common', locales: commonLocales },
  { namespace: 'recipes', locales: recipesLocales },
]

describe('Locale key parity', () => {
  describe.each(namespaces)('$namespace.json', ({ namespace, locales }) => {
    const refLocale = getLocale(locales, reference)

    it.each(others)(`%s has all keys from ${reference}`, (lang) => {
      const missing = missingKeys(refLocale, getLocale(locales, lang))
      expect(missing, `Missing keys in ${lang}/${namespace}.json: ${missing.join(', ')}`).toHaveLength(0)
    })
  })
})
