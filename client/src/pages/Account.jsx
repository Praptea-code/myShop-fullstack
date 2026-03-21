import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth, useCart } from '../App'
import Navbar from '../components/Navbar'
import { Footer } from './Home'
import API_BASE from '../api'

const STATUSES = ['pending', 'verified', 'dispatched', 'delivered']
const STATUS_LABELS = { pending: 'Order placed', verified: 'Payment verified', dispatched: 'Out for delivery', delivered: 'Delivered' }
const STATUS_DESCS = { pending: 'We received your order', verified: 'Confirmed by our team', dispatched: 'Packed & on the way', delivered: 'Enjoy your vape!' }
const STATUS_COLORS = { pending: '#b45309', verified: '#0369a1', dispatched: '#7c3aed', delivered: '#15803d' }
const STATUS_BG = { pending: '#fef3e2', verified: '#e0f2fe', dispatched: '#ede9fe', delivered: '#dcfce7' }
const CARD_COLORS = ['#f5e8e8', '#fdf3e0', '#eae8f5', '#e8f5ea', '#e8f5f5', '#f5e8f5']

export default function Account() {
  const { user, token } = useAuth()
  const { cartItems, removeFromCart, updateQty, clearCart, cartCount } = useCart()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    axios.get(`${API_BASE}/api/orders/mine`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => { setOrders(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [token])

  const activeOrders = orders.filter(o => ['pending','verified','dispatched'].includes(o.status))
  const completedOrders = orders.filter(o => o.status === 'delivered')
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/></svg>, count: orders.length },
    { id: 'track', label: 'Track Orders', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5 1.96 2.5H17V9.5h2.5zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>, count: activeOrders.length },
    { id: 'cart', label: 'My Cart', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-14.83-3h14.83l1.68-8H5.21L4.17 3H1v2h2l3.6 7.59L5.25 15c-.16.28-.25.61-.25.96C5 17.1 5.9 18 7 18h13v-2H7.42c-.13 0-.25-.11-.25-.25l.03-.12.9-1.63z"/></svg>, count: cartCount },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <section style={{ background: 'linear-gradient(135deg, #0d1117 0%, #111827 45%, #0f3460 100%)', padding: '52px 48px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,14,22,0.7)' }} />
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(232,65,74,0.07)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '3px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '1.7rem', fontWeight: 700, color: '#fff' }}>{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(232,65,74,0.12)', border: '1px solid rgba(232,65,74,0.25)', borderRadius: '20px', padding: '5px 14px', marginBottom: '12px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }} />
            <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--red)', textTransform: 'uppercase' }}>My account</span>
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '6px' }}>
            Hey, <em style={{ fontStyle: 'italic', color: '#f9a8ac' }}>{user?.name?.split(' ')[0]}!</em>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginBottom: '28px' }}>{user?.email || user?.phone}</div>
          <div style={{ display: 'flex', gap: '0', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
            {[
              { n: orders.length, l: 'Total orders' },
              { n: activeOrders.length, l: 'In progress' },
              { n: completedOrders.length, l: 'Delivered' },
              { n: cartCount, l: 'In cart' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '14px 28px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '960px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'sticky', top: '80px' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px', borderRadius: '8px', cursor: 'pointer', border: `1.5px solid ${activeTab === tab.id ? 'var(--red)' : 'var(--border)'}`, background: activeTab === tab.id ? '#fff8f8' : '#fff', color: activeTab === tab.id ? 'var(--ink)' : 'var(--mid)', fontWeight: activeTab === tab.id ? 700 : 500, fontSize: '0.82rem', transition: 'all 0.18s', textAlign: 'left' }}
              >
                <span style={{ color: activeTab === tab.id ? 'var(--red)' : 'var(--light)' }}>{tab.icon}</span>
                <span style={{ flex: 1 }}>{tab.label}</span>
                {tab.count > 0 && (
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, background: activeTab === tab.id ? 'var(--red)' : 'var(--border)', color: activeTab === tab.id ? '#fff' : 'var(--light)', borderRadius: '10px', padding: '2px 7px' }}>{tab.count}</span>
                )}
              </button>
            ))}
            <div style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button onClick={() => navigate('/products')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--light)', fontSize: '0.75rem', textAlign: 'left' }}>
                ← Shop more
              </button>
              <button onClick={() => navigate('/contact')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--light)', fontSize: '0.75rem', textAlign: 'left' }}>
                ✉ Contact support
              </button>
            </div>
          </div>

          <div>
            {activeTab === 'orders' && (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '18px' }}>
                  Order history <span style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', fontWeight: 400, color: 'var(--light)', marginLeft: '6px' }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
                </div>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--light)', fontStyle: 'italic' }}>Loading...</div>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--light)', marginBottom: '12px' }}>No orders yet</div>
                    <button onClick={() => navigate('/products')} style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '9px 18px', cursor: 'pointer' }}>Browse products →</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {orders.map((o, idx) => (
                      <div key={o._id} onClick={() => setExpandedOrder(expandedOrder === o._id ? null : o._id)}
                        style={{ border: `1px solid ${expandedOrder === o._id ? 'var(--red)' : 'var(--border)'}`, borderRadius: '10px', padding: '16px 18px', cursor: 'pointer', background: expandedOrder === o._id ? '#fff8f8' : '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: CARD_COLORS[idx % CARD_COLORS.length], flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {o.product?.image ? <img src={o.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '0.6rem', color: '#aaa' }}>IMG</span>}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>{o.product?.name || 'Product'}</div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--light)' }}>Rs. {o.product?.price} · {new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ background: STATUS_BG[o.status] || '#f3f4f6', color: STATUS_COLORS[o.status] || '#6b7280', padding: '4px 11px', borderRadius: '20px', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>{o.status}</span>
                          </div>
                        </div>
                        {expandedOrder === o._id && (
                          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.75rem' }}>
                            <div>
                              <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '4px' }}>Delivery to</div>
                              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '2px' }}>{o.customerName}</div>
                              <div style={{ color: 'var(--mid)' }}>{o.phone}</div>
                              <div style={{ color: 'var(--mid)' }}>{o.address}</div>
                            </div>
                            {o.paymentScreenshot && (
                              <div>
                                <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '4px' }}>Payment</div>
                                <a href={o.paymentScreenshot} target="_blank" rel="noreferrer" style={{ color: 'var(--red)', textDecoration: 'underline' }}>View receipt ↗</a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'track' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>Track your orders</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--light)' }}>Live status of all active deliveries</div>
                </div>
                {activeOrders.length === 0 ? (
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--ink)', marginBottom: '6px', fontSize: '1rem' }}>All caught up!</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--light)' }}>No active orders to track right now.</div>
                  </div>
                ) : activeOrders.map(order => {
                  const statusIdx = STATUSES.indexOf(order.status)
                  const pct = (statusIdx / (STATUSES.length - 1)) * 100
                  return (
                    <div key={order._id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '12px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{order.product?.name}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--light)' }}>Rs. {order.product?.price} · Ordered {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                        </div>
                        <span style={{ background: STATUS_BG[order.status], color: STATUS_COLORS[order.status], padding: '5px 13px', borderRadius: '20px', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>{order.status}</span>
                      </div>
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ height: '5px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: 'var(--red)', borderRadius: '3px', width: `${pct}%`, transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                        {STATUSES.map((s, i) => {
                          const done = i < statusIdx
                          const active = i === statusIdx
                          return (
                            <div key={s} style={{ textAlign: 'center' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', margin: '0 auto 8px', background: done ? 'var(--red)' : '#fff', border: `2px solid ${done || active ? 'var(--red)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: active ? '0 0 0 4px rgba(232,65,74,0.12)' : 'none' }}>
                                {done ? <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                                  : <span style={{ fontSize: '0.65rem', fontWeight: 700, color: active ? 'var(--red)' : 'var(--light)' }}>{i + 1}</span>}
                              </div>
                              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: done || active ? 'var(--ink)' : 'var(--light)', marginBottom: '2px' }}>{STATUS_LABELS[s]}</div>
                              <div style={{ fontSize: '0.58rem', color: 'var(--light)' }}>{STATUS_DESCS[s]}</div>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px', alignItems: 'start' }}>
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '18px' }}>
                    Cart <span style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', fontWeight: 400, color: 'var(--light)', marginLeft: '6px' }}>{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
                  </div>
                  {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                      <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--light)', marginBottom: '12px' }}>Your cart is empty</div>
                      <button onClick={() => navigate('/products')} style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '9px 18px', cursor: 'pointer' }}>Browse products →</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {cartItems.map((item, i) => (
                        <div key={item._id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', border: '1px solid var(--border)', borderRadius: '10px' }}>
                          <div style={{ width: '52px', height: '52px', borderRadius: '8px', background: CARD_COLORS[i % CARD_COLORS.length], flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '0.6rem', color: '#aaa' }}>IMG</span>}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>{item.name}</div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--red)' }}>Rs. {(item.price * item.qty).toLocaleString()}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button onClick={() => item.qty === 1 ? removeFromCart(item._id) : updateQty(item._id, item.qty - 1)} style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer' }}>−</button>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', minWidth: '16px', textAlign: 'center' }}>{item.qty}</span>
                            <button onClick={() => updateQty(item._id, item.qty + 1)} style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer' }}>+</button>
                          </div>
                          <button onClick={() => removeFromCart(item._id)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', color: 'var(--light)' }}>×</button>
                        </div>
                      ))}
                      <button onClick={clearCart} style={{ alignSelf: 'flex-start', fontSize: '0.65rem', color: 'var(--light)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: '4px 0', marginTop: '4px' }}>Clear cart</button>
                    </div>
                  )}
                </div>
                {cartItems.length > 0 && (
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', position: 'sticky', top: '80px' }}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>Summary</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      {cartItems.map(item => (
                        <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--mid)' }}>
                          <span style={{ flex: 1, marginRight: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name} ×{item.qty}</span>
                          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Rs. {(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)' }}>Total</span>
                        <span style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>Rs. {cartTotal.toLocaleString()}</span>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/order/${cartItems[0]._id}`)} style={{ width: '100%', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '6px', padding: '12px', cursor: 'pointer' }}>Checkout →</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}