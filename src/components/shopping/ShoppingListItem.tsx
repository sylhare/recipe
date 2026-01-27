import type { ShoppingListItem as ShoppingListItemType } from '../../types'
import { Checkbox } from '../common/Checkbox'
import { formatQuantity } from '../../utils/ingredientAggregator'
import './ShoppingListItem.css'

interface ShoppingListItemProps {
  item: ShoppingListItemType
  isChecked: boolean
  onToggle: () => void
}

export function ShoppingListItem({ item, isChecked, onToggle }: ShoppingListItemProps) {
  return (
    <div className="shopping-list-item" data-testid={`shopping-item-${item.id}`}>
      <Checkbox
        id={`item-${item.id}`}
        checked={isChecked}
        onChange={onToggle}
        label={`${item.ingredientName} - ${formatQuantity(item.totalQuantity, item.unit)}`}
      />
    </div>
  )
}
