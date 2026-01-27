import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { ClearButton } from '../../../src/components/shopping/ClearButton'
import * as ShoppingListContext from '../../../src/context/ShoppingListContext'

vi.mock('../../../src/context/ShoppingListContext', () => ({
  useShoppingListContext: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('ClearButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when no items', () => {
    vi.mocked(ShoppingListContext.useShoppingListContext).mockReturnValue({
      items: [],
      groupedItems: new Map(),
      checkedItems: new Set(),
      toggleItem: vi.fn(),
      clearChecked: vi.fn(),
      clearAll: vi.fn(),
      totalItems: 0,
      checkedCount: 0,
    })

    const { container } = render(
      <BrowserRouter>
        <ClearButton />
      </BrowserRouter>
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders button when there are items', () => {
    vi.mocked(ShoppingListContext.useShoppingListContext).mockReturnValue({
      items: [],
      groupedItems: new Map(),
      checkedItems: new Set(),
      toggleItem: vi.fn(),
      clearChecked: vi.fn(),
      clearAll: vi.fn(),
      totalItems: 5,
      checkedCount: 0,
    })

    render(
      <BrowserRouter>
        <ClearButton />
      </BrowserRouter>
    )

    expect(screen.getByRole('button', { name: 'Clear All' })).toBeInTheDocument()
  })

  it('shows confirmation dialog when clicked', async () => {
    vi.mocked(ShoppingListContext.useShoppingListContext).mockReturnValue({
      items: [],
      groupedItems: new Map(),
      checkedItems: new Set(),
      toggleItem: vi.fn(),
      clearChecked: vi.fn(),
      clearAll: vi.fn(),
      totalItems: 5,
      checkedCount: 0,
    })

    render(
      <BrowserRouter>
        <ClearButton />
      </BrowserRouter>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Clear All' }))

    expect(screen.getByText('Clear Shopping List')).toBeInTheDocument()
    expect(screen.getByText(/This will remove all selected recipes/)).toBeInTheDocument()
  })

  it('calls clearAll and navigates when confirmed', async () => {
    const clearAll = vi.fn()
    vi.mocked(ShoppingListContext.useShoppingListContext).mockReturnValue({
      items: [],
      groupedItems: new Map(),
      checkedItems: new Set(),
      toggleItem: vi.fn(),
      clearChecked: vi.fn(),
      clearAll,
      totalItems: 5,
      checkedCount: 0,
    })

    render(
      <BrowserRouter>
        <ClearButton />
      </BrowserRouter>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Clear All' }))
    await userEvent.click(screen.getByRole('button', { name: 'Yes, Clear All' }))

    expect(clearAll).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
