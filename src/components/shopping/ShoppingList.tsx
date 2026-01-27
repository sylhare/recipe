import * as Accordion from '@radix-ui/react-accordion'
import { useShoppingListContext } from '../../context/ShoppingListContext'
import { ShoppingListItem } from './ShoppingListItem'
import type { IngredientCategory } from '../../types'
import './ShoppingList.css'

const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  produce: 'Produce',
  meat: 'Meat',
  dairy: 'Dairy',
  pantry: 'Pantry',
  spices: 'Spices',
}

const CATEGORY_ORDER: IngredientCategory[] = ['produce', 'meat', 'dairy', 'pantry', 'spices']

export function ShoppingList() {
  const { groupedItems, checkedItems, toggleItem, totalItems, checkedCount } = useShoppingListContext()

  if (totalItems === 0) {
    return (
      <div className="shopping-list-empty">
        <p>No items in your shopping list.</p>
        <p>Select some recipes to get started.</p>
      </div>
    )
  }

  const categories = CATEGORY_ORDER.filter(cat => groupedItems.has(cat))

  return (
    <div className="shopping-list">
      <div className="shopping-list__header">
        <span className="shopping-list__count">
          {checkedCount} of {totalItems} items checked
        </span>
      </div>
      <Accordion.Root type="multiple" defaultValue={categories} className="shopping-list__accordion">
        {categories.map(category => {
          const items = groupedItems.get(category)
          if (!items) return null

          return (
            <Accordion.Item key={category} value={category} className="shopping-list__category">
              <Accordion.Header className="shopping-list__category-header">
                <Accordion.Trigger className="shopping-list__category-trigger">
                  <span>{CATEGORY_LABELS[category]}</span>
                  <span className="shopping-list__category-count">({items.length})</span>
                  <span className="shopping-list__chevron" aria-hidden>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path
                        d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="shopping-list__category-content">
                {items.map(item => (
                  <ShoppingListItem
                    key={item.id}
                    item={item}
                    isChecked={checkedItems.has(item.id)}
                    onToggle={() => toggleItem(item.id)}
                  />
                ))}
              </Accordion.Content>
            </Accordion.Item>
          )
        })}
      </Accordion.Root>
    </div>
  )
}
