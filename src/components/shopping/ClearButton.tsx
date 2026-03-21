import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useShoppingListContext } from '../../context/ShoppingListContext'
import { Button } from '../common/Button'
import './ClearButton.css'

export function ClearButton() {
  const { clearAll, totalItems } = useShoppingListContext()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleClear = () => {
    clearAll()
    navigate('/')
  }

  if (totalItems === 0) {
    return null
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="danger">{t('shopping.clearAll')}</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="alert-dialog-overlay" />
        <AlertDialog.Content className="alert-dialog-content">
          <AlertDialog.Title className="alert-dialog-title">{t('shopping.clearAllTitle')}</AlertDialog.Title>
          <AlertDialog.Description className="alert-dialog-description">
            {t('shopping.clearAllConfirm')}
          </AlertDialog.Description>
          <div className="alert-dialog-buttons">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary">{t('common.cancel')}</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant="danger" onClick={handleClear}>
                {t('shopping.clearAllConfirmLabel')}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
