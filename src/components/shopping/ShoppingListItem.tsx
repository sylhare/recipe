import { useState } from 'react'
import type { ShoppingListItem as ShoppingListItemType } from '../../types'
import { Checkbox } from '../common/Checkbox'
import { formatQuantity } from '../../utils/ingredientAggregator'
import { getIngredientImageUrl } from '../../utils/ingredientImage'
import './ShoppingListItem.css'

interface ShoppingListItemProps {
  item: ShoppingListItemType
  isChecked: boolean
  onToggle: () => void
}

export function ShoppingListItem({ item, isChecked, onToggle }: ShoppingListItemProps) {
  const [imageError, setImageError] = useState(false)
  const imageUrl = getIngredientImageUrl(item.ingredientName)
  const firstLetter = item.ingredientName.charAt(0).toUpperCase()

  return (
    <div className="shopping-list-item" data-testid={`shopping-item-${item.id}`}>
      <div className="shopping-list-item-image">
        {imageError ? (
          <div className="shopping-list-item-placeholder">{firstLetter}</div>
        ) : (
          <img
            src={imageUrl}
            alt={item.ingredientName}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <Checkbox
        id={`item-${item.id}`}
        checked={isChecked}
        onChange={onToggle}
        label={`${item.ingredientName} - ${formatQuantity(item.totalQuantity, item.unit)}`}
      />
    </div>
  )
}
