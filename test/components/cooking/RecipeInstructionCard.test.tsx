import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
  name: 'Test Recipe',
  description: 'A delicious test recipe',
  imageUrl: '/test-image.png',
  defaultServings: 4,
  ingredients: [
    { id: 'ing-1', name: 'flour', quantity: 2, unit: 'cup', category: 'pantry' },
    { id: 'ing-2', name: 'sugar', quantity: 1, unit: 'cup', category: 'pantry' },
    { id: 'ing-3', name: 'eggs', quantity: 3, unit: 'piece', category: 'dairy' },
  ],
  instructions: [
    'Mix flour and sugar together.',
    'Add eggs and stir well.',
    'Bake at 350°F for 30 minutes.',
  ],
}

const mockRecipeWithEnhanced: Recipe = {
  ...mockRecipe,
  id: 'enhanced-recipe',
  enhancedInstructions: {
    preparation: ['Preheat oven to 350°F.', 'Measure out all flour and sugar.'],
    cooking: ['Mix ingredients in a bowl.', 'Pour batter into pan.'],
    serving: ['Let cool for 10 minutes.', 'Serve with fresh fruit.'],
    tips: ['Use room temperature eggs for best results.', 'Sift the flour for fluffier texture.'],
  },
}

describe('RecipeInstructionCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
      expect(removeButton).toHaveAttribute('title', 'Remove recipe')
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

  describe('basic instructions', () => {
    it('renders basic instructions when no enhanced instructions', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      expect(screen.getByText('Instructions')).toBeInTheDocument()
      const instructionSteps = document.querySelectorAll('.instruction-step')
      expect(instructionSteps.length).toBe(3)
      expect(instructionSteps[0].textContent).toContain('Mix')
      expect(instructionSteps[0].textContent).toContain('flour')
      expect(instructionSteps[0].textContent).toContain('sugar')
      expect(instructionSteps[1].textContent).toContain('eggs')
      expect(instructionSteps[2].textContent).toContain('Bake at 350°F')
    })

    it('renders the instructions icon', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      expect(screen.getByText('📝')).toBeInTheDocument()
    })
  })

  describe('enhanced instructions', () => {
    it('renders Preparation section with icon', async () => {
      render(<RecipeInstructionCard recipe={mockRecipeWithEnhanced} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      expect(screen.getByText('Preparation')).toBeInTheDocument()
      expect(screen.getByText('🔪')).toBeInTheDocument()
      expect(screen.getByText(/Preheat oven/)).toBeInTheDocument()
    })

    it('renders Cooking section with icon', async () => {
      render(<RecipeInstructionCard recipe={mockRecipeWithEnhanced} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      expect(screen.getByText('Cooking')).toBeInTheDocument()
      expect(screen.getByText('🍳')).toBeInTheDocument()
      expect(screen.getByText(/Mix ingredients/)).toBeInTheDocument()
    })

    it('renders Serving section with icon', async () => {
      render(<RecipeInstructionCard recipe={mockRecipeWithEnhanced} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      expect(screen.getByText('Serving')).toBeInTheDocument()
      expect(screen.getByText('🍽️')).toBeInTheDocument()
      expect(screen.getByText(/Let cool for/)).toBeInTheDocument()
    })

    it('renders Pro Tips section', async () => {
      render(<RecipeInstructionCard recipe={mockRecipeWithEnhanced} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      expect(screen.getByText('Pro Tips')).toBeInTheDocument()
      expect(screen.getByText('💡')).toBeInTheDocument()
      expect(screen.getByText(/room temperature eggs/)).toBeInTheDocument()
      expect(screen.getByText(/Sift the flour/)).toBeInTheDocument()
    })

    it('does not render basic instructions section when enhanced exists', async () => {
      render(<RecipeInstructionCard recipe={mockRecipeWithEnhanced} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      expect(screen.queryByText('📝')).not.toBeInTheDocument()
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
        { id: 'ing-1', name: 'flour', quantity: 2, unit: 'cup', category: 'pantry' },
        { id: 'ing-2', name: 'flour', quantity: 1, unit: 'cup', category: 'pantry' },
        { id: 'ing-3', name: 'sugar', quantity: 1, unit: 'cup', category: 'pantry' },
      ],
      instructions: ['Mix flour and sugar.'],
    }

    it('merges duplicate ingredients with same name and unit', async () => {
      render(<RecipeInstructionCard recipe={mockRecipeWithDuplicates} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      const ingredientItems = document.querySelectorAll('.ingredients-list__item')
      expect(ingredientItems.length).toBe(2)

      expect(screen.getByText('3 cup')).toBeInTheDocument()
      expect(screen.getByText('1 cup')).toBeInTheDocument()
    })

    it('does not merge ingredients with different units', async () => {
      const recipeWithDifferentUnits: Recipe = {
        ...mockRecipe,
        id: 'different-units',
        ingredients: [
          { id: 'ing-1', name: 'olive oil', quantity: 2, unit: 'tbsp', category: 'pantry' },
          { id: 'ing-2', name: 'olive oil', quantity: 1, unit: 'cup', category: 'pantry' },
        ],
        instructions: ['Add olive oil.'],
      }

      render(<RecipeInstructionCard recipe={recipeWithDifferentUnits} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      const ingredientItems = document.querySelectorAll('.ingredients-list__item')
      expect(ingredientItems.length).toBe(2)
    })

    it('merges ingredients case-insensitively', async () => {
      const recipeWithMixedCase: Recipe = {
        ...mockRecipe,
        id: 'mixed-case',
        ingredients: [
          { id: 'ing-1', name: 'Flour', quantity: 2, unit: 'cup', category: 'pantry' },
          { id: 'ing-2', name: 'flour', quantity: 1, unit: 'cup', category: 'pantry' },
        ],
        instructions: ['Mix flour.'],
      }

      render(<RecipeInstructionCard recipe={recipeWithMixedCase} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      const ingredientItems = document.querySelectorAll('.ingredients-list__item')
      expect(ingredientItems.length).toBe(1)
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
