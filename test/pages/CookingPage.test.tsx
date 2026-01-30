import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import CookingPage from '../../src/pages/CookingPage'
import type { Recipe, RecipeSelection } from '../../src/types'

const mockRecipes: Recipe[] = [
  {
    id: 'recipe-1',
    name: 'Pasta Carbonara',
    description: 'Classic Italian pasta',
    imageUrl: '/pasta.png',
    defaultServings: 4,
    ingredients: [],
    instructions: ['Boil pasta', 'Add sauce'],
  },
  {
    id: 'recipe-2',
    name: 'Chicken Curry',
    description: 'Spicy Indian curry',
    imageUrl: '/curry.png',
    defaultServings: 4,
    ingredients: [],
    instructions: ['Cook chicken', 'Add spices'],
  },
  {
    id: 'recipe-3',
    name: 'Caesar Salad',
    description: 'Fresh salad with dressing',
    imageUrl: '/salad.png',
    defaultServings: 2,
    ingredients: [],
    instructions: ['Chop lettuce', 'Add dressing'],
  },
]

let mockSelections: RecipeSelection[] = []

vi.mock('../../src/context/RecipeContext', () => ({
  useRecipeContext: () => ({
    recipes: mockRecipes,
    selections: mockSelections,
  }),
}))

vi.mock('../../src/components/cooking/RecipeInstructionCard', () => ({
  RecipeInstructionCard: ({ recipe, servings }: { recipe: Recipe; servings: number }) => (
    <div data-testid={`recipe-card-${recipe.id}`} data-servings={servings}>
      {recipe.name}
    </div>
  ),
}))

describe('CookingPage', () => {
  beforeEach(() => {
    mockSelections = []
  })

  describe('empty state', () => {
    it('shows empty message when no recipes selected', () => {
      mockSelections = []
      render(<CookingPage />)

      expect(screen.getByText('No recipes selected')).toBeInTheDocument()
      expect(
        screen.getByText('Select some recipes from the Recipes tab to see cooking instructions here.')
      ).toBeInTheDocument()
    })

    it('does not show header when no recipes selected', () => {
      mockSelections = []
      render(<CookingPage />)

      expect(screen.queryByText('Cooking Instructions')).not.toBeInTheDocument()
    })
  })

  describe('with selections', () => {
    it('shows header with title when recipes are selected', () => {
      mockSelections = [{ recipeId: 'recipe-1', servings: 4 }]
      render(<CookingPage />)

      expect(screen.getByText('Cooking Instructions')).toBeInTheDocument()
    })

    it('shows singular subtitle for one recipe', () => {
      mockSelections = [{ recipeId: 'recipe-1', servings: 4 }]
      render(<CookingPage />)

      expect(screen.getByText('1 recipe selected')).toBeInTheDocument()
    })

    it('shows plural subtitle for multiple recipes', () => {
      mockSelections = [
        { recipeId: 'recipe-1', servings: 4 },
        { recipeId: 'recipe-2', servings: 6 },
      ]
      render(<CookingPage />)

      expect(screen.getByText('2 recipes selected')).toBeInTheDocument()
    })
  })

  describe('recipe cards', () => {
    it('renders correct number of RecipeInstructionCard components', () => {
      mockSelections = [
        { recipeId: 'recipe-1', servings: 4 },
        { recipeId: 'recipe-2', servings: 6 },
        { recipeId: 'recipe-3', servings: 2 },
      ]
      render(<CookingPage />)

      expect(screen.getByTestId('recipe-card-recipe-1')).toBeInTheDocument()
      expect(screen.getByTestId('recipe-card-recipe-2')).toBeInTheDocument()
      expect(screen.getByTestId('recipe-card-recipe-3')).toBeInTheDocument()
    })

    it('passes correct servings to each card', () => {
      mockSelections = [
        { recipeId: 'recipe-1', servings: 8 },
        { recipeId: 'recipe-2', servings: 3 },
      ]
      render(<CookingPage />)

      expect(screen.getByTestId('recipe-card-recipe-1')).toHaveAttribute('data-servings', '8')
      expect(screen.getByTestId('recipe-card-recipe-2')).toHaveAttribute('data-servings', '3')
    })

    it('filters out selections with no matching recipe', () => {
      mockSelections = [
        { recipeId: 'recipe-1', servings: 4 },
        { recipeId: 'non-existent', servings: 2 },
        { recipeId: 'recipe-2', servings: 6 },
      ]
      render(<CookingPage />)

      expect(screen.getByTestId('recipe-card-recipe-1')).toBeInTheDocument()
      expect(screen.getByTestId('recipe-card-recipe-2')).toBeInTheDocument()
      expect(screen.queryByTestId('recipe-card-non-existent')).not.toBeInTheDocument()
      expect(screen.getByText('2 recipes selected')).toBeInTheDocument()
    })

    it('shows empty state when all selections have no matching recipe', () => {
      mockSelections = [
        { recipeId: 'non-existent-1', servings: 2 },
        { recipeId: 'non-existent-2', servings: 4 },
      ]
      render(<CookingPage />)

      expect(screen.getByText('No recipes selected')).toBeInTheDocument()
    })
  })
})
