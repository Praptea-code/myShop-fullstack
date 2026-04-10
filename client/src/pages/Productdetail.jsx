import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { Footer } from './Home'
import { useAuth, useCart } from '../App'
import { useIsMobile, useIsTablet } from '../hooks/useWindowWidth'
import API_BASE from '../api'

const CARD_BG = ['#f5e8e8','#fdf3e0','#eae8f5','#e8f5ea','#e8f5f5','#f5e8f5','#fdf5e0','#e8eaf5']

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [tab, setTab] = useState('description')

  useEffect(() => {
    window.scrollTo(0, 0)
    axios.get(`${API_BASE}/api/products/${productId}`)
      .then(r => setProduct(r.data))
      .catch(() => navigate('/products'))
    axios.get(`${API_BASE}/api/products`)
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
  const relatedCols = isMobile ? 'repeat(2,1fr)' : isTablet ? 'repeat(3,1fr)' : 'repeat(4,1fr)'
  const px = isMobile ? '16px' : isTablet ? '32px' : '80px'

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />

      <div style={{ padding: `16px ${px} 60px` }}>

        <button onClick={() => navigate('/products')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--mid)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0', marginBottom: '16px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>
          Back to products
        </button>

        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', marginBottom: '40px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>

          {/* Image */}
          <div style={{ width: '100%', aspectRatio: '1 / 1', background: bgColor, position: 'relative', overflow: 'hidden', cursor: isMobile ? 'default' : 'zoom-in', maxHeight: isMobile ? '320px' : 'none' }}
            onMouseMove={isMobile ? undefined : e => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = ((e.clientX - rect.left) / rect.width) * 100
              const y = ((e.clientY - rect.top) / rect.height) * 100
              const img = e.currentTarget.querySelector('img')
              if (img) { img.style.transformOrigin = `${x}% ${y}%`; img.style.transform = 'scale(1.5)' }
            }}
            onMouseLeave={isMobile ? undefined : e => {
              const img = e.currentTarget.querySelector('img')
              if (img) { img.style.transform = 'scale(1)'; img.style.transformOrigin = 'center center' }
            }}
          >
            {product.badge && (
              <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--red)', color: '#fff', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 10px', borderRadius: '3px', zIndex: 2 }}>{product.badge}</span>
            )}
            {product.image
              ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, transition: 'transform 0.25s ease' }} />
              : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="rgba(0,0,0,0.08)"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.2)', marginTop: '10px' }}>No image</div>
                </div>
            }
          </div>

          {/* Info */}
          <div style={{ padding: isMobile ? '20px' : '32px', display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: isMobile ? 'none' : '1px solid var(--border)', borderTop: isMobile ? '1px solid var(--border)' : 'none' }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25, marginBottom: '8px' }}>{product.name}</h1>
              {(product.flavour || product.puffs || product.nicotine) && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {[product.flavour, product.puffs, product.nicotine].filter(Boolean).map((t, i) => (
                    <span key={i} style={{ fontSize: '0.7rem', color: 'var(--red)', fontWeight: 700 }}>{t}</span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 700, color: 'var(--ink)' }}>
              Rs {product.price?.toLocaleString()}.00
            </div>

            <div style={{ height: '1px', background: 'var(--border)' }} />
            <div style={{ fontSize: '0.78rem', color: 'var(--mid)' }}>Sold by: <span style={{ color: 'var(--red)', fontWeight: 700 }}>Puff Diaries</span></div>

            {product.description && (
              <p style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.85 }}>{product.description}</p>
            )}

            {/* Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { label: 'Puffs', value: product.puffs },
                { label: 'Nicotine', value: product.nicotine },
                { label: 'Flavour', value: product.flavour },
              ].filter(s => s.value).map((s, i) => (
                <div key={i} style={{ background: 'var(--soft)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '3px' }}>{s.label}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)' }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ height: '1px', background: 'var(--border)' }} />

            {/* Qty + buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '40px', height: '46px', background: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--mid)' }}>−</button>
                <div style={{ width: '44px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>{qty}</div>
                <button onClick={() => setQty(q => q + 1)} style={{ width: '40px', height: '46px', background: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--mid)' }}>+</button>
              </div>
              <button onClick={handleAddToCart} style={{ flex: 1, height: '46px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', background: added ? '#15803d' : 'var(--ink)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.2s' }}>
                {added ? '✓ Added!' : 'Add to cart'}
              </button>
              <button onClick={handleOrderNow} style={{ flex: 1, height: '46px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Buy Now
              </button>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['eSewa', 'Khalti', 'Bank Transfer'].map(p => (
                <span key={p} style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--light)', background: 'var(--soft)', border: '1px solid var(--border)', padding: '3px 9px', borderRadius: '3px' }}>{p}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '2px solid var(--border)', marginBottom: '28px', display: 'flex' }}>
          {['description', 'more products'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ fontSize: '0.82rem', fontWeight: 600, color: tab === t ? 'var(--ink)' : 'var(--light)', background: 'transparent', border: 'none', borderBottom: tab === t ? '2px solid var(--red)' : '2px solid transparent', marginBottom: '-2px', padding: '10px 18px', cursor: 'pointer', textTransform: 'capitalize' }}
            >{t === 'description' ? 'Description' : 'More Products'}</button>
          ))}
        </div>

        {tab === 'description' && (
          <div style={{ maxWidth: '720px', paddingBottom: '20px' }}>
            {product.description ? (
              <div style={{ fontSize: '0.85rem', color: '#444', lineHeight: 2 }}>
                <p style={{ marginBottom: '16px' }}>{product.description}</p>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>Key Features:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {product.puffs && <div style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--red)', flexShrink: 0 }}>✓</span><span><strong>{product.puffs}</strong> — Long-lasting disposable.</span></div>}
                  {product.nicotine && <div style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--red)', flexShrink: 0 }}>✓</span><span><strong>{product.nicotine} nicotine</strong> — Smooth hit every time.</span></div>}
                  {product.flavour && <div style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--red)', flexShrink: 0 }}>✓</span><span><strong>{product.flavour} flavour</strong> — Premium taste.</span></div>}
                  <div style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--red)', flexShrink: 0 }}>✓</span><span><strong>100% Authentic</strong> — Verified before it hits our shelves.</span></div>
                  <div style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--red)', flexShrink: 0 }}>✓</span><span><strong>Same day dispatch</strong> — Order before 3 PM for same-day delivery.</span></div>
                  <div style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--red)', flexShrink: 0 }}>✓</span><span><strong>Discreet packaging</strong> — Plain, unmarked box.</span></div>
                </div>
              </div>
            ) : <p style={{ fontSize: '0.82rem', color: 'var(--light)', fontStyle: 'italic' }}>No description available.</p>}
          </div>
        )}

        {tab === 'more products' && (
          <div style={{ display: 'grid', gridTemplateColumns: relatedCols, gap: '14px' }}>
            {related.map((p, i) => (
              <div key={p._id} onClick={() => navigate(`/products/${p._id}`)} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ height: isMobile ? '140px' : '180px', background: CARD_BG[i % CARD_BG.length], position: 'relative', overflow: 'hidden' }}>
                  {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '0.68rem', color: '#bbb', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>Photo</span>}
                  {p.badge && <span style={{ position: 'absolute', top: '6px', left: '6px', background: 'var(--red)', color: '#fff', fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase', padding: '3px 6px', borderRadius: '2px' }}>{p.badge}</span>}
                </div>
                <div style={{ padding: '10px 12px 12px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.35 }}>{p.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f0f2f5' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)' }}>Rs. {p.price}</span>
                    <button onClick={e => { e.stopPropagation(); user ? addToCart(p) : navigate('/login') }} style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: '3px', padding: '5px 9px', cursor: 'pointer' }}>Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: '56px' }}>
            <div style={{ height: '1px', background: 'var(--border)', marginBottom: '32px' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', textAlign: 'center', marginBottom: '24px' }}>Related Products</h2>
            <div style={{ display: 'grid', gridTemplateColumns: relatedCols, gap: '14px' }}>
              {related.map((p, i) => (
                <div key={p._id} onClick={() => navigate(`/products/${p._id}`)} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ height: isMobile ? '140px' : '180px', background: CARD_BG[i % CARD_BG.length], position: 'relative', overflow: 'hidden' }}>
                    {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                    {p.badge && <span style={{ position: 'absolute', top: '6px', left: '6px', background: 'var(--red)', color: '#fff', fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase', padding: '3px 6px', borderRadius: '2px' }}>{p.badge}</span>}
                  </div>
                  <div style={{ padding: '12px 14px 14px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px', lineHeight: 1.35 }}>{p.name}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--red)', marginBottom: '10px' }}>Rs. {p.price?.toLocaleString()}.00</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={e => { e.stopPropagation(); user ? addToCart(p) : navigate('/login') }} style={{ flex: 1, fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px', cursor: 'pointer' }}>Add to cart</button>
                      <button onClick={e => { e.stopPropagation(); navigate(`/products/${p._id}`) }} style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', background: 'transparent', color: 'var(--ink)', border: '1px solid var(--border)', borderRadius: '4px', padding: '8px 10px', cursor: 'pointer' }}>View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer isMobile={isMobile} />
    </div>
  )
}