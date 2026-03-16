import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../App'
import Navbar from '../components/Navbar'

export default function Admin() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [tab, setTab] = useState('orders')
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '', flavour: '', puffs: '', nicotine: '', badge: '' })

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders', { headers }).then(res => setOrders(res.data)).catch(() => navigate('/'))
    axios.get('http://localhost:5000/api/products').then(res => setProducts(res.data))
  }, [])

  const updateStatus = async (id, status) => {
    await axios.patch(`http://localhost:5000/api/orders/${id}`, { status }, { headers })
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o))
  }

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) return alert('Name and price required')
    const res = await axios.post('http://localhost:5000/api/products', newProduct, { headers })
    setProducts([...products, res.data])
    setNewProduct({ name: '', description: '', price: '', image: '', flavour: '', puffs: '', nicotine: '', badge: '' })
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    await axios.delete(`http://localhost:5000/api/products/${id}`, { headers })
    setProducts(products.filter(p => p._id !== id))
  }

  const statusColors = { pending: '#b45309', verified: '#15803d', dispatched: '#1d4ed8', delivered: '#6b7280' }
  const statusBgs = { pending: '#fef3e2', verified: '#dcfce7', dispatched: '#dbeafe', delivered: '#f3f4f6' }
  const inp = { width: '100%', padding: '12px 16px', background: 'var(--soft)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--ink)', fontSize: '0.85rem', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 200, color: 'var(--ink)' }}>
            Admin <i style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--navy)' }}>panel</i>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['orders', 'products'].map(t => (
              <button key={t} className={`btn btn-sm ${tab === t ? 'btn-navy' : 'btn-soft'}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
                {t} {t === 'orders' ? `(${orders.filter(o => o.status === 'pending').length} pending)` : `(${products.length})`}
              </button>
            ))}
          </div>
        </div>

        {tab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.length === 0 && <p style={{ color: 'var(--mid)', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>No orders yet.</p>}
            {orders.map(o => (
              <div key={o._id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '0.98rem', marginBottom: '4px', color: 'var(--ink)' }}>{o.customerName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--mid)', marginBottom: '2px' }}>{o.phone} · {o.address}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--light)' }}>{o.product?.name} · Rs. {o.product?.price}</div>
                    {o.user && <div style={{ fontSize: '0.72rem', color: 'var(--light)', marginTop: '2px' }}>Account: {o.user.email || o.user.phone}</div>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span style={{ background: statusBgs[o.status] || '#f3f4f6', color: statusColors[o.status] || '#6b7280', padding: '4px 12px', borderRadius: '100px', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{o.status}</span>
                    {o.paymentScreenshot && <a href={o.paymentScreenshot} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--navy)', textDecoration: 'underline' }}>View screenshot</a>}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {o.status === 'pending' && <button className="btn btn-sm" onClick={() => updateStatus(o._id, 'verified')} style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', borderRadius: '100px', fontSize: '0.67rem', padding: '6px 14px' }}>Verify ✓</button>}
                      {o.status === 'verified' && <button className="btn btn-sm" onClick={() => updateStatus(o._id, 'dispatched')} style={{ background: '#dbeafe', color: '#1d4ed8', border: '1px solid #93c5fd', borderRadius: '100px', fontSize: '0.67rem', padding: '6px 14px' }}>Mark dispatched</button>}
                      {o.status === 'dispatched' && <button className="btn btn-sm" onClick={() => updateStatus(o._id, 'delivered')} style={{ background: 'var(--soft)', color: 'var(--mid)', border: '1px solid var(--border)', borderRadius: '100px', fontSize: '0.67rem', padding: '6px 14px' }}>Mark delivered</button>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'products' && (
          <div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '16px', fontWeight: 500 }}>Add new product</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[['name','Product name'],['price','Price (Rs.)'],['flavour','Flavour'],['puffs','Puffs (e.g. 5000 puffs)'],['nicotine','Nicotine (e.g. 5% nic)'],['badge','Badge (e.g. New, Best seller)'],['image','Image URL'],['description','Description']].map(([field, ph]) => (
                  <input key={field} placeholder={ph} value={newProduct[field]} onChange={e => setNewProduct({...newProduct, [field]: e.target.value})} style={{ ...inp, gridColumn: field === 'description' || field === 'image' ? 'span 2' : 'span 1' }} />
                ))}
              </div>
              <button className="btn btn-navy" onClick={addProduct} style={{ marginTop: '16px', width: '100%', justifyContent: 'center', padding: '13px' }}>Add product</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {products.map(p => (
                <div key={p._id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {p.image && <img src={p.image} alt={p.name} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />}
                    <div>
                      <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--ink)' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--navy)', fontWeight: 600 }}>Rs. {p.price}</div>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(p._id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}