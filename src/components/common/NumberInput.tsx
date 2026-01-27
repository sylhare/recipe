import type { InputHTMLAttributes } from 'react'
import './NumberInput.css'

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
}

export function NumberInput({
  value,
  onChange,
  min = 1,
  max = 99,
  label,
  id,
  ...props
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10)
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue)
    }
  }

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  return (
    <div className="number-input-wrapper">
      {label && (
        <label className="number-input-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="number-input-controls">
        <button
          type="button"
          className="number-input-button"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label="Decrease"
        >
          −
        </button>
        <input
          type="number"
          className="number-input"
          id={id}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          {...props}
        />
        <button
          type="button"
          className="number-input-button"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label="Increase"
        >
          +
        </button>
      </div>
    </div>
  )
}
