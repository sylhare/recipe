import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '../../../src/components/common/Checkbox'

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox id="test" checked={false} onChange={() => {}} label="Test Label" />)
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
  })

  it('shows checked state', () => {
    render(<Checkbox id="test" checked={true} onChange={() => {}} label="Checked" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked')
  })

  it('shows unchecked state', () => {
    render(<Checkbox id="test" checked={false} onChange={() => {}} label="Unchecked" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked')
  })

  it('calls onChange when clicked', async () => {
    const handleChange = vi.fn()
    render(<Checkbox id="test" checked={false} onChange={handleChange} label="Click me" />)

    await userEvent.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('applies strikethrough style when checked', () => {
    render(<Checkbox id="test" checked={true} onChange={() => {}} label="Done" />)
    expect(screen.getByText('Done')).toHaveClass('checkbox-label--checked')
  })

  it('can be disabled', () => {
    render(<Checkbox id="test" checked={false} onChange={() => {}} label="Disabled" disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })
})
