import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import OrderForm from './pages/OrderForm'
import Admin from './pages/Admin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order/:productId" element={<OrderForm />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App