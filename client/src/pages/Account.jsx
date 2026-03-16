import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../App'
import Navbar from '../components/Navbar'

const STATUSES = ['pending', 'verified', 'dispatched', 'delivered']
const statusColors = { pending: '#b45309', verified: '#15803d', dispatched: '#1d4ed8', delivered: '#6b7280' }
const statusBgs = { pending: '#fef3e2', verified: '#dcfce7', dispatched: '#dbeafe', delivered: '#f3f4f6' }

export default function Account() {
  const { user, token } = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/mine', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setOrders(r.data)).catch(() => {})
  }, [token])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ padding: '72px 56px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '8px' }}>My account</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 200, color: 'var(--ink)' }}>
            Hey, <i style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--navy)' }}>{user?.name}</i>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--mid)', marginTop: '6px' }}>{user?.email || user?.phone}</div>
        </div>

        <div style={{ fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '20px', fontWeight: 500 }}>Your orders ({orders.length})</div>

        {orders.length === 0 ? (
          <p style={{ color: 'var(--mid)', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>No orders yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {orders.map(o => (
              <div key={o._id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1rem', marginBottom: '4px', color: 'var(--ink)' }}>{o.product?.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--mid)' }}>Rs. {o.product?.price} · {new Date(o.createdAt).toLocaleDateString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--mid)', marginTop: '2px' }}>{o.address}</div>
                </div>
                <span style={{ background: statusBgs[o.status] || '#f3f4f6', color: statusColors[o.status] || '#6b7280', padding: '5px 14px', borderRadius: '100px', fontSize: '0.67rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}