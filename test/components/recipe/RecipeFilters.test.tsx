import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecipeFilters } from '../../../src/components/recipe/RecipeFilters'

describe('RecipeFilters', () => {
  const defaultProps = {
    dishTypeFilter: 'all' as const,
    proteinTypeFilter: 'all' as const,
    onDishTypeChange: vi.fn(),
    onProteinTypeChange: vi.fn(),
    resultCount: 10,
    totalCount: 50,
  }

  it('renders dish type and protein type dropdowns', () => {
    render(<RecipeFilters {...defaultProps} />)

    expect(screen.getByLabelText('Dish Type')).toBeInTheDocument()
    expect(screen.getByLabelText('Protein')).toBeInTheDocument()
  })

  it('displays total count when no filters active', () => {
    render(<RecipeFilters {...defaultProps} />)

    expect(screen.getByText('50 recipes')).toBeInTheDocument()
  })

  it('displays filtered count when filters are active', () => {
    render(<RecipeFilters {...defaultProps} dishTypeFilter="pasta" />)

    expect(screen.getByText('Showing 10 of 50 recipes')).toBeInTheDocument()
  })

  it('calls onDishTypeChange when dish type is selected', async () => {
    const onDishTypeChange = vi.fn()
    render(<RecipeFilters {...defaultProps} onDishTypeChange={onDishTypeChange} />)

    await userEvent.selectOptions(screen.getByLabelText('Dish Type'), 'pasta')

    expect(onDishTypeChange).toHaveBeenCalledWith('pasta')
  })

  it('calls onProteinTypeChange when protein type is selected', async () => {
    const onProteinTypeChange = vi.fn()
    render(<RecipeFilters {...defaultProps} onProteinTypeChange={onProteinTypeChange} />)

    await userEvent.selectOptions(screen.getByLabelText('Protein'), 'beef')

    expect(onProteinTypeChange).toHaveBeenCalledWith('beef')
  })

  it('does not show clear button when no filters active', () => {
    render(<RecipeFilters {...defaultProps} />)

    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument()
  })

  it('shows clear button when dish type filter is active', () => {
    render(<RecipeFilters {...defaultProps} dishTypeFilter="salad" />)

    expect(screen.getByText('Clear Filters')).toBeInTheDocument()
  })

  it('shows clear button when protein type filter is active', () => {
    render(<RecipeFilters {...defaultProps} proteinTypeFilter="chicken" />)

    expect(screen.getByText('Clear Filters')).toBeInTheDocument()
  })

  it('clears both filters when clear button is clicked', async () => {
    const onDishTypeChange = vi.fn()
    const onProteinTypeChange = vi.fn()
    render(
      <RecipeFilters
        {...defaultProps}
        dishTypeFilter="pasta"
        proteinTypeFilter="beef"
        onDishTypeChange={onDishTypeChange}
        onProteinTypeChange={onProteinTypeChange}
      />
    )

    await userEvent.click(screen.getByText('Clear Filters'))

    expect(onDishTypeChange).toHaveBeenCalledWith('all')
    expect(onProteinTypeChange).toHaveBeenCalledWith('all')
  })

  it('renders all dish type options', () => {
    render(<RecipeFilters {...defaultProps} />)

    const dishTypeSelect = screen.getByLabelText('Dish Type')
    expect(dishTypeSelect).toContainHTML('All Dishes')
    expect(dishTypeSelect).toContainHTML('Salads')
    expect(dishTypeSelect).toContainHTML('Pasta')
    expect(dishTypeSelect).toContainHTML('Rice Dishes')
    expect(dishTypeSelect).toContainHTML('Noodles')
    expect(dishTypeSelect).toContainHTML('Soups')
  })

  it('renders all protein type options', () => {
    render(<RecipeFilters {...defaultProps} />)

    const proteinSelect = screen.getByLabelText('Protein')
    expect(proteinSelect).toContainHTML('All Proteins')
    expect(proteinSelect).toContainHTML('Beef')
    expect(proteinSelect).toContainHTML('Chicken')
    expect(proteinSelect).toContainHTML('Pork')
    expect(proteinSelect).toContainHTML('Fish')
    expect(proteinSelect).toContainHTML('Vegetarian')
  })

  it('displays selected dish type filter value', () => {
    render(<RecipeFilters {...defaultProps} dishTypeFilter="noodles" />)

    expect(screen.getByLabelText('Dish Type')).toHaveValue('noodles')
  })

  it('displays selected protein type filter value', () => {
    render(<RecipeFilters {...defaultProps} proteinTypeFilter="lamb" />)

    expect(screen.getByLabelText('Protein')).toHaveValue('lamb')
  })
})
