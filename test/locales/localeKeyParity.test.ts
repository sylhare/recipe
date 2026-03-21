import { describe, it, expect } from 'vitest'
import { SUPPORTED_LANGUAGES } from '../../src/i18n'

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function missingKeys(source: unknown, target: unknown, path = ''): string[] {
  if (!isPlainObject(source)) return []
  const tgt = isPlainObject(target) ? target : {}
  return Object.keys(source).flatMap(key => {
    const keyPath = path ? `${path}.${key}` : key
    if (!(key in tgt)) return [keyPath]
    return missingKeys(source[key], tgt[key], keyPath)
  })
}

function toLocaleMap(locales: Record<string, { default: unknown }>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(locales).map(([path, mod]) => [path.match(/\/(\w+)\//)?.[1] ?? '', mod.default])
  )
}

const namespaces = [
  { namespace: 'common', map: toLocaleMap(import.meta.glob('../../src/locales/*/common.json', { eager: true }) as Record<string, { default: unknown }>) },
  { namespace: 'recipes', map: toLocaleMap(import.meta.glob('../../src/locales/*/recipes.json', { eager: true }) as Record<string, { default: unknown }>) },
]

const [reference, ...others] = SUPPORTED_LANGUAGES

describe('Locale key parity', () => {
  describe.each(namespaces)('$namespace.json', ({ namespace, map }) => {
    it.each(others)(`%s has all keys from ${reference}`, (lang) => {
      const missing = missingKeys(map[reference], map[lang])
      expect(missing, `Missing keys in ${lang}/${namespace}.json: ${missing.join(', ')}`).toHaveLength(0)
    })
  })
})
