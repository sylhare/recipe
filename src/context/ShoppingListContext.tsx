import { createContext, useContext, useMemo, useCallback, type ReactNode } from 'react'
import type { ShoppingListItem, IngredientCategory } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/storage'
import { aggregateIngredients, groupByCategory } from '../utils/ingredientAggregator'
import { useRecipeContext } from './RecipeContext'
import { useRecipeLocale } from '../hooks/useRecipeLocale'

interface ShoppingListContextValue {
  items: ShoppingListItem[]
  groupedItems: Map<IngredientCategory, ShoppingListItem[]>
  checkedItems: Set<string>
  toggleItem: (itemId: string) => void
  clearChecked: () => void
  clearAll: () => void
  totalItems: number
  checkedCount: number
}

const ShoppingListContext = createContext<ShoppingListContextValue | null>(null)

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const { recipes, selections, clearAll: clearRecipeSelections } = useRecipeContext()
  const [checkedIds, setCheckedIds] = useLocalStorage<string[]>(STORAGE_KEYS.CHECKED_ITEMS, [])
  const { getIngredientName } = useRecipeLocale()

  const nameResolver = useCallback((recipeId: string, ingredientId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId)
    if (!recipe) return ingredientId
    return getIngredientName(recipe, ingredientId)
  }, [recipes, getIngredientName])

  const items = useMemo(() => {
    return aggregateIngredients(recipes, selections, nameResolver)
  }, [recipes, selections, nameResolver])

  const groupedItems = useMemo(() => {
    return groupByCategory(items)
  }, [items])

  const checkedItems = useMemo(() => new Set(checkedIds), [checkedIds])

  const toggleItem = (itemId: string) => {
    setCheckedIds(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId)
      }
      return [...prev, itemId]
    })
  }

  const clearChecked = () => {
    setCheckedIds([])
  }

  const clearAll = () => {
    clearRecipeSelections()
    setCheckedIds([])
  }

  return (
    <ShoppingListContext.Provider
      value={{
        items,
        groupedItems,
        checkedItems,
        toggleItem,
        clearChecked,
        clearAll,
        totalItems: items.length,
        checkedCount: checkedIds.filter(id => items.some(item => item.id === id)).length,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  )
}

export function useShoppingListContext() {
  const context = useContext(ShoppingListContext)
  if (!context) {
    throw new Error('useShoppingListContext must be used within a ShoppingListProvider')
  }
  return context
}
