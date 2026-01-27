import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { useNavigate } from 'react-router-dom'
import { useShoppingListContext } from '../../context/ShoppingListContext'
import { Button } from '../common/Button'
import './ClearButton.css'

export function ClearButton() {
  const { clearAll, totalItems } = useShoppingListContext()
  const navigate = useNavigate()

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
        <Button variant="danger">Clear All</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="alert-dialog-overlay" />
        <AlertDialog.Content className="alert-dialog-content">
          <AlertDialog.Title className="alert-dialog-title">Clear Shopping List</AlertDialog.Title>
          <AlertDialog.Description className="alert-dialog-description">
            This will remove all selected recipes and checked items. Are you sure you want to
            continue?
          </AlertDialog.Description>
          <div className="alert-dialog-buttons">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary">Cancel</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant="danger" onClick={handleClear}>
                Yes, Clear All
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
