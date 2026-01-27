import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import './Button.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', children, className = '', ...props }, ref) => {
    return (
      <button ref={ref} className={`button button--${variant} ${className}`} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
