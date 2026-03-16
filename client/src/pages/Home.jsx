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
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Nav */}
      <nav style={{
        padding: '22px 48px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10
      }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontStyle: 'italic', letterSpacing: '0.02em' }}>
          aura
        </div>
        <div style={{ display: 'flex', gap: '32px', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink3)' }}>
          <span style={{ cursor: 'pointer', color: 'var(--ink)' }}>Shop</span>
          <span style={{ cursor: 'pointer' }}>About</span>
          <span onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>Admin</span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        margin: '28px 48px 0',
        display: 'grid',
        gridTemplateColumns: '1.15fr 0.85fr',
        gap: '16px',
        alignItems: 'stretch'
      }}>
        {/* Main hero block */}
        <div style={{
          background: 'var(--bg3)', borderRadius: '20px',
          padding: '60px 52px', display: 'flex',
          flexDirection: 'column', justifyContent: 'flex-end',
          minHeight: '380px', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '28px', right: '36px',
            fontFamily: 'var(--serif)', fontSize: '7rem', fontStyle: 'italic',
            color: 'rgba(30,27,24,0.05)', lineHeight: 1, userSelect: 'none'
          }}>✦</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{
              display: 'inline-block', background: 'rgba(30,27,24,0.07)',
              padding: '5px 14px', borderRadius: '100px',
              fontSize: '0.67rem', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--ink2)', marginBottom: '20px'
            }}>New arrivals</span>
            <h1 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem,3.8vw,3.2rem)',
              fontWeight: 400, lineHeight: 1.15, marginBottom: '18px'
            }}>
              Tech that feels<br />
              <em style={{ fontStyle: 'italic', color: 'var(--ink2)' }}>like you.</em>
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink2)', lineHeight: 1.8, marginBottom: '30px', maxWidth: '340px' }}>
              Handpicked electronics delivered across Nepal. Pay with eSewa or Khalti — simple as that.
            </p>
            <button
              onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'var(--ink)', color: 'var(--bg)',
                padding: '13px 28px', borderRadius: '100px',
                fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                border: 'none', cursor: 'pointer', fontWeight: 500, transition: 'all .2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#3d3530'}
              onMouseOut={e => e.currentTarget.style.background = 'var(--ink)'}
            >
              Shop the collection →
            </button>
          </div>
        </div>

        {/* Side cards */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '16px' }}>
          {products.slice(0, 2).map((p, i) => (
            <div key={p._id}
              onClick={() => navigate(`/order/${p._id}`)}
              style={{
                background: i === 0 ? '#e8e0f0' : '#e0eee8',
                borderRadius: '16px', padding: '24px',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-end', cursor: 'pointer',
                position: 'relative', overflow: 'hidden', transition: 'transform .25s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '3.5rem', textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -65%)' }}>
                {p.image && p.image.startsWith('http') ? (
                  <img src={p.image} alt={p.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
                ) : '📦'}
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', marginBottom: '3px' }}>{p.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--ink2)' }}>Rs. {p.price}</div>
            </div>
          ))}
          {products.length === 0 && [0,1].map(i => (
            <div key={i} style={{ background: i === 0 ? '#ede8f0' : '#e8f0ee', borderRadius: '16px' }} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ margin: '52px 48px 40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--ink3)', whiteSpace: 'nowrap' }}>
          carefully curated for you
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      {/* Products */}
      <div id="products" style={{ padding: '0 48px 72px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 400 }}>
            All products <em style={{ fontStyle: 'italic', color: 'var(--ink3)' }}>({products.length})</em>
          </h2>
        </div>

        {products.length === 0 ? (
          <p style={{ color: 'var(--ink3)', fontSize: '0.9rem', textAlign: 'center', padding: '60px 0' }}>
            No products yet — add some from the <span onClick={() => navigate('/admin')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>admin panel</span>.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {products.map((p, i) => {
              const bgs = ['#ede8e2', '#e2e8ed', '#e8e2ed', '#e8ede2', '#ede2e8']
              return (
                <div key={p._id}
                  style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all .25s' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.07)' }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ height: '200px', background: bgs[i % bgs.length], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.image && p.image.startsWith('http') ? (
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '3.5rem' }}>📦</span>
                    )}
                  </div>
                  <div style={{ padding: '20px 22px' }}>
                    <div style={{ fontSize: '0.67rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '6px' }}>
                      Electronics
                    </div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', marginBottom: '6px' }}>{p.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--ink2)', lineHeight: 1.6, marginBottom: '16px' }}>{p.description}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>Rs. {p.price}</span>
                      <button
                        onClick={() => navigate(`/order/${p._id}`)}
                        style={{
                          background: 'none', border: '1px solid var(--border)',
                          color: 'var(--ink)', padding: '7px 18px', borderRadius: '100px',
                          fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                          cursor: 'pointer', transition: 'all .2s'
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = '#fff' }}
                        onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--ink)' }}
                      >
                        Order
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--ink3)' }}>
        <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--ink)' }}>aura</span>
        <span>© 2025 · Made in Nepal</span>
      </div>
    </div>
  )
}