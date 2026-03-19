import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { Footer } from './Home'
import { useAuth, useCart } from '../App'

const CARD_BG = ['#f5e8e8','#fdf3e0','#eae8f5','#e8f5ea','#e8f5f5','#f5e8f5','#fdf5e0','#e8eaf5']

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [tab, setTab] = useState('description')

  useEffect(() => {
    window.scrollTo(0, 0)
    axios.get(`http://localhost:5000/api/products/${productId}`)
      .then(r => setProduct(r.data))
      .catch(() => navigate('/products'))
    axios.get('http://localhost:5000/api/products')
      .then(r => setRelated(r.data.filter(p => p._id !== productId).slice(0, 4)))
      .catch(() => {})
  }, [productId])

  const handleAddToCart = () => {
    if (!user) return navigate('/login')
    for (let i = 0; i < qty; i++) addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleOrderNow = () => {
    if (!user) return navigate('/login')
    for (let i = 0; i < qty; i++) addToCart(product)
    navigate('/cart')
  }

  if (!product) return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--light)', fontStyle: 'italic' }}>Loading...</div>
      </div>
    </div>
  )

  const bgColor = CARD_BG[Math.abs((product._id?.charCodeAt(0) || 0) - 97) % CARD_BG.length]

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />

      <div style={{ padding: '16px 32px 80px' }}>

        {/* Back button */}
        <button
          onClick={() => navigate('/products')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--mid)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0', marginBottom: '16px', transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--mid)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>
          Back to products
        </button>

        {/* ── MAIN PRODUCT LAYOUT ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '52px', alignItems: 'start' }}>

          {/* LEFT — image */}
          <div style={{ background: bgColor, borderRadius: '12px', border: '1px solid var(--border)', height: '460px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {product.badge && (
              <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'var(--red)', color: '#fff', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 10px', borderRadius: '3px', zIndex: 2 }}>{product.badge}</span>
            )}
            {product.image
              ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '32px' }} />
              : (
                <div style={{ textAlign: 'center' }}>
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="rgba(0,0,0,0.08)"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.2)', marginTop: '12px' }}>No image available</div>
                </div>
              )
            }
          </div>

          {/* RIGHT — info */}
          <div style={{ paddingTop: '8px' }}>

            <h1 style={{ fontSize: '1.55rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25, marginBottom: '10px' }}>{product.name}</h1>

            {/* Tags */}
            {(product.flavour || product.puffs || product.nicotine) && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
                {[product.flavour, product.puffs, product.nicotine].filter(Boolean).map((t, i) => (
                  <span key={i} style={{ fontSize: '0.7rem', color: 'var(--red)', fontWeight: 700 }}>{t}</span>
                ))}
              </div>
            )}

            {/* Price */}
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '18px', letterSpacing: '-0.01em' }}>
              Rs {product.price?.toLocaleString()}.00
            </div>

            <div style={{ height: '1px', background: 'var(--border)', marginBottom: '18px' }} />

            {/* Sold by */}
            <div style={{ fontSize: '0.78rem', color: 'var(--mid)', marginBottom: '16px' }}>
              Sold by: <span style={{ color: 'var(--red)', fontWeight: 700 }}>Puff Diaries</span>
            </div>

            {/* Short description */}
            {product.description && (
              <p style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.85, marginBottom: '24px' }}>
                {product.description}
              </p>
            )}

            <div style={{ height: '1px', background: 'var(--border)', marginBottom: '24px' }} />

            {/* Qty + buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              {/* Qty stepper */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: '40px', height: '50px', background: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--soft)'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >−</button>
                <div style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                  {qty}
                </div>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{ width: '40px', height: '50px', background: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--soft)'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >+</button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                style={{ flex: 1, height: '50px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', background: added ? '#15803d' : 'var(--ink)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
                onMouseEnter={e => { if (!added) e.currentTarget.style.background = '#2d3748' }}
                onMouseLeave={e => { if (!added) e.currentTarget.style.background = added ? '#15803d' : 'var(--ink)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-14.83-3h14.83l1.68-8H5.21L4.17 3H1v2h2l3.6 7.59L5.25 15c-.16.28-.25.61-.25.96C5 17.1 5.9 18 7 18h13v-2H7.42c-.13 0-.25-.11-.25-.25l.03-.12.9-1.63z"/></svg>
                {added ? '✓ Added!' : 'Add to cart'}
              </button>

              {/* Buy now */}
              <button
                onClick={handleOrderNow}
                style={{ flex: 1, height: '50px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.18s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dark)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
              >Buy Now</button>
            </div>

            {/* Payment methods */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
              {['eSewa', 'Khalti', 'Bank Transfer'].map(p => (
                <span key={p} style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--light)', background: 'var(--soft)', border: '1px solid var(--border)', padding: '3px 9px', borderRadius: '3px' }}>{p}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ borderBottom: '2px solid var(--border)', marginBottom: '36px', display: 'flex', gap: '0' }}>
          {['description', 'more products'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                fontSize: '0.85rem', fontWeight: 600,
                color: tab === t ? 'var(--ink)' : 'var(--light)',
                background: 'transparent', border: 'none',
                borderBottom: tab === t ? '2px solid var(--red)' : '2px solid transparent',
                marginBottom: '-2px',
                padding: '12px 24px',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'color 0.18s',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { if (tab !== t) e.currentTarget.style.color = 'var(--ink)' }}
              onMouseLeave={e => { if (tab !== t) e.currentTarget.style.color = 'var(--light)' }}
            >
              {t === 'description' ? 'Description' : 'More Products'}
            </button>
          ))}
        </div>

        {/* ── DESCRIPTION TAB ── */}
        {tab === 'description' && (
          <div style={{ maxWidth: '760px', paddingBottom: '20px' }}>
            {product.description ? (
              <div style={{ fontSize: '0.85rem', color: '#444', lineHeight: 2 }}>
                <p style={{ marginBottom: '20px' }}>{product.description}</p>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>Key Features:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {product.puffs && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ color: 'var(--red)', flexShrink: 0, marginTop: '1px' }}>✓</span>
                      <span><strong>{product.puffs}</strong> — Long-lasting disposable design for extended vaping sessions.</span>
                    </div>
                  )}
                  {product.nicotine && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ color: 'var(--red)', flexShrink: 0, marginTop: '1px' }}>✓</span>
                      <span><strong>{product.nicotine} nicotine</strong> — Smooth and satisfying hit every time.</span>
                    </div>
                  )}
                  {product.flavour && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ color: 'var(--red)', flexShrink: 0, marginTop: '1px' }}>✓</span>
                      <span><strong>{product.flavour} flavour</strong> — Premium taste crafted for an unforgettable experience.</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: 'var(--red)', flexShrink: 0, marginTop: '1px' }}>✓</span>
                    <span><strong>100% Authentic</strong> — Sourced directly and verified before it hits our shelves.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: 'var(--red)', flexShrink: 0, marginTop: '1px' }}>✓</span>
                    <span><strong>Same day dispatch</strong> — Order before 3 PM for same-day delivery in Kathmandu.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: 'var(--red)', flexShrink: 0, marginTop: '1px' }}>✓</span>
                    <span><strong>Discreet packaging</strong> — Plain, unmarked box. No logos, no hints.</span>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.82rem', color: 'var(--light)', fontStyle: 'italic' }}>No description available for this product.</p>
            )}
          </div>
        )}

        {/* ── MORE PRODUCTS TAB ── */}
        {tab === 'more products' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
            {related.length === 0
              ? <p style={{ fontSize: '0.82rem', color: 'var(--light)', fontStyle: 'italic' }}>No other products found.</p>
              : related.map((p, i) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/products/${p._id}`)}
                  style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.18s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ height: '180px', background: CARD_BG[i % CARD_BG.length], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '0.68rem', color: '#bbb' }}>Product photo</span>}
                    {p.badge && <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--red)', color: '#fff', fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 7px', borderRadius: '2px' }}>{p.badge}</span>}
                  </div>
                  <div style={{ padding: '12px 14px 14px' }}>
                    {(p.flavour || p.puffs) && (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        {[p.flavour, p.puffs, p.nicotine].filter(Boolean).map((t, ti) => (
                          <span key={ti} style={{ fontSize: '0.52rem', color: '#888', background: 'var(--soft)', border: '1px solid var(--border)', padding: '2px 5px', borderRadius: '2px' }}>{t}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '10px', lineHeight: 1.35 }}>{p.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f0f2f5' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>Rs. {p.price}</span>
                      <button
                        onClick={e => { e.stopPropagation(); user ? addToCart(p) : navigate('/login') }}
                        style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: '3px', padding: '6px 10px', cursor: 'pointer', transition: 'background 0.18s', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--red)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}
                      >Add to cart</button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* ── RELATED PRODUCTS (always shown below tabs) ── */}
        {related.length > 0 && (
          <div style={{ marginTop: '64px' }}>
            <div style={{ height: '1px', background: 'var(--border)', marginBottom: '40px' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)', textAlign: 'center', marginBottom: '28px' }}>Related Products</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
              {related.map((p, i) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/products/${p._id}`)}
                  style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.18s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.09)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ height: '200px', background: CARD_BG[i % CARD_BG.length], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '0.68rem', color: '#bbb' }}>Product photo</span>}
                    {p.badge && <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--red)', color: '#fff', fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 7px', borderRadius: '2px' }}>{p.badge}</span>}
                  </div>
                  <div style={{ padding: '14px 16px 16px' }}>
                    {(p.flavour || p.puffs) && (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        {[p.flavour, p.puffs, p.nicotine].filter(Boolean).map((t, ti) => (
                          <span key={ti} style={{ fontSize: '0.52rem', color: '#888', background: 'var(--soft)', border: '1px solid var(--border)', padding: '2px 5px', borderRadius: '2px' }}>{t}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px', lineHeight: 1.35 }}>{p.name}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--red)', marginBottom: '12px' }}>Rs. {p.price?.toLocaleString()}.00</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={e => { e.stopPropagation(); user ? addToCart(p) : navigate('/login') }}
                        style={{ flex: 1, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px', cursor: 'pointer', transition: 'background 0.18s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--red)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}
                      >Add to cart</button>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/products/${p._id}`) }}
                        style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', background: 'transparent', color: 'var(--ink)', border: '1px solid var(--border)', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer', transition: 'all 0.18s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--ink)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                      >View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  )
}