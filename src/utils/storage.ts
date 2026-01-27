export const STORAGE_KEYS = {
  RECIPE_SELECTIONS: 'recipe-selections',
  CHECKED_ITEMS: 'checked-items',
} as const

export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error(`Failed to save to localStorage: ${key}`)
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    console.error(`Failed to remove from localStorage: ${key}`)
  }
}
