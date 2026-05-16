interface IngredientsListItem {
  id: string
  quantity: string
  unit: string
  name: string
}

interface IngredientsListProps {
  items: IngredientsListItem[]
}

export function IngredientsList({ items }: IngredientsListProps) {
  return (
    <ul className="ingredients-list">
      {items.map(item => (
        <li key={item.id} className="ingredients-list__item">
          <span className="ingredients-list__quantity">
            {item.quantity} {item.unit}
          </span>
          <span className="ingredients-list__name">{item.name}</span>
        </li>
      ))}
    </ul>
  )
}
