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

    it('renders servings controls', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      expect(screen.getByText('Servings:')).toBeInTheDocument()
      expect(screen.getByRole('spinbutton')).toHaveValue(4)
    })

    it('renders remove button', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const removeButton = screen.getByRole('button', { name: '✕' })
      expect(removeButton).toBeInTheDocument()
      expect(removeButton).toHaveAttribute('title', 'Remove recipe')
    })
  })

  describe('expand/collapse', () => {
    it('starts expanded by default', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      expect(screen.getByText('▼')).toBeInTheDocument()
      expect(screen.getByText(/Ingredients for/)).toBeInTheDocument()
    })

    it('collapses when header is clicked', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)

      expect(screen.getByText('▶')).toBeInTheDocument()
      expect(screen.queryByText(/Ingredients for/)).not.toBeInTheDocument()
    })

    it('expands again when header is clicked while collapsed', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const header = screen.getByText('Test Recipe').closest('.recipe-instruction-card__header')
      await userEvent.click(header!)
      await userEvent.click(header!)

      expect(screen.getByText('▼')).toBeInTheDocument()
      expect(screen.getByText(/Ingredients for/)).toBeInTheDocument()
    })
  })

  describe('ingredients', () => {
    it('renders all ingredients in the ingredients list', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const ingredientsList = document.querySelector('.ingredients-list')
      expect(ingredientsList).toBeInTheDocument()
      expect(ingredientsList?.textContent).toContain('flour')
      expect(ingredientsList?.textContent).toContain('sugar')
      expect(ingredientsList?.textContent).toContain('eggs')
    })

    it('displays scaled quantities correctly', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={8} />)

      expect(screen.getByText('4 cup')).toBeInTheDocument()
      expect(screen.getByText('2 cup')).toBeInTheDocument()
      expect(screen.getByText('6 piece')).toBeInTheDocument()
    })

    it('displays singular "serving" for 1 serving', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={1} />)

      expect(screen.getByText('Ingredients for 1 serving')).toBeInTheDocument()
    })

    it('displays plural "servings" for multiple servings', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      expect(screen.getByText('Ingredients for 4 servings')).toBeInTheDocument()
    })
  })

  describe('basic instructions', () => {
    it('renders basic instructions when no enhanced instructions', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      expect(screen.getByText('Instructions')).toBeInTheDocument()
      const instructionSteps = document.querySelectorAll('.instruction-step')
      expect(instructionSteps.length).toBe(3)
      expect(instructionSteps[0].textContent).toContain('Mix')
      expect(instructionSteps[0].textContent).toContain('flour')
      expect(instructionSteps[0].textContent).toContain('sugar')
      expect(instructionSteps[1].textContent).toContain('eggs')
      expect(instructionSteps[2].textContent).toContain('Bake at 350°F')
    })

    it('renders the instructions icon', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      expect(screen.getByText('📝')).toBeInTheDocument()
    })
  })

  describe('enhanced instructions', () => {
    it('renders Preparation section with icon', () => {
      render(<RecipeInstructionCard recipe={mockRecipeWithEnhanced} servings={4} />)

      expect(screen.getByText('Preparation')).toBeInTheDocument()
      expect(screen.getByText('🔪')).toBeInTheDocument()
      expect(screen.getByText(/Preheat oven/)).toBeInTheDocument()
    })

    it('renders Cooking section with icon', () => {
      render(<RecipeInstructionCard recipe={mockRecipeWithEnhanced} servings={4} />)

      expect(screen.getByText('Cooking')).toBeInTheDocument()
      expect(screen.getByText('🍳')).toBeInTheDocument()
      expect(screen.getByText(/Mix ingredients/)).toBeInTheDocument()
    })

    it('renders Serving section with icon', () => {
      render(<RecipeInstructionCard recipe={mockRecipeWithEnhanced} servings={4} />)

      expect(screen.getByText('Serving')).toBeInTheDocument()
      expect(screen.getByText('🍽️')).toBeInTheDocument()
      expect(screen.getByText(/Let cool for/)).toBeInTheDocument()
    })

    it('renders Pro Tips section', () => {
      render(<RecipeInstructionCard recipe={mockRecipeWithEnhanced} servings={4} />)

      expect(screen.getByText('Pro Tips')).toBeInTheDocument()
      expect(screen.getByText('💡')).toBeInTheDocument()
      expect(screen.getByText(/room temperature eggs/)).toBeInTheDocument()
      expect(screen.getByText(/Sift the flour/)).toBeInTheDocument()
    })

    it('does not render basic instructions section when enhanced exists', () => {
      render(<RecipeInstructionCard recipe={mockRecipeWithEnhanced} servings={4} />)

      expect(screen.queryByText('📝')).not.toBeInTheDocument()
    })
  })

  describe('ingredient highlighting', () => {
    it('wraps ingredient names in strong tags with quantity annotations', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

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
    it('calls updateServings when NumberInput changes', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      await userEvent.click(screen.getByRole('button', { name: 'Increase' }))

      expect(mockUpdateServings).toHaveBeenCalledWith('test-recipe', 5)
    })

    it('calls deselectRecipe when remove button is clicked', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      await userEvent.click(screen.getByRole('button', { name: '✕' }))

      expect(mockDeselectRecipe).toHaveBeenCalledWith('test-recipe')
    })

    it('does not toggle expansion when clicking servings controls', async () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      await userEvent.click(screen.getByRole('button', { name: 'Increase' }))

      expect(screen.getByText('▼')).toBeInTheDocument()
      expect(screen.getByText(/Ingredients for/)).toBeInTheDocument()
    })
  })

  describe('image error handling', () => {
    it('shows fallback emoji when image fails to load', () => {
      render(<RecipeInstructionCard recipe={mockRecipe} servings={4} />)

      const image = screen.getByRole('img', { name: 'Test Recipe' })
      fireEvent.error(image)

      expect(screen.queryByRole('img', { name: 'Test Recipe' })).not.toBeInTheDocument()
      expect(document.querySelector('.recipe-instruction-card__image-placeholder')).toBeInTheDocument()
    })
  })
})
