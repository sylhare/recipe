import { Link } from 'react-router-dom'
import { ShoppingList, ClearButton } from '../../components/shopping'
import { Button } from '../../components/common'
import './index.css'

export default function ShoppingListPage() {
  return (
    <div className="shopping-list-page">
      <div className="shopping-list-page__header">
        <div>
          <h1>Shopping List</h1>
          <p>Check off items as you shop</p>
        </div>
        <div className="shopping-list-page__actions">
          <Link to="/">
            <Button variant="secondary">Add More Recipes</Button>
          </Link>
          <ClearButton />
        </div>
      </div>
      <ShoppingList />
    </div>
  )
}
