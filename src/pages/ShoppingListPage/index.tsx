import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingList, ClearButton } from '../../components/shopping'
import { Button } from '../../components/common'
import './index.css'

export default function ShoppingListPage() {
  const { t } = useTranslation()

  return (
    <div className="shopping-list-page">
      <div className="shopping-list-page__header">
        <div>
          <h1>{t('shopping.title')}</h1>
          <p>{t('shopping.subtitle')}</p>
        </div>
        <div className="shopping-list-page__actions">
          <Link to="/">
            <Button variant="secondary">{t('shopping.addMore')}</Button>
          </Link>
          <ClearButton />
        </div>
      </div>
      <ShoppingList />
    </div>
  )
}
