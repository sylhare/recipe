import { RecipeList } from '../../components/recipe'
import './index.css'

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-page__header">
        <h1>Choose Your Recipes</h1>
        <p>Select recipes to add ingredients to your shopping list</p>
      </div>
      <RecipeList />
    </div>
  )
}
