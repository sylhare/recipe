import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RecipeProvider } from './context/RecipeContext'
import { ShoppingListProvider } from './context/ShoppingListContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ShoppingListPage from './pages/ShoppingListPage'

function App() {
  return (
    <BrowserRouter>
      <RecipeProvider>
        <ShoppingListProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shopping-list" element={<ShoppingListPage />} />
            </Routes>
          </Layout>
        </ShoppingListProvider>
      </RecipeProvider>
    </BrowserRouter>
  )
}

export default App
