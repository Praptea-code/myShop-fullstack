import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { createContext, useContext, useState } from 'react'
import Home from './pages/Home'
import Products from './pages/Products'
import OrderForm from './pages/OrderForm'
import TrackOrder from './pages/TrackOrder'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Account from './pages/Account'
import Admin from './pages/Admin'

export const AuthContext = createContext(null)
export function useAuth() { return useContext(AuthContext) }

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  return user?.isAdmin ? children : <Navigate to="/" />
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('volt_user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('volt_token') || null)

  const login = (userData, tokenData) => {
    setUser(userData); setToken(tokenData)
    localStorage.setItem('volt_user', JSON.stringify(userData))
    localStorage.setItem('volt_token', tokenData)
  }

  const logout = () => {
    setUser(null); setToken(null)
    localStorage.removeItem('volt_user')
    localStorage.removeItem('volt_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/order/:productId" element={<PrivateRoute><OrderForm /></PrivateRoute>} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}