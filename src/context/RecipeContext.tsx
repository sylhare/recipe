import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { Recipe, RecipeSelection } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/storage'
import recipesData from '../data/recipes.json'

interface RecipeState {
  recipes: Recipe[]
  selections: RecipeSelection[]
}

type RecipeAction =
  | { type: 'SELECT_RECIPE'; recipeId: string; servings: number }
  | { type: 'DESELECT_RECIPE'; recipeId: string }
  | { type: 'UPDATE_SERVINGS'; recipeId: string; servings: number }
  | { type: 'CLEAR_ALL' }
  | { type: 'LOAD_SELECTIONS'; selections: RecipeSelection[] }

export function recipeReducer(state: RecipeState, action: RecipeAction): RecipeState {
  switch (action.type) {
    case 'SELECT_RECIPE': {
      const existingIndex = state.selections.findIndex(s => s.recipeId === action.recipeId)
      if (existingIndex >= 0) {
        return state
      }
      return {
        ...state,
        selections: [...state.selections, { recipeId: action.recipeId, servings: action.servings }],
      }
    }
    case 'DESELECT_RECIPE':
      return {
        ...state,
        selections: state.selections.filter(s => s.recipeId !== action.recipeId),
      }
    case 'UPDATE_SERVINGS': {
      return {
        ...state,
        selections: state.selections.map(s =>
          s.recipeId === action.recipeId ? { ...s, servings: action.servings } : s
        ),
      }
    }
    case 'CLEAR_ALL':
      return {
        ...state,
        selections: [],
      }
    case 'LOAD_SELECTIONS':
      return {
        ...state,
        selections: action.selections,
      }
    default:
      return state
  }
}

interface RecipeContextValue {
  recipes: Recipe[]
  selections: RecipeSelection[]
  selectRecipe: (recipeId: string) => void
  deselectRecipe: (recipeId: string) => void
  updateServings: (recipeId: string, servings: number) => void
  clearAll: () => void
  isSelected: (recipeId: string) => boolean
  getServings: (recipeId: string) => number | undefined
}

const RecipeContext = createContext<RecipeContextValue | null>(null)

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [persistedSelections, setPersistedSelections] = useLocalStorage<RecipeSelection[]>(
    STORAGE_KEYS.RECIPE_SELECTIONS,
    []
  )

  const [state, dispatch] = useReducer(recipeReducer, {
    recipes: recipesData as Recipe[],
    selections: persistedSelections,
  })

  useEffect(() => {
    setPersistedSelections(state.selections)
  }, [state.selections, setPersistedSelections])

  const selectRecipe = (recipeId: string) => {
    const recipe = state.recipes.find(r => r.id === recipeId)
    if (recipe) {
      dispatch({ type: 'SELECT_RECIPE', recipeId, servings: recipe.defaultServings })
    }
  }

  const deselectRecipe = (recipeId: string) => {
    dispatch({ type: 'DESELECT_RECIPE', recipeId })
  }

  const updateServings = (recipeId: string, servings: number) => {
    dispatch({ type: 'UPDATE_SERVINGS', recipeId, servings })
  }

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' })
  }

  const isSelected = (recipeId: string) => {
    return state.selections.some(s => s.recipeId === recipeId)
  }

  const getServings = (recipeId: string) => {
    return state.selections.find(s => s.recipeId === recipeId)?.servings
  }

  return (
    <RecipeContext.Provider
      value={{
        recipes: state.recipes,
        selections: state.selections,
        selectRecipe,
        deselectRecipe,
        updateServings,
        clearAll,
        isSelected,
        getServings,
      }}
    >
      {children}
    </RecipeContext.Provider>
  )
}

export function useRecipeContext() {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider')
  }
  return context
}
