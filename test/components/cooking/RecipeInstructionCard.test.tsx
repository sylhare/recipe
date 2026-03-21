import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18next from 'i18next'
import { RecipeInstructionCard } from '../../../src/components/cooking/RecipeInstructionCard'
import type { Recipe } from '../../../src/types'

const mockDeselectRecipe = vi.fn()
const mockUpdateServings = vi.fn()

vi.mock('../../../src/context/RecipeContext', () => ({
  useRecipeContext: () => ({
    deselectRecipe: mockDeselectRecipe,
    updateServings: mockUpdateServings,
  }),
}))

const mockRecipe: Recipe = {
  id: 'test-recipe',
  imageUrl: '/test-image.png',
  defaultServings: 4,
  ingredients: [
    { id: 'ing-1', quantity: 2, unit: 'cup', category: 'pantry' },
    { id: 'ing-2', quantity: 1, unit: 'cup', category: 'pantry' },
    { id: 'ing-3', quantity: 3, unit: 'piece', category: 'dairy' },
  ],
}

const TEST_TRANSLATIONS = {
  'test-recipe': {
    name: 'Test Recipe',
    description: 'A delicious test recipe',
    ingredientNames: { 'ing-1': 'flour', 'ing-2': 'sugar', 'ing-3': 'eggs' },
    instructions: {
      steps: [
        'Preheat oven to 350°F.',
        'Measure out all flour and sugar.',
        'Mix ingredients in a bowl.',
        'Pour batter into pan.',
        'Let cool for 10 minutes.',
        'Serve with fresh fruit.',
      ],
      tips: ['Use room temperature eggs for best results.', 'Sift the flour for fluffier texture.'],
    },
  },
  'duplicate-recipe': {
    name: 'Test Recipe',
    description: 'A delicious test recipe',
    ingredientNames: { 'ing-1': 'flour', 'ing-2': 'flour', 'ing-3': 'sugar' },
    instructions: { steps: [], tips: [] },
  },
  'different-units': {
    name: 'Test Recipe',
    description: '',
    ingredientNames: { 'ing-1': 'olive oil', 'ing-2': 'olive oil' },
    instructions: { steps: [], tips: [] },
  },
  'mixed-case': {
    name: 'Test Recipe',
    description: '',
    ingredientNames: { 'ing-1': 'Flour', 'ing-2': 'flour' },
    instructions: { steps: [], tips: [] },
  },
}

