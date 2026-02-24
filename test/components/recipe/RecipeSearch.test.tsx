import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecipeSearch } from '../../../src/components/recipe/RecipeSearch'

describe('RecipeSearch', () => {
  it('renders search input with correct placeholder', () => {
    render(<RecipeSearch searchQuery="" onSearchChange={vi.fn()} />)

    expect(screen.getByPlaceholderText('Search by name or ingredient…')).toBeInTheDocument()
  })

  it('renders search label', () => {
    render(<RecipeSearch searchQuery="" onSearchChange={vi.fn()} />)

    expect(screen.getByLabelText('Search')).toBeInTheDocument()
  })

  it('calls onSearchChange when typing', async () => {
    const onSearchChange = vi.fn()
    render(<RecipeSearch searchQuery="" onSearchChange={onSearchChange} />)

    await userEvent.type(screen.getByLabelText('Search'), 'garlic')

    expect(onSearchChange).toHaveBeenCalled()
  })

  it('shows clear button when searchQuery is non-empty', () => {
    render(<RecipeSearch searchQuery="garlic" onSearchChange={vi.fn()} />)

    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('does not show clear button when searchQuery is empty', () => {
    render(<RecipeSearch searchQuery="" onSearchChange={vi.fn()} />)

    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('calls onSearchChange with empty string when clear is clicked', async () => {
    const onSearchChange = vi.fn()
    render(<RecipeSearch searchQuery="garlic" onSearchChange={onSearchChange} />)

    await userEvent.click(screen.getByLabelText('Clear search'))

    expect(onSearchChange).toHaveBeenCalledWith('')
  })

  it('reflects current searchQuery value in input', () => {
    render(<RecipeSearch searchQuery="pasta" onSearchChange={vi.fn()} />)

    expect(screen.getByLabelText('Search')).toHaveValue('pasta')
  })
})
