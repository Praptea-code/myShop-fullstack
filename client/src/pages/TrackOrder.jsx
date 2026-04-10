import { useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useIsMobile } from '../hooks/useWindowWidth'
import API_BASE from '../api'

const STATUSES = ['pending', 'verified', 'dispatched', 'delivered']
const LABELS = { pending: 'Order placed', verified: 'Verified', dispatched: 'Dispatched', delivered: 'Delivered' }
const DESCS = { pending: 'Payment received', verified: 'Verified by our team', dispatched: 'Packed & on the way', delivered: 'Order received' }

export default function TrackOrder() {
  const [identifier, setIdentifier] = useState('')
  const [orders, setOrders] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const isMobile = useIsMobile()

  const track = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/api/orders/track?identifier=${encodeURIComponent(identifier)}`)
      setOrders(res.data)
    } catch { setOrders([]) }
    setSearched(true); setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <div style={{ background: 'var(--soft)', borderBottom: '1px solid var(--border)', padding: isMobile ? '56px 20px 48px' : '88px 56px' }}>
        <div style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '10px', fontWeight: 500 }}>Where's my order?</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '1.7rem' : '2rem', fontWeight: 200, marginBottom: '8px', color: 'var(--ink)' }}>
            Track your <i style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--navy)' }}>order</i>
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--mid)', marginBottom: '28px', lineHeight: 1.7 }}>Enter your phone number or email to see the live status of your delivery.</p>
          <form onSubmit={track} style={{ display: 'flex', border: '1.5px solid var(--border)', borderRadius: '100px', overflow: 'hidden', background: '#fff', marginBottom: '0', boxShadow: '0 4px 20px rgba(15,31,61,0.07)' }}>
            <input value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="Phone number or email address"
              style={{ flex: 1, padding: '13px 20px', border: 'none', outline: 'none', fontSize: '0.85rem', color: 'var(--ink)', background: 'transparent', minWidth: 0 }} />
            <button type="submit" disabled={loading} style={{ background: 'var(--navy)', color: '#fff', border: 'none', padding: '10px 22px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', borderRadius: '100px', margin: '4px', flexShrink: 0 }}>
              {loading ? '...' : 'Track →'}
            </button>
          </form>
        </div>
      </div>

      {searched && (
        <div style={{ padding: isMobile ? '32px 16px' : '56px', maxWidth: '800px', margin: '0 auto' }}>
          {orders.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--mid)', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>No orders found for that email or phone.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.map(order => {
                const statusIdx = STATUSES.indexOf(order.status)
                return (
                  <div key={order._id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: isMobile ? '20px 16px' : '28px 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontStyle: 'italic', marginBottom: '3px', color: 'var(--ink)' }}>{order.product?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>Rs. {order.product?.price} · {new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{order.status}</div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden', marginBottom: '24px' }}>
                      <div style={{ height: '100%', background: 'var(--red)', borderRadius: '2px', width: `${(statusIdx / (STATUSES.length - 1)) * 100}%`, transition: 'width 0.6s ease' }} />
                    </div>

                    {/* Steps */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: isMobile ? '4px' : '8px' }}>
                      {STATUSES.map((s, i) => (
                        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: isMobile ? '0 2px' : '0 8px' }}>
                          <div style={{ width: isMobile ? '30px' : '38px', height: isMobile ? '30px' : '38px', borderRadius: '50%', border: `2px solid ${i <= statusIdx ? 'var(--navy)' : 'var(--border)'}`, background: i < statusIdx ? 'var(--navy)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', fontSize: '0.72rem', fontWeight: 600, color: i < statusIdx ? '#fff' : i === statusIdx ? 'var(--navy)' : 'var(--light)', boxShadow: i === statusIdx ? '0 0 0 4px rgba(15,31,61,0.1)' : 'none', flexShrink: 0 }}>
                            {i < statusIdx ? '✓' : i + 1}
                          </div>
                          <div style={{ fontSize: isMobile ? '0.55rem' : '0.72rem', fontWeight: 600, color: i <= statusIdx ? 'var(--ink)' : 'var(--light)', marginBottom: '2px', lineHeight: 1.2 }}>{LABELS[s]}</div>
                          {!isMobile && <div style={{ fontSize: '0.62rem', color: 'var(--light)', lineHeight: 1.5 }}>{DESCS[s]}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}