import { useEffect, useState } from 'react'
import axios from 'axios'

const PASSWORD = 'admin123'

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
    if (!newProduct.name || !newProduct.price) return alert('Name and price required')
    const res = await axios.post('http://localhost:5000/api/products', newProduct)
    setProducts([...products, res.data])
    setNewProduct({ name: '', description: '', price: '', image: '' })
  }

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`)
    setProducts(products.filter(p => p._id !== id))
  }

  const statusColor = { pending: '#facc15', verified: '#4ade80', shipped: '#60a5fa' }

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a1a', padding: '40px', borderRadius: '16px', textAlign: 'center', width: '300px' }}>
        <h2 style={{ color: '#fff', marginBottom: '24px' }}>Admin Login</h2>
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && pass === PASSWORD && setAuthed(true)}
          style={{ width: '100%', padding: '12px', background: '#0f0f0f', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#fff', marginBottom: '16px', boxSizing: 'border-box' }}
        />
        <button
          onClick={() => pass === PASSWORD ? setAuthed(true) : alert('Wrong password')}
          style={{ width: '100%', padding: '12px', background: '#4ade80', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Login
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '24px' }}>Admin Panel</h1>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          {['orders', 'products'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '10px 24px', background: tab === t ? '#4ade80' : '#1a1a1a', color: tab === t ? '#000' : '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'capitalize' }}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.length === 0 && <p style={{ color: '#555' }}>No orders yet.</p>}
            {orders.map(o => (
              <div key={o._id} style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px', border: '1px solid #2a2a2a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{o.customerName}</p>
                    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{o.phone} · {o.address}</p>
                    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{o.product?.name} · Rs. {o.product?.price}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    <span style={{ color: statusColor[o.status], fontWeight: 'bold', fontSize: '0.85rem' }}>
                      {o.status.toUpperCase()}
                    </span>
                    {o.paymentScreenshot && (
                      <a href={o.paymentScreenshot} target="_blank" rel="noreferrer"
                        style={{ color: '#60a5fa', fontSize: '0.85rem' }}>View screenshot</a>
                    )}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {o.status === 'pending' && (
                        <button onClick={() => updateStatus(o._id, 'verified')}
                          style={{ padding: '6px 14px', background: '#4ade80', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
                          Verify
                        </button>
                      )}
                      {o.status === 'verified' && (
                        <button onClick={() => updateStatus(o._id, 'shipped')}
                          style={{ padding: '6px 14px', background: '#60a5fa', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
                          Mark Shipped
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'products' && (
          <div>
            <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #2a2a2a' }}>
              <h3 style={{ marginBottom: '16px' }}>Add New Product</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[['name', 'Product name'], ['description', 'Description'], ['price', 'Price (Rs.)'], ['image', 'Image URL']].map(([field, ph]) => (
                  <input key={field} placeholder={ph} value={newProduct[field]}
                    onChange={e => setNewProduct({ ...newProduct, [field]: e.target.value })}
                    style={{ padding: '12px', background: '#0f0f0f', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#fff' }} />
                ))}
                <button onClick={addProduct}
                  style={{ padding: '12px', background: '#4ade80', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Add Product
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {products.map(p => (
                <div key={p._id} style={{ background: '#1a1a1a', borderRadius: '12px', padding: '16px 20px', border: '1px solid #2a2a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 'bold' }}>{p.name}</p>
                    <p style={{ color: '#4ade80', fontSize: '0.9rem' }}>Rs. {p.price}</p>
                  </div>
                  <button onClick={() => deleteProduct(p._id)}
                    style={{ padding: '6px 14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}