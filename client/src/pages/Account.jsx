import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth, useCart } from '../App'
import Navbar from '../components/Navbar'
import { Footer } from './Home'
import { useIsMobile } from '../hooks/useWindowWidth'
import API_BASE from '../api'

const STATUSES = ['pending', 'verified', 'dispatched', 'delivered']
const STATUS_LABELS = { pending: 'Order placed', verified: 'Payment verified', dispatched: 'Out for delivery', delivered: 'Delivered' }
const STATUS_DESCS = { pending: 'We received your order', verified: 'Confirmed', dispatched: 'On the way', delivered: 'Enjoy!' }
const STATUS_COLORS = { pending: '#b45309', verified: '#0369a1', dispatched: '#7c3aed', delivered: '#15803d' }
const STATUS_BG = { pending: '#fef3e2', verified: '#e0f2fe', dispatched: '#ede9fe', delivered: '#dcfce7' }
const CARD_COLORS = ['#f5e8e8', '#fdf3e0', '#eae8f5', '#e8f5ea', '#e8f5f5', '#f5e8f5']

export default function Account() {
  const { user, token } = useAuth()
  const { cartItems, removeFromCart, updateQty, clearCart, cartCount } = useCart()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    axios.get(`${API_BASE}/api/orders/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { setOrders(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token])

  const activeOrders = orders.filter(o => ['pending','verified','dispatched'].includes(o.status))
  const completedOrders = orders.filter(o => o.status === 'delivered')
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)

  const tabs = [
    { id: 'orders', label: 'Orders', icon: '📋', count: orders.length },
    { id: 'track', label: 'Track', icon: '🚚', count: activeOrders.length },
    { id: 'cart', label: 'Cart', icon: '🛒', count: cartCount },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, #0d1117 0%, #111827 45%, #0f3460 100%)', padding: isMobile ? '36px 16px' : '52px 48px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,14,22,0.7)' }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', border: '3px solid rgba(255,255,255,0.15)' }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '1.4rem' : '2rem', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '4px' }}>
            Hey, <em style={{ fontStyle: 'italic', color: '#f9a8ac' }}>{user?.name?.split(' ')[0]}!</em>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginBottom: '20px' }}>{user?.email || user?.phone}</div>
          <div style={{ display: 'flex', gap: '0', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
            {[
              { n: orders.length, l: 'Orders' },
              { n: activeOrders.length, l: 'Active' },
              { n: completedOrders.length, l: 'Done' },
              { n: cartCount, l: 'Cart' },
            ].map((s, i) => (
              <div key={i} style={{ padding: isMobile ? '10px 16px' : '14px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '1.1rem' : '1.4rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '3px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: isMobile ? '16px' : '40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '960px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: '16px', alignItems: 'start' }}>

          {/* Tab nav */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '6px', position: isMobile ? 'static' : 'sticky', top: '80px' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: isMobile ? '10px 12px' : '12px 14px', borderRadius: '8px', cursor: 'pointer', border: `1.5px solid ${activeTab === tab.id ? 'var(--red)' : 'var(--border)'}`, background: activeTab === tab.id ? '#fff8f8' : '#fff', color: activeTab === tab.id ? 'var(--ink)' : 'var(--mid)', fontWeight: activeTab === tab.id ? 700 : 500, fontSize: isMobile ? '0.75rem' : '0.82rem', flex: isMobile ? 1 : 'unset', justifyContent: isMobile ? 'center' : 'flex-start' }}
              >
                <span>{tab.icon}</span>
                {!isMobile && <span style={{ flex: 1 }}>{tab.label}</span>}
                {tab.count > 0 && (
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, background: activeTab === tab.id ? 'var(--red)' : 'var(--border)', color: activeTab === tab.id ? '#fff' : 'var(--light)', borderRadius: '10px', padding: '2px 6px' }}>{tab.count}</span>
                )}
              </button>
            ))}
            {!isMobile && (
              <div style={{ marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button onClick={() => navigate('/products')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--light)', fontSize: '0.72rem', textAlign: 'left' }}>← Shop more</button>
                <button onClick={() => navigate('/contact')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--light)', fontSize: '0.72rem', textAlign: 'left' }}>✉ Support</button>
              </div>
            )}
          </div>

          <div>
            {activeTab === 'orders' && (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>
                  Order history <span style={{ fontFamily: 'var(--sans)', fontSize: '0.7rem', fontWeight: 400, color: 'var(--light)', marginLeft: '6px' }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
                </div>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--light)', fontStyle: 'italic' }}>Loading...</div>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--light)', marginBottom: '12px' }}>No orders yet</div>
                    <button onClick={() => navigate('/products')} style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '9px 18px', cursor: 'pointer' }}>Browse products →</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {orders.map((o, idx) => (
                      <div key={o._id} onClick={() => setExpandedOrder(expandedOrder === o._id ? null : o._id)}
                        style={{ border: `1px solid ${expandedOrder === o._id ? 'var(--red)' : 'var(--border)'}`, borderRadius: '10px', padding: '14px 16px', cursor: 'pointer', background: expandedOrder === o._id ? '#fff8f8' : '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '7px', background: CARD_COLORS[idx % CARD_COLORS.length], flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {o.product?.image ? <img src={o.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '0.6rem', color: '#aaa' }}>IMG</span>}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '1px' }}>{o.product?.name || 'Product'}</div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--light)' }}>Rs. {o.product?.price} · {new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                            </div>
                          </div>
                          <span style={{ background: STATUS_BG[o.status] || '#f3f4f6', color: STATUS_COLORS[o.status] || '#6b7280', padding: '4px 10px', borderRadius: '20px', fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>{o.status}</span>
                        </div>
                        {expandedOrder === o._id && (
                          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', fontSize: '0.75rem' }}>
                            <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '2px' }}>{o.customerName}</div>
                            <div style={{ color: 'var(--mid)' }}>{o.phone} · {o.address}</div>
                            {o.paymentScreenshot && <a href={o.paymentScreenshot} target="_blank" rel="noreferrer" style={{ color: 'var(--red)', textDecoration: 'underline', marginTop: '6px', display: 'block' }}>View receipt ↗</a>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'track' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {activeOrders.length === 0 ? (
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--ink)', marginBottom: '6px', fontSize: '1rem' }}>All caught up!</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--light)' }}>No active orders to track right now.</div>
                  </div>
                ) : activeOrders.map(order => {
                  const statusIdx = STATUSES.indexOf(order.status)
                  const pct = (statusIdx / (STATUSES.length - 1)) * 100
                  return (
                    <div key={order._id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '10px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '3px' }}>{order.product?.name}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--light)' }}>Rs. {order.product?.price}</div>
                        </div>
                        <span style={{ background: STATUS_BG[order.status], color: STATUS_COLORS[order.status], padding: '5px 12px', borderRadius: '20px', fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>{order.status}</span>
                      </div>
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ height: '5px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: 'var(--red)', borderRadius: '3px', width: `${pct}%`, transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px' }}>
                        {STATUSES.map((s, i) => {
                          const done = i < statusIdx
                          const active = i === statusIdx
                          return (
                            <div key={s} style={{ textAlign: 'center' }}>
                              <div style={{ width: isMobile ? '28px' : '34px', height: isMobile ? '28px' : '34px', borderRadius: '50%', margin: '0 auto 6px', background: done ? 'var(--red)' : '#fff', border: `2px solid ${done || active ? 'var(--red)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: active ? '0 0 0 3px rgba(232,65,74,0.12)' : 'none' }}>
                                {done ? <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                                  : <span style={{ fontSize: '0.6rem', fontWeight: 700, color: active ? 'var(--red)' : 'var(--light)' }}>{i + 1}</span>}
                              </div>
                              <div style={{ fontSize: '0.55rem', fontWeight: 700, color: done || active ? 'var(--ink)' : 'var(--light)', marginBottom: '1px' }}>{STATUS_LABELS[s]}</div>
                              {!isMobile && <div style={{ fontSize: '0.52rem', color: 'var(--light)' }}>{STATUS_DESCS[s]}</div>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {activeTab === 'cart' && (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 260px', gap: '14px', alignItems: 'start' }}>
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>
                    Cart <span style={{ fontFamily: 'var(--sans)', fontSize: '0.7rem', fontWeight: 400, color: 'var(--light)', marginLeft: '6px' }}>{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
                  </div>
                  {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '28px 0' }}>
                      <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--light)', marginBottom: '12px' }}>Cart is empty</div>
                      <button onClick={() => navigate('/products')} style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '9px 18px', cursor: 'pointer' }}>Browse products →</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {cartItems.map((item, i) => (
                        <div key={item._id} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                          <div style={{ width: '46px', height: '46px', borderRadius: '7px', background: CARD_COLORS[i % CARD_COLORS.length], flexShrink: 0, overflow: 'hidden' }}>
                            {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>{item.name}</div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--red)' }}>Rs. {(item.price * item.qty).toLocaleString()}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <button onClick={() => item.qty === 1 ? removeFromCart(item._id) : updateQty(item._id, item.qty - 1)} style={{ width: '24px', height: '24px', borderRadius: '5px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer' }}>−</button>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)', minWidth: '14px', textAlign: 'center' }}>{item.qty}</span>
                            <button onClick={() => updateQty(item._id, item.qty + 1)} style={{ width: '24px', height: '24px', borderRadius: '5px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer' }}>+</button>
                          </div>
                          <button onClick={() => removeFromCart(item._id)} style={{ width: '24px', height: '24px', borderRadius: '5px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', color: 'var(--light)' }}>×</button>
                        </div>
                      ))}
                      <button onClick={clearCart} style={{ alignSelf: 'flex-start', fontSize: '0.62rem', color: 'var(--light)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: '4px 0', marginTop: '4px' }}>Clear cart</button>
                    </div>
                  )}
                </div>
                {cartItems.length > 0 && (
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px', position: isMobile ? 'static' : 'sticky', top: '80px' }}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px' }}>Summary</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                      {cartItems.map(item => (
                        <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--mid)' }}>
                          <span style={{ flex: 1, marginRight: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name} ×{item.qty}</span>
                          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Rs. {(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)' }}>Total</span>
                      <span style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>Rs. {cartTotal.toLocaleString()}</span>
                    </div>
                    <button onClick={() => navigate('/cart')} style={{ width: '100%', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '6px', padding: '11px', cursor: 'pointer' }}>Checkout →</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer isMobile={isMobile} />
    </div>
  )
}