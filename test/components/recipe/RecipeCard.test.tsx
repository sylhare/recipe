import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecipeCard } from '../../../src/components/recipe/RecipeCard'
import type { Recipe } from '../../../src/types'

const mockRecipe: Recipe = {
  id: 'test-recipe',
  name: 'Test Recipe',
  description: 'A delicious test recipe',
  imageUrl: '/test-image.png',
  defaultServings: 4,
  ingredients: [],
  instructions: [],
}

describe('RecipeCard', () => {
  const defaultProps = {
    recipe: mockRecipe,
    isSelected: false,
    servings: undefined,
    onSelect: vi.fn(),
    onDeselect: vi.fn(),
    onServingsChange: vi.fn(),
  }

  it('renders recipe name and description', () => {
    render(<RecipeCard {...defaultProps} />)

    expect(screen.getByText('Test Recipe')).toBeInTheDocument()
    expect(screen.getByText('A delicious test recipe')).toBeInTheDocument()
  })

  it('renders recipe image', () => {
    render(<RecipeCard {...defaultProps} />)

    const image = screen.getByRole('img', { name: 'Test Recipe' })
    expect(image).toHaveAttribute('src', '/test-image.png')
  })

  it('shows checkbox as unchecked when not selected', () => {
    render(<RecipeCard {...defaultProps} />)

    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked')
  })

  it('shows checkbox as checked when selected', () => {
    render(<RecipeCard {...defaultProps} isSelected={true} servings={4} />)

    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked')
  })

  it('calls onSelect when checkbox is checked', async () => {
    const onSelect = vi.fn()
    render(<RecipeCard {...defaultProps} onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('checkbox'))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('calls onDeselect when checkbox is unchecked', async () => {
    const onDeselect = vi.fn()
    render(<RecipeCard {...defaultProps} isSelected={true} servings={4} onDeselect={onDeselect} />)

    await userEvent.click(screen.getByRole('checkbox'))
    expect(onDeselect).toHaveBeenCalledTimes(1)
  })

  it('shows servings input only when selected', () => {
    const { rerender } = render(<RecipeCard {...defaultProps} />)

    expect(screen.queryByLabelText('Servings:')).not.toBeInTheDocument()

    rerender(<RecipeCard {...defaultProps} isSelected={true} servings={4} />)

    expect(screen.getByLabelText('Servings:')).toBeInTheDocument()
  })

  it('calls onServingsChange when servings is updated', async () => {
    const onServingsChange = vi.fn()
    render(
      <RecipeCard
        {...defaultProps}
        isSelected={true}
        servings={4}
        onServingsChange={onServingsChange}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Increase' }))
    expect(onServingsChange).toHaveBeenCalledWith(5)
  })
})
