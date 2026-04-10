import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../App'
import Navbar from '../components/Navbar'
import { useIsMobile } from '../hooks/useWindowWidth'
import API_BASE from '../api'

export default function Admin() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [tab, setTab] = useState('orders')
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '', flavour: '', puffs: '', nicotine: '', badge: '' })

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    axios.get(`${API_BASE}/api/orders`, { headers }).then(res => setOrders(res.data)).catch(() => navigate('/'))
    axios.get(`${API_BASE}/api/products`).then(res => setProducts(res.data))
  }, [])

  const updateStatus = async (id, status) => {
    await axios.patch(`${API_BASE}/api/orders/${id}`, { status }, { headers })
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o))
  }

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) return alert('Name and price required')
    const res = await axios.post(`${API_BASE}/api/products`, newProduct, { headers })
    setProducts([...products, res.data])
    setNewProduct({ name: '', description: '', price: '', image: '', flavour: '', puffs: '', nicotine: '', badge: '' })
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    await axios.delete(`${API_BASE}/api/products/${id}`, { headers })
    setProducts(products.filter(p => p._id !== id))
  }

  const statusColors = { pending: '#b45309', verified: '#15803d', dispatched: '#1d4ed8', delivered: '#6b7280' }
  const statusBgs = { pending: '#fef3e2', verified: '#dcfce7', dispatched: '#dbeafe', delivered: '#f3f4f6' }
  const inp = { width: '100%', padding: '11px 14px', background: 'var(--soft)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--ink)', fontSize: '0.85rem', outline: 'none', fontFamily: 'var(--sans)' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: isMobile ? '24px 16px 60px' : '48px 24px 80px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', paddingBottom: '18px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 200, color: 'var(--ink)' }}>
            Admin <i style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--navy)' }}>panel</i>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['orders', 'products'].map(t => (
              <button key={t} className={`btn btn-sm ${tab === t ? 'btn-navy' : 'btn-outline'}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
                {t} {t === 'orders' ? `(${orders.filter(o => o.status === 'pending').length})` : `(${products.length})`}
              </button>
            ))}
          </div>
        </div>

        {tab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {orders.length === 0 && <p style={{ color: 'var(--mid)', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>No orders yet.</p>}
            {orders.map(o => (
              <div key={o._id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: isMobile ? '16px' : '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '0.95rem', marginBottom: '3px', color: 'var(--ink)' }}>{o.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--mid)', marginBottom: '2px' }}>{o.phone} · {o.address}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--light)' }}>{o.product?.name} · Rs. {o.product?.price}</div>
                    {o.user && <div style={{ fontSize: '0.68rem', color: 'var(--light)', marginTop: '2px' }}>{o.user.email || o.user.phone}</div>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'flex-end', gap: '8px' }}>
                    <span style={{ background: statusBgs[o.status] || '#f3f4f6', color: statusColors[o.status] || '#6b7280', padding: '4px 12px', borderRadius: '100px', fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{o.status}</span>
                    {o.paymentScreenshot && <a href={o.paymentScreenshot} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'var(--navy)', textDecoration: 'underline' }}>View screenshot</a>}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {o.status === 'pending' && <button onClick={() => updateStatus(o._id, 'verified')} style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', borderRadius: '100px', fontSize: '0.67rem', padding: '6px 14px', cursor: 'pointer' }}>Verify ✓</button>}
                      {o.status === 'verified' && <button onClick={() => updateStatus(o._id, 'dispatched')} style={{ background: '#dbeafe', color: '#1d4ed8', border: '1px solid #93c5fd', borderRadius: '100px', fontSize: '0.67rem', padding: '6px 14px', cursor: 'pointer' }}>Mark dispatched</button>}
                      {o.status === 'dispatched' && <button onClick={() => updateStatus(o._id, 'delivered')} style={{ background: 'var(--soft)', color: 'var(--mid)', border: '1px solid var(--border)', borderRadius: '100px', fontSize: '0.67rem', padding: '6px 14px', cursor: 'pointer' }}>Mark delivered</button>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'products' && (
          <div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: isMobile ? '18px' : '24px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '14px', fontWeight: 500 }}>Add new product</div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px' }}>
                {[['name','Product name'],['price','Price (Rs.)'],['flavour','Flavour'],['puffs','Puffs (e.g. 5000 puffs)'],['nicotine','Nicotine (e.g. 5% nic)'],['badge','Badge (e.g. New, Best seller)'],['image','Image URL'],['description','Description']].map(([field, ph]) => (
                  <input key={field} placeholder={ph} value={newProduct[field]} onChange={e => setNewProduct({...newProduct, [field]: e.target.value})}
                    style={{ ...inp, gridColumn: (!isMobile && (field === 'description' || field === 'image')) ? 'span 2' : 'span 1' }} />
                ))}
              </div>
              <button className="btn btn-navy" onClick={addProduct} style={{ marginTop: '14px', width: '100%', justifyContent: 'center', padding: '13px' }}>Add product</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {products.map(p => (
                <div key={p._id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    {p.image && <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--navy)', fontWeight: 600 }}>Rs. {p.price}</div>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(p._id)} style={{ flexShrink: 0 }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}