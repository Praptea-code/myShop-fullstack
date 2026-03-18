import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { createContext, useContext, useState, useCallback } from 'react'
import Home from './pages/Home'
import Products from './pages/Products'
import OrderForm from './pages/OrderForm'
import TrackOrder from './pages/TrackOrder'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Account from './pages/Account'
import Admin from './pages/Admin'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/Contactus'
import Cart from './pages/Cart'

export const AuthContext = createContext(null)
export const CartContext = createContext(null)
export function useAuth() { return useContext(AuthContext) }
export function useCart() { return useContext(CartContext) }

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
  const [cartItems, setCartItems] = useState([])
  const [cartToast, setCartToast] = useState(null) // { name, image }

  const login = (userData, tokenData) => {
    setUser(userData)
    setToken(tokenData)
    localStorage.setItem('volt_user', JSON.stringify(userData))
    localStorage.setItem('volt_token', tokenData)
  }
  const logout = () => {
    setUser(null); setToken(null)
    localStorage.removeItem('volt_user')
    localStorage.removeItem('volt_token')
  }

  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const exists = prev.find(i => i._id === product._id)
      if (exists) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
    setCartToast(product)
    setTimeout(() => setCartToast(null), 3000)
  }, [])

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(i => i._id !== id))
  }, [])

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return
    setCartItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i))
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeFromCart, updateQty, clearCart }}>
        {/* Cart toast notification */}
        {cartToast && (
          <div style={{
            position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
            background: '#fff', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '14px 18px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
            display: 'flex', alignItems: 'center', gap: '12px',
            animation: 'slideInRight 0.3s ease',
            maxWidth: '320px',
          }}>
            <style>{`@keyframes slideInRight { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }`}</style>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f5e8e8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {cartToast.image
                ? <img src={cartToast.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--red)"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-14.83-3h14.83l1.68-8H5.21L4.17 3H1v2h2l3.6 7.59L5.25 15c-.16.28-.25.61-.25.96C5 17.1 5.9 18 7 18h13v-2H7.42c-.13 0-.25-.11-.25-.25l.03-.12.9-1.63z"/></svg>
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px', lineHeight: 1.3 }}>
                Added to cart!
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--light)', lineHeight: 1.3 }}>{cartToast.name}</div>
            </div>
          
          </div>
        )}

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order/:productId" element={<PrivateRoute><OrderForm /></PrivateRoute>} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </BrowserRouter>
      </CartContext.Provider>
    </AuthContext.Provider>
  )
}