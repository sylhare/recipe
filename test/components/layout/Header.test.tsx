import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '../../../src/components/layout/Header'
import i18next from '../../../src/i18n/index'

vi.mock('../../../src/context/RecipeContext', () => ({
  useRecipeContext: () => ({
    selections: [],
  }),
}))

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )
}

describe('Header', () => {
  beforeEach(async () => {
    await act(async () => {
      await i18next.changeLanguage('en')
    })
  })

  describe('nav labels', () => {
    it('renders English nav labels by default', () => {
      renderHeader()

      expect(screen.getByRole('link', { name: 'Recipes' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Cooking/ })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Shopping List' })).toBeInTheDocument()
    })
  })

  describe('language switcher', () => {
    it('renders EN and FR buttons', () => {
      renderHeader()

      expect(screen.getByRole('button', { name: 'Switch to EN' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Switch to FR' })).toBeInTheDocument()
    })

    it('EN button has active class by default', () => {
      renderHeader()

      const enBtn = screen.getByRole('button', { name: 'Switch to EN' })
      expect(enBtn).toHaveClass('header__lang-btn--active')
    })

    it('calls i18n.changeLanguage with fr when FR button is clicked', async () => {
      renderHeader()

      await userEvent.click(screen.getByRole('button', { name: 'Switch to FR' }))

      expect(i18next.language).toEqual('fr')
    })

    it('nav labels update to French after clicking FR', async () => {
      renderHeader()

      await userEvent.click(screen.getByRole('button', { name: 'Switch to FR' }))

      expect(screen.getByRole('link', { name: 'Recettes' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Liste de courses' })).toBeInTheDocument()
    })

    it('persists language choice to localStorage', async () => {
      renderHeader()

      await userEvent.click(screen.getByRole('button', { name: 'Switch to FR' }))

      expect(localStorage.getItem('language')).toEqual('fr')
    })

    it('switches back to English when EN button is clicked', async () => {
      renderHeader()

      await userEvent.click(screen.getByRole('button', { name: 'Switch to FR' }))
      await userEvent.click(screen.getByRole('button', { name: 'Switch to EN' }))

      expect(i18next.language).toEqual('en')
      expect(screen.getByRole('link', { name: 'Recipes' })).toBeInTheDocument()
    })
  })
})
