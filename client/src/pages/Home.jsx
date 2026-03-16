import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Home() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff', padding: '40px 20px' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '10px' }}>Our Products</h1>
      <p style={{ textAlign: 'center', color: '#aaa', marginBottom: '40px' }}>
        Pay via eSewa / Khalti — we verify and ship to you
      </p>

      {products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#555' }}>
          No products yet. Add some from the admin panel.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
          {products.map(p => (
            <div key={p._id} style={{ background: '#1a1a1a', borderRadius: '16px', overflow: 'hidden', border: '1px solid #2a2a2a' }}>
              {p.image && <img src={p.image} alt={p.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
              <div style={{ padding: '20px' }}>
                <h2 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>{p.name}</h2>
                <p style={{ color: '#aaa', fontSize: '0.9rem', margin: '0 0 12px' }}>{p.description}</p>
                <p style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '1.1rem', margin: '0 0 16px' }}>
                  Rs. {p.price}
                </p>
                <button
                  onClick={() => navigate(`/order/${p._id}`)}
                  style={{ width: '100%', padding: '12px', background: '#4ade80', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}