import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../App'

export default function Products() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    axios.get('http://localhost:5000/api/products').then(r => setProducts(r.data)).catch(() => {})
  }, [])

  const bgs = ['#e8ecf6', '#e8f2ee', '#ece8f6', '#e8f0ec', '#f0e8ec', '#f0ece8']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ padding: '72px 56px' }}>
        <div style={{ marginBottom: '48px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '8px', fontWeight: 500 }}>All products</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', fontWeight: 200, color: 'var(--ink)' }}>
            Our full <i style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--navy)' }}>collection</i>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {products.map((p, i) => (
            <div key={p._id} style={{ borderRadius: '14px', overflow: 'hidden', background: '#fff', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all .3s', display: 'flex', flexDirection: 'column' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 56px rgba(15,31,61,0.11)'; e.currentTarget.style.borderColor = 'transparent' }}
              onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bgs[i % bgs.length], position: 'relative' }}>
                {p.image
                  ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.7)', border: '1px dashed rgba(15,31,61,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📦</div>
                    </div>
                }
                {p.badge && <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'var(--navy)', color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>{p.badge}</div>}
              </div>
              <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {(p.flavour || p.puffs || p.nicotine) && (
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {[p.flavour, p.puffs, p.nicotine].filter(Boolean).map((tag, ti) => (
                      <span key={ti} style={{ fontSize: '0.6rem', color: 'var(--mid)', background: 'var(--soft)', padding: '3px 10px', borderRadius: '100px', border: '1px solid var(--border)' }}>{tag}</span>
                    ))}
                  </div>
                )}
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 200, fontStyle: 'italic', color: 'var(--ink)' }}>{p.name}</div>
                {p.description && <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.6 }}>{p.description}</div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--navy)' }}>Rs. {p.price}</span>
                  <button
                    onClick={() => user ? navigate(`/order/${p._id}`) : navigate('/login')}
                    style={{ fontSize: '0.64rem', fontFamily: 'var(--sans)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', padding: '8px 18px', borderRadius: '100px', background: 'var(--navy)', color: '#fff', border: '1.5px solid var(--navy)', transition: 'all .18s' }}
                  >
                    Order now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}