import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShoppingListItem } from '../../../src/components/shopping/ShoppingListItem'
import type { ShoppingListItem as ShoppingListItemType } from '../../../src/types'

const mockItem: ShoppingListItemType = {
  id: 'item-1',
  ingredientName: 'Onion',
  totalQuantity: 2,
  unit: 'piece',
  category: 'produce',
  isChecked: false,
  sourceRecipes: ['recipe-1'],
}

describe('ShoppingListItem', () => {
  it('renders item name and quantity', () => {
    render(<ShoppingListItem item={mockItem} isChecked={false} onToggle={() => {}} />)

    expect(screen.getByText('Onion - 2 piece')).toBeInTheDocument()
  })

  it('shows checked state', () => {
    render(<ShoppingListItem item={mockItem} isChecked={true} onToggle={() => {}} />)

    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked')
  })

  it('calls onToggle when clicked', async () => {
    const handleToggle = vi.fn()
    render(<ShoppingListItem item={mockItem} isChecked={false} onToggle={handleToggle} />)

    await userEvent.click(screen.getByRole('checkbox'))
    expect(handleToggle).toHaveBeenCalledTimes(1)
  })

  it('formats quantity with decimals correctly', () => {
    const itemWithDecimal: ShoppingListItemType = {
      ...mockItem,
      totalQuantity: 1.5,
      unit: 'cup',
    }
    render(<ShoppingListItem item={itemWithDecimal} isChecked={false} onToggle={() => {}} />)

    expect(screen.getByText('Onion - 1.5 cup')).toBeInTheDocument()
  })
})
