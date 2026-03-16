import { useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

const STATUSES = ['pending', 'verified', 'dispatched', 'delivered']
const LABELS = { pending: 'Order placed', verified: 'Verified', dispatched: 'Dispatched', delivered: 'Delivered' }
const DESCS = { pending: 'Payment received and confirmed', verified: 'Manually verified by our team', dispatched: 'Packed and with delivery', delivered: 'Order received by you' }

export default function TrackOrder() {
  const [identifier, setIdentifier] = useState('')
  const [orders, setOrders] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const track = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/track?identifier=${encodeURIComponent(identifier)}`)
      setOrders(res.data)
    } catch { setOrders([]) }
    setSearched(true); setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ background: 'var(--soft)', borderBottom: '1px solid var(--border)', padding: '88px 56px' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '12px', fontWeight: 500 }}>Where's my order?</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 200, marginBottom: '10px', color: 'var(--ink)' }}>
            Track your <i style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--navy)' }}>order</i>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--mid)', marginBottom: '36px', lineHeight: 1.7 }}>
            Enter your phone number or email to see the live status of your delivery.
          </p>
          <form onSubmit={track} style={{ display: 'flex', border: '1.5px solid var(--border)', borderRadius: '100px', overflow: 'hidden', background: '#fff', marginBottom: '48px', boxShadow: '0 4px 20px rgba(15,31,61,0.07)' }}>
            <input
              value={identifier} onChange={e => setIdentifier(e.target.value)}
              placeholder="Phone number or email address"
              style={{ flex: 1, padding: '14px 24px', border: 'none', outline: 'none', fontSize: '0.85rem', color: 'var(--ink)', background: 'transparent' }}
            />
            <button type="submit" disabled={loading} style={{ background: 'var(--navy)', color: '#fff', border: 'none', padding: '10px 26px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', borderRadius: '100px', margin: '4px' }}>
              {loading ? '...' : 'Track →'}
            </button>
          </form>
        </div>
      </div>

      {searched && (
        <div style={{ padding: '56px', maxWidth: '800px', margin: '0 auto' }}>
          {orders.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--mid)', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>No orders found for that email or phone.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {orders.map(order => {
                const statusIdx = STATUSES.indexOf(order.status)
                return (
                  <div key={order._id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontStyle: 'italic', marginBottom: '4px', color: 'var(--ink)' }}>{order.product?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--mid)' }}>Rs. {order.product?.price} · {new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{order.status}</div>
                    </div>
                    {/* Timeline */}
                    <div style={{ display: 'flex', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '19px', left: '12.5%', right: '12.5%', height: '1.5px', background: 'var(--border)' }} />
                      {STATUSES.map((s, i) => (
                        <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 8px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: `2px solid ${i <= statusIdx ? 'var(--navy)' : 'var(--border)'}`, background: i < statusIdx ? 'var(--navy)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '0.72rem', fontWeight: 600, color: i < statusIdx ? '#fff' : i === statusIdx ? 'var(--navy)' : 'var(--light)', boxShadow: i === statusIdx ? '0 0 0 4px rgba(15,31,61,0.1)' : 'none' }}>
                            {i < statusIdx ? '✓' : i + 1}
                          </div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: i <= statusIdx ? 'var(--ink)' : 'var(--light)', marginBottom: '4px' }}>{LABELS[s]}</div>
                          <div style={{ fontSize: '0.68rem', color: i <= statusIdx ? 'var(--mid)' : 'var(--light)', lineHeight: 1.55, maxWidth: '100px' }}>{DESCS[s]}</div>
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