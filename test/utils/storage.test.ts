import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getFromStorage, setToStorage, removeFromStorage, STORAGE_KEYS } from '../../src/utils/storage'

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('STORAGE_KEYS', () => {
    it('has correct key values', () => {
      expect(STORAGE_KEYS.RECIPE_SELECTIONS).toBe('recipe-selections')
      expect(STORAGE_KEYS.CHECKED_ITEMS).toBe('checked-items')
    })
  })

  describe('getFromStorage', () => {
    it('returns default value when key does not exist', () => {
      const result = getFromStorage('nonexistent', [])
      expect(result).toEqual([])
    })

    it('returns parsed value when key exists', () => {
      localStorage.setItem('test-key', JSON.stringify({ foo: 'bar' }))
      const result = getFromStorage('test-key', {})
      expect(result).toEqual({ foo: 'bar' })
    })

    it('returns default value when JSON parse fails', () => {
      localStorage.setItem('bad-json', 'not valid json')
      const result = getFromStorage('bad-json', 'default')
      expect(result).toBe('default')
    })
  })

  describe('setToStorage', () => {
    it('saves value to localStorage', () => {
      setToStorage('test-key', { value: 123 })
      expect(localStorage.getItem('test-key')).toBe('{"value":123}')
    })

    it('handles storage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage full')
      })

      setToStorage('test-key', 'value')
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save to localStorage: test-key')

      setItemSpy.mockRestore()
      consoleSpy.mockRestore()
    })
  })

  describe('removeFromStorage', () => {
    it('removes item from localStorage', () => {
      localStorage.setItem('test-key', 'value')
      removeFromStorage('test-key')
      expect(localStorage.getItem('test-key')).toBeNull()
    })
  })
})
