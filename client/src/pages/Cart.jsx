import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { Footer } from './Home'
import { useCart, useAuth } from '../App'
import { useIsMobile } from '../hooks/useWindowWidth'
import API_BASE from '../api'

const CARD_BG = ['#f5e8e8','#fdf3e0','#eae8f5','#e8f5ea','#e8f5f5','#f5e8f5']

export default function Cart() {
  const { cartItems, removeFromCart, updateQty, clearCart, cartCount } = useCart()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [form, setForm] = useState({ customerName: user?.name || '', phone: user?.phone || '', address: '' })
  const [screenshot, setScreenshot] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)

  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0)

  const handleFile = e => {
    const file = e.target.files[0]
    setScreenshot(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!form.customerName || !form.phone || !form.address || !screenshot) {
      alert('Please fill all fields and upload your payment screenshot')
      return
    }
    setLoading(true)
    try {
      for (const item of cartItems) {
        const data = new FormData()
        data.append('customerName', form.customerName)
        data.append('phone', form.phone)
        data.append('address', form.address)
        data.append('product', item._id)
        data.append('screenshot', screenshot)
        await axios.post(`${API_BASE}/api/orders`, data, { headers: { Authorization: `Bearer ${token}` } })
      }
      setSubmitted(true)
      clearCart()
    } catch (e) { alert('Something went wrong, please try again.') }
    setLoading(false)
  }

  const inp = { width: '100%', padding: '10px 12px', background: 'var(--soft)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--ink)', outline: 'none', fontFamily: 'var(--sans)' }

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '60px 20px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#15803d"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)' }}>Order placed!</div>
        <p style={{ fontSize: '0.82rem', color: 'var(--light)', textAlign: 'center', maxWidth: '300px', lineHeight: 1.7 }}>We'll verify your payment and reach out soon.</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/account')} style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: '4px', padding: '11px 18px', cursor: 'pointer' }}>Track order</button>
          <button onClick={() => navigate('/products')} style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '11px 18px', cursor: 'pointer' }}>Shop more</button>
        </div>
      </div>
      <Footer isMobile={isMobile} />
    </div>
  )

  if (cartItems.length === 0) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '56px 40px', textAlign: 'center', maxWidth: '380px', width: '100%' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>Your cart is empty</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--light)', marginBottom: '20px', lineHeight: 1.6 }}>Browse our collection and add something you like.</p>
          <button onClick={() => navigate('/products')} style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '11px 24px', cursor: 'pointer' }}>Browse products →</button>
        </div>
      </div>
      <Footer isMobile={isMobile} />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* QR Modal */}
      {qrOpen && (
        <div onClick={() => setQrOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', boxShadow: '0 24px 64px rgba(0,0,0,0.32)', maxWidth: '320px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)' }}>Scan &amp; Pay</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>Rs. {total.toLocaleString()}</div>
              </div>
              <button onClick={() => setQrOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--soft)', cursor: 'pointer', fontSize: '1rem', color: 'var(--light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <img src="/qr.png" alt="Payment QR Code" style={{ width: '240px', height: '240px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border)' }} />
            <div style={{ fontSize: '0.68rem', color: 'var(--light)', textAlign: 'center', lineHeight: 1.6 }}>
              eSewa · Khalti · Bank Transfer<br />
              <span style={{ color: 'var(--red)', fontWeight: 600 }}>Upload screenshot below after paying</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, padding: isMobile ? '16px' : '28px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '960px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', alignItems: 'start' }}>

          {/* Cart items */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)' }}>Cart ({cartCount})</div>
              <button onClick={clearCart} style={{ fontSize: '0.62rem', color: 'var(--light)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cartItems.map((item, i) => (
                <div key={item._id} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '7px', background: CARD_BG[i % CARD_BG.length], flexShrink: 0, overflow: 'hidden' }}>
                    {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--red)' }}>Rs. {(item.price * item.qty).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <button onClick={() => item.qty === 1 ? removeFromCart(item._id) : updateQty(item._id, item.qty - 1)} style={{ width: '26px', height: '26px', borderRadius: '5px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: '1rem' }}>−</button>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', minWidth: '16px', textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)} style={{ width: '26px', height: '26px', borderRadius: '5px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: '1rem' }}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} style={{ width: '26px', height: '26px', borderRadius: '5px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', color: 'var(--light)', flexShrink: 0 }}>×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: isMobile ? 'static' : 'sticky', top: '80px' }}>
            {/* Summary */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>Order Summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' }}>
                {cartItems.map(item => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--mid)' }}>
                    <span style={{ flex: 1, marginRight: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name} × {item.qty}</span>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Rs. {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)' }}>Total</span>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink)' }}>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Details form */}
            {user ? (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '10px' }}>Your details</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <input style={inp} placeholder="Full name" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} />
                  <input style={inp} placeholder="Phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  <input style={inp} placeholder="Delivery address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                </div>
              </div>
            ) : (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>Log in to place your order</div>
                <button onClick={() => navigate('/login')} style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: '4px', padding: '9px 18px', cursor: 'pointer' }}>Log in →</button>
              </div>
            )}

            {/* QR */}
            {user && (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '10px' }}>Scan &amp; Pay</div>
                <div onClick={() => setQrOpen(true)} style={{ width: '130px', height: '130px', margin: '0 auto 8px', cursor: 'pointer', borderRadius: '10px', overflow: 'hidden', border: '2px solid var(--border)' }}>
                  <img src="/qr.png" alt="Payment QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>Rs. {total.toLocaleString()}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--light)', marginBottom: '8px' }}>eSewa · Khalti · Bank transfer</div>
                <button onClick={() => setQrOpen(true)} style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: 'transparent', color: 'var(--red)', border: '1px solid var(--red)', borderRadius: '4px', padding: '5px 12px', cursor: 'pointer' }}>Enlarge QR ↗</button>
              </div>
            )}

            {/* Screenshot upload */}
            {user && (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '8px' }}>Upload payment screenshot</div>
                <label style={{ display: 'block', background: 'var(--soft)', border: `1.5px dashed ${preview ? 'var(--ink)' : 'var(--border)'}`, borderRadius: '8px', padding: '16px', textAlign: 'center', cursor: 'pointer' }}>
                  <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                  {preview ? <img src={preview} alt="preview" style={{ maxHeight: '90px', borderRadius: '6px', objectFit: 'contain' }} />
                    : <><div style={{ fontSize: '1rem', color: 'var(--light)', marginBottom: '4px' }}>↑</div><div style={{ fontSize: '0.65rem', color: 'var(--light)' }}>Click to upload screenshot</div></>}
                </label>
              </div>
            )}

            {user && (
              <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: loading ? '#ccc' : 'var(--red)', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Placing order...' : 'Place order →'}
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer isMobile={isMobile} />
    </div>
  )
}