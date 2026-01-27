import type { ReactNode } from 'react'
import './Card.css'

interface CardProps {
  children: ReactNode
  className?: string
  selected?: boolean
}

export function Card({ children, className = '', selected = false }: CardProps) {
  return (
    <div className={`card ${selected ? 'card--selected' : ''} ${className}`}>
      {children}
    </div>
  )
}
