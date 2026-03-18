import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { Footer } from './Home'
import { useCart } from '../App'
import { useAuth } from '../App'

const CARD_BG = ['#f5e8e8','#fdf3e0','#eae8f5','#e8f5ea','#e8f5f5','#f5e8f5']

export default function Cart() {
  const { cartItems, removeFromCart, updateQty, clearCart, cartCount } = useCart()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ customerName: user?.name || '', phone: user?.phone || '', address: '' })
  const [screenshot, setScreenshot] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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
        await axios.post('http://localhost:5000/api/orders', data, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setSubmitted(true)
      clearCart()
    } catch (e) { alert('Something went wrong, please try again.') }
    setLoading(false)
  }

  const inp = {
    width: '100%', padding: '9px 12px',
    background: 'var(--soft)', border: '1px solid var(--border)',
    borderRadius: '6px', fontSize: '0.78rem', color: 'var(--ink)',
    outline: 'none', fontFamily: 'var(--sans)',
    transition: 'border-color 0.15s',
  }

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '80px 40px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#15803d"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)' }}>Order placed!</div>
        <p style={{ fontSize: '0.82rem', color: 'var(--light)', textAlign: 'center', maxWidth: '300px', lineHeight: 1.7 }}>We'll verify your payment and reach out soon.</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/account')} style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: '4px', padding: '11px 20px', cursor: 'pointer' }}>Track order</button>
          <button onClick={() => navigate('/products')} style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '11px 20px', cursor: 'pointer' }}>Shop more</button>
        </div>
      </div>
      <Footer />
    </div>
  )

  // Empty cart — full centered layout
  if (cartItems.length === 0) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 40px' }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '72px 60px', textAlign: 'center', maxWidth: '420px', width: '100%' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--light)"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-14.83-3h14.83l1.68-8H5.21L4.17 3H1v2h2l3.6 7.59L5.25 15c-.16.28-.25.61-.25.96C5 17.1 5.9 18 7 18h13v-2H7.42c-.13 0-.25-.11-.25-.25l.03-.12.9-1.63z"/></svg>
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>Your cart is empty</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--light)', marginBottom: '24px', lineHeight: 1.6 }}>Browse our collection and add something you like.</p>
          <button onClick={() => navigate('/products')}
            style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '11px 28px', cursor: 'pointer', transition: 'background 0.18s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dark)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
          >Browse products →</button>
        </div>
      </div>
      <Footer />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '32px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '100%',
          maxWidth: '960px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          alignItems: 'start',
        }}>

          {/* ── LEFT: cart items ── */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)' }}>
                Cart items <span style={{ fontWeight: 400, marginLeft: '4px' }}>({cartCount})</span>
              </div>
              <button onClick={clearCart} style={{ fontSize: '0.62rem', color: 'var(--light)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear cart</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cartItems.map((item, i) => (
                <div key={item._id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '7px', background: CARD_BG[i % CARD_BG.length], flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(0,0,0,0.12)"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {[item.flavour, item.puffs, item.nicotine].filter(Boolean).map((t, ti) => (
                        <span key={ti} style={{ fontSize: '0.52rem', color: '#888', background: '#fff', border: '1px solid var(--border)', padding: '1px 5px', borderRadius: '2px' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--red)', flexShrink: 0 }}>Rs. {(item.price * item.qty).toLocaleString()}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                    <button onClick={() => item.qty === 1 ? removeFromCart(item._id) : updateQty(item._id, item.qty - 1)}
                      style={{ width: '24px', height: '24px', borderRadius: '5px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--ink)' }}
                    >−</button>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)', minWidth: '14px', textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)}
                      style={{ width: '24px', height: '24px', borderRadius: '5px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--ink)' }}
                    >+</button>
                  </div>
                  <button onClick={() => removeFromCart(item._id)}
                    style={{ width: '24px', height: '24px', borderRadius: '5px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', color: 'var(--light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fde8e9'; e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--light)' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: summary → scan & pay → upload → details → button ── */}
          <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Order Summary */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 18px' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>Order Summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                {cartItems.map(item => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--mid)' }}>
                    <span style={{ flex: 1, marginRight: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name} × {item.qty}</span>
                    <span style={{ fontWeight: 600, color: 'var(--ink)', flexShrink: 0 }}>Rs. {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)' }}>Total</span>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink)' }}>Rs. {total.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: '0.58rem', color: 'var(--light)', marginTop: '2px' }}>Free delivery in KTM above Rs. 3,000</div>
              </div>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {['eSewa', 'Khalti', 'Bank Transfer'].map(p => (
                  <span key={p} style={{ fontSize: '0.56rem', fontWeight: 600, color: 'var(--light)', background: 'var(--soft)', border: '1px solid var(--border)', padding: '2px 7px', borderRadius: '3px' }}>{p}</span>
                ))}
              </div>
            </div>


            {/* Your Details */}
            {user ? (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '10px' }}>Your details</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <input style={inp} placeholder="Full name" value={form.customerName}
                    onChange={e => setForm({ ...form, customerName: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'var(--ink)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <input style={inp} placeholder="Phone number" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'var(--ink)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <input style={inp} placeholder="Delivery address" value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'var(--ink)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              </div>
            ) : (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>Log in to place your order</div>
                <p style={{ fontSize: '0.72rem', color: 'var(--light)', marginBottom: '12px' }}>You need an account to checkout.</p>
                <button onClick={() => navigate('/login')} style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: '4px', padding: '9px 18px', cursor: 'pointer' }}>Log in →</button>
              </div>
            )}

            {/* Scan & Pay */}
            {user && (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '10px' }}>Scan &amp; Pay</div>
                <div style={{ width: '140px', height: '140px', background: 'var(--soft)', border: '1px solid var(--border)', borderRadius: '8px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'var(--light)' }}>
                  Your QR here
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>Rs. {total.toLocaleString()}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--light)' }}>eSewa · Khalti · Bank transfer</div>
              </div>
            )}

            {/* Upload Screenshot */}
            {user && (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '8px' }}>Upload payment screenshot</div>
                <label
                  style={{ display: 'block', background: 'var(--soft)', border: `1.5px dashed ${preview ? 'var(--ink)' : 'var(--border)'}`, borderRadius: '8px', padding: '18px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.18s' }}
                  onMouseEnter={e => { if (!preview) e.currentTarget.style.borderColor = 'var(--red)' }}
                  onMouseLeave={e => { if (!preview) e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                  {preview
                    ? <img src={preview} alt="preview" style={{ maxHeight: '100px', borderRadius: '6px', objectFit: 'contain' }} />
                    : <>
                      <div style={{ fontSize: '1.1rem', color: 'var(--light)', marginBottom: '4px' }}>↑</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--light)' }}>Click to upload screenshot</div>
                    </>
                  }
                </label>
              </div>
            )}


            {/* Place Order Button */}
            {user && (
              <button onClick={handleSubmit} disabled={loading}
                style={{ width: '100%', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: loading ? '#ccc' : 'var(--red)', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.18s' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--red-dark)' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--red)' }}
              >{loading ? 'Placing order...' : 'Place order →'}</button>
            )}

          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}