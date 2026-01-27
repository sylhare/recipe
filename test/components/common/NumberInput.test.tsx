import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NumberInput } from '../../../src/components/common/NumberInput'

describe('NumberInput', () => {
  it('renders with value', () => {
    render(<NumberInput value={4} onChange={() => {}} />)
    expect(screen.getByRole('spinbutton')).toHaveValue(4)
  })

  it('renders with label', () => {
    render(<NumberInput id="servings" value={4} onChange={() => {}} label="Servings" />)
    expect(screen.getByLabelText('Servings')).toBeInTheDocument()
  })

  it('calls onChange when incrementing', async () => {
    const handleChange = vi.fn()
    render(<NumberInput value={4} onChange={handleChange} />)

    await userEvent.click(screen.getByRole('button', { name: 'Increase' }))
    expect(handleChange).toHaveBeenCalledWith(5)
  })

  it('calls onChange when decrementing', async () => {
    const handleChange = vi.fn()
    render(<NumberInput value={4} onChange={handleChange} />)

    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }))
    expect(handleChange).toHaveBeenCalledWith(3)
  })

  it('respects min value', async () => {
    const handleChange = vi.fn()
    render(<NumberInput value={1} onChange={handleChange} min={1} />)

    const decreaseButton = screen.getByRole('button', { name: 'Decrease' })
    expect(decreaseButton).toBeDisabled()

    await userEvent.click(decreaseButton)
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('respects max value', async () => {
    const handleChange = vi.fn()
    render(<NumberInput value={99} onChange={handleChange} max={99} />)

    const increaseButton = screen.getByRole('button', { name: 'Increase' })
    expect(increaseButton).toBeDisabled()

    await userEvent.click(increaseButton)
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('updates value on direct input', async () => {
    const handleChange = vi.fn()
    render(<NumberInput value={4} onChange={handleChange} />)

    const input = screen.getByRole('spinbutton')
    // fireEvent simulates typing - value gets parsed and validated
    await userEvent.tripleClick(input) // Select all
    await userEvent.keyboard('8')
    expect(handleChange).toHaveBeenCalledWith(8)
  })
})