describe('RecipeInstructionCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    i18next.addResourceBundle('en', 'recipes', TEST_TRANSLATIONS, true, true)
  })

  describe('rendering', () => {
    it('renders recipe name and description', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      expect(screen.getByText('Test Recipe')).toBeInTheDocument()
      expect(screen.getByText('A delicious test recipe')).toBeInTheDocument()
    })

    it('renders recipe image', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const image = screen.getByRole('img', { name: 'Test Recipe' })
      expect(image).toHaveAttribute('src', '/test-image.png')
    })

    it('renders remove button', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const removeButton = screen.getByRole('button', { name: '✕' })
      expect(removeButton).toBeInTheDocument()
      expect(removeButton).toHaveAttribute('title', 'Remove Recipe')
    })

    it('renders expand button with Expand label when collapsed', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument()
    })

    it('expand button label changes to Collapse when expanded', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      await userEvent.click(screen.getByRole('button', { name: 'Expand' }))

      expect(screen.getByRole('button', { name: 'Collapse' })).toBeInTheDocument()
    })
  })

  describe('expand/collapse', () => {
    it('starts collapsed by default', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const card = document.querySelector('.recipe-instruction-card')
      expect(card).not.toHaveClass('recipe-instruction-card--expanded')
      expect(screen.queryByText('Ingredients')).not.toBeInTheDocument()
    })

    it('expands when header is clicked', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      const card = document.querySelector('.recipe-instruction-card')
      expect(card).toHaveClass('recipe-instruction-card--expanded')
      expect(screen.getByText('Ingredients')).toBeInTheDocument()
    })

    it('collapses again when header is clicked while expanded', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)
      await userEvent.click(header!)

      const card = document.querySelector('.recipe-instruction-card')
      expect(card).not.toHaveClass('recipe-instruction-card--expanded')
      expect(screen.queryByText('Ingredients')).not.toBeInTheDocument()
    })
  })

  describe('ingredients', () => {
    it('renders all ingredients in the ingredients list when expanded', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      const ingredientsList = document.querySelector('.ingredients-list')
      expect(ingredientsList).toBeInTheDocument()
      expect(ingredientsList?.textContent).toContain('flour')
      expect(ingredientsList?.textContent).toContain('sugar')
      expect(ingredientsList?.textContent).toContain('eggs')
    })

    it('displays scaled quantities correctly', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={8} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      expect(screen.getByText('4 cup')).toBeInTheDocument()
      expect(screen.getByText('2 cup')).toBeInTheDocument()
      expect(screen.getByText('6 piece')).toBeInTheDocument()
    })

    it('displays Ingredients header', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      expect(screen.getByText('Ingredients')).toBeInTheDocument()
    })
  })

  describe('instructions', () => {
    it('renders all steps in a numbered list', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      expect(screen.getByText(/Preheat oven/)).toBeInTheDocument()
      expect(screen.getByText(/Mix ingredients/)).toBeInTheDocument()
      expect(screen.getByText(/Let cool for/)).toBeInTheDocument()
    })

    it('renders Pro Tips section', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      expect(screen.getByText('Pro Tips')).toBeInTheDocument()
      expect(screen.getByText('💡')).toBeInTheDocument()
      expect(screen.getByText(/room temperature eggs/)).toBeInTheDocument()
      expect(screen.getByText(/Sift the flour/)).toBeInTheDocument()
    })
  })

  describe('ingredient highlighting', () => {
    it('wraps ingredient names in strong tags with quantity annotations', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      const highlightedIngredients = screen.getAllByRole('strong')
      expect(highlightedIngredients.length).toBeGreaterThan(0)

      const flourHighlight = highlightedIngredients.find(el =>
        el.textContent?.includes('flour')
      )
      expect(flourHighlight).toBeInTheDocument()
      expect(flourHighlight?.textContent).toContain('2 cup')
    })
  })

  describe('user interactions', () => {
    it('shows confirmation dialog when remove button is clicked', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      await userEvent.click(screen.getByRole('button', { name: '✕' }))

      expect(screen.getByText('Remove Recipe')).toBeInTheDocument()
      expect(screen.getByText(/Are you sure you want to remove "Test Recipe"/)).toBeInTheDocument()
    })

    it('calls deselectRecipe when confirm is clicked', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      await userEvent.click(screen.getByRole('button', { name: '✕' }))
      await userEvent.click(screen.getByRole('button', { name: 'Yes, Remove' }))

      expect(mockDeselectRecipe).toHaveBeenCalledWith('test-recipe')
    })

    it('does not call deselectRecipe when cancel is clicked', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      await userEvent.click(screen.getByRole('button', { name: '✕' }))
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(mockDeselectRecipe).not.toHaveBeenCalled()
      expect(screen.queryByText('Remove Recipe')).not.toBeInTheDocument()
    })
  })

  describe('servings control', () => {
    it('shows servings input when expanded', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      await userEvent.click(screen.getByRole('button', { name: 'Expand' }))

      expect(screen.getByLabelText('Servings')).toBeInTheDocument()
      expect(screen.getByLabelText('Servings')).toHaveValue(4)
    })

    it('does not show servings input when collapsed', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      expect(screen.queryByLabelText('Servings')).not.toBeInTheDocument()
    })

    it('calls updateServings when + is clicked', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      await userEvent.click(screen.getByRole('button', { name: 'Expand' }))
      await userEvent.click(screen.getByRole('button', { name: 'Increase' }))

      expect(mockUpdateServings).toHaveBeenCalledWith('test-recipe', 5)
    })

    it('calls updateServings when − is clicked', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      await userEvent.click(screen.getByRole('button', { name: 'Expand' }))
      await userEvent.click(screen.getByRole('button', { name: 'Decrease' }))

      expect(mockUpdateServings).toHaveBeenCalledWith('test-recipe', 3)
    })
  })

  describe('image error handling', () => {
    it('shows fallback emoji when image fails to load', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const image = screen.getByRole('img', { name: 'Test Recipe' })
      fireEvent.error(image)

      expect(screen.queryByRole('img', { name: 'Test Recipe' })).not.toBeInTheDocument()
      expect(document.querySelector('.recipe-instruction-card__image-placeholder')).toBeInTheDocument()
    })
  })

  describe('ingredient merging', () => {
    const mockRecipeWithDuplicates: Recipe = {
      ...mockRecipe,
      id: 'duplicate-recipe',
      ingredients: [
        { id: 'ing-1', quantity: 2, unit: 'cup', category: 'pantry' },
        { id: 'ing-2', quantity: 1, unit: 'cup', category: 'pantry' },
        { id: 'ing-3', quantity: 1, unit: 'cup', category: 'pantry' },
      ],
    }

    it('merges duplicate ingredients with same name and unit', async () => {
      render(<RecipeInstructionCard recipe={mockRecipeWithDuplicates} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      const ingredientItems = document.querySelectorAll('.ingredients-list__item')
      expect(ingredientItems.length).toEqual(2)

      expect(screen.getByText('3 cup')).toBeInTheDocument()
      expect(screen.getByText('1 cup')).toBeInTheDocument()
    })

    it('does not merge ingredients with different units', async () => {
      const recipeWithDifferentUnits: Recipe = {
        ...mockRecipe,
        id: 'different-units',
        ingredients: [
          { id: 'ing-1', quantity: 2, unit: 'tbsp', category: 'pantry' },
          { id: 'ing-2', quantity: 1, unit: 'cup', category: 'pantry' },
        ],
      }

      render(<RecipeInstructionCard recipe={recipeWithDifferentUnits} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      const ingredientItems = document.querySelectorAll('.ingredients-list__item')
      expect(ingredientItems.length).toEqual(2)
    })

    it('merges ingredients case-insensitively', async () => {
      const recipeWithMixedCase: Recipe = {
        ...mockRecipe,
        id: 'mixed-case',
        ingredients: [
          { id: 'ing-1', quantity: 2, unit: 'cup', category: 'pantry' },
          { id: 'ing-2', quantity: 1, unit: 'cup', category: 'pantry' },
        ],
      }

      render(<RecipeInstructionCard recipe={recipeWithMixedCase} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      const ingredientItems = document.querySelectorAll('.ingredients-list__item')
      expect(ingredientItems.length).toEqual(1)
      expect(screen.getByText('3 cup')).toBeInTheDocument()
    })

    it('scales merged quantities correctly', async () => {
      render(<RecipeInstructionCard recipe={mockRecipeWithDuplicates} servings={8} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      expect(screen.getByText('6 cup')).toBeInTheDocument()
      expect(screen.getByText('2 cup')).toBeInTheDocument()
    })
  })
})
