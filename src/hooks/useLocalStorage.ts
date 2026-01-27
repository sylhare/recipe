import { useState, useEffect, useCallback } from 'react'
import { getFromStorage, setToStorage } from '../utils/storage'

/**
 * React hook for syncing state with localStorage.
 * @param key - The localStorage key to use
 * @param initialValue - Default value if key doesn't exist in storage
 * @returns A tuple of [storedValue, setValue] similar to useState
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getFromStorage(key, initialValue)
  })

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value
      setToStorage(key, newValue)
      return newValue
    })
  }, [key])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch {
          /* Parse errors are ignored to handle malformed storage data gracefully */
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}
