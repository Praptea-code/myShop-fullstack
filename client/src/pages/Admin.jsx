import { useEffect, useState } from 'react'
import axios from 'axios'

const PASSWORD = 'changethis123'

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [pass, setPass] = useState('')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [tab, setTab] = useState('orders')
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '' })

  useEffect(() => {
    if (!authed) return
    axios.get('http://localhost:5000/api/orders').then(res => setOrders(res.data))
    axios.get('http://localhost:5000/api/products').then(res => setProducts(res.data))
  }, [authed])

  const updateStatus = async (id, status) => {
    await axios.patch(`http://localhost:5000/api/orders/${id}`, { status })
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o))
  }

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) return alert('Name and price are required')
    const res = await axios.post('http://localhost:5000/api/products', newProduct)
    setProducts([...products, res.data])
    setNewProduct({ name: '', description: '', price: '', image: '' })
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    await axios.delete(`http://localhost:5000/api/products/${id}`)
    setProducts(products.filter(p => p._id !== id))
  }

  const statusColors = { pending: '#c9a227', verified: '#3a7d44', shipped: '#2a5fad' }
  const statusBg = { pending: '#fef9ec', verified: '#edf7ee', shipped: '#ecf2fd' }

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '10px', color: 'var(--ink)', fontSize: '0.85rem', outline: 'none'
  }

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '44px', borderRadius: '20px', textAlign: 'center', width: '340px' }}>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.4rem', marginBottom: '6px' }}>aura</div>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '28px' }}>Admin access</div>
        <input
          type="password" placeholder="Password"
          value={pass} onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && pass === PASSWORD && setAuthed(true)}
          style={{ ...inputStyle, marginBottom: '14px', textAlign: 'center' }}
        />
        <button
          onClick={() => pass === PASSWORD ? setAuthed(true) : alert('Wrong password')}
          style={{ width: '100%', padding: '13px', background: 'var(--ink)', color: 'var(--bg)', border: 'none', borderRadius: '100px', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 600 }}
        >
          Enter
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '0 0 80px' }}>
      {/* Header */}
      <div style={{ padding: '22px 48px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.2rem' }}>aura <span style={{ fontStyle: 'normal', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink3)', fontFamily: 'var(--sans)' }}>admin</span></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['orders', 'products'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '9px 22px', borderRadius: '100px', border: '1px solid var(--border)',
              background: tab === t ? 'var(--ink)' : 'transparent',
              color: tab === t ? 'var(--bg)' : 'var(--ink2)',
              fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: 'pointer', fontWeight: tab === t ? 600 : 400, transition: 'all .2s'
            }}>
              {t} {t === 'orders' ? `(${orders.filter(o => o.status === 'pending').length})` : `(${products.length})`}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 0' }}>

        {/* Orders tab */}
        {tab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.length === 0 && (
              <p style={{ color: 'var(--ink3)', textAlign: 'center', padding: '60px 0', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>No orders yet.</p>
            )}
            {orders.map(o => (
              <div key={o._id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px 26px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', marginBottom: '5px' }}>{o.customerName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink2)', marginBottom: '2px' }}>{o.phone} · {o.address}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink3)' }}>{o.product?.name} · Rs. {o.product?.price}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <span style={{
                      background: statusBg[o.status], color: statusColors[o.status],
                      padding: '4px 12px', borderRadius: '100px',
                      fontSize: '0.67rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600
                    }}>
                      {o.status}
                    </span>
                    {o.paymentScreenshot && (
                      <a href={o.paymentScreenshot} target="_blank" rel="noreferrer"
                        style={{ fontSize: '0.75rem', color: 'var(--ink2)', textDecoration: 'underline' }}>
                        View screenshot
                      </a>
                    )}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {o.status === 'pending' && (
                        <button onClick={() => updateStatus(o._id, 'verified')} style={{
                          padding: '7px 16px', background: '#edf7ee', color: '#3a7d44',
                          border: '1px solid #c3e6c8', borderRadius: '100px',
                          fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                          cursor: 'pointer', fontWeight: 600
                        }}>Verify ✓</button>
                      )}
                      {o.status === 'verified' && (
                        <button onClick={() => updateStatus(o._id, 'shipped')} style={{
                          padding: '7px 16px', background: '#ecf2fd', color: '#2a5fad',
                          border: '1px solid #bdd0f5', borderRadius: '100px',
                          fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                          cursor: 'pointer', fontWeight: 600
                        }}>Mark shipped →</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products tab */}
        {tab === 'products' && (
          <div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '16px' }}>Add new product</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[['name','Product name'],['description','Description'],['price','Price (Rs.)'],['image','Image URL (optional)']].map(([field, ph]) => (
                  <input key={field} placeholder={ph} value={newProduct[field]}
                    onChange={e => setNewProduct({ ...newProduct, [field]: e.target.value })}
                    style={inputStyle} />
                ))}
                <button onClick={addProduct} style={{
                  padding: '13px', background: 'var(--ink)', color: 'var(--bg)',
                  border: 'none', borderRadius: '100px', fontSize: '0.75rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 600
                }}>
                  Add product
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {products.map(p => (
                <div key={p._id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {p.image && p.image.startsWith('http') && (
                      <img src={p.image} alt={p.name} style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }} />
                    )}
                    <div>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--ink3)' }}>Rs. {p.price}</div>
                    </div>
                  </div>
                  <button onClick={() => deleteProduct(p._id)} style={{
                    padding: '7px 16px', background: '#fef0f0', color: '#c0392b',
                    border: '1px solid #f5c6c6', borderRadius: '100px',
                    fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                    cursor: 'pointer', fontWeight: 600
                  }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}