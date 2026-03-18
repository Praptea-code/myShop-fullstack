import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth, useCart } from '../App'
import { Footer } from './Home'

const CARD_BG = ['#f5e8e8','#fdf3e0','#eae8f5','#e8f5ea','#e8f5f5','#f5e8f5','#fdf5e0','#e8eaf5']

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [filters, setFilters] = useState({ flavours: [], maxPrice: 5000, puffs: [], nicotine: [] })
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()

  useEffect(() => {
    axios.get('http://localhost:5000/api/products').then(r => setProducts(r.data)).catch(() => {})
  }, [])

  const toggleFilter = (key, val) => {
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val]
    }))
  }

  const filtered = products
    .filter(p => {
      if (search && !p.name?.toLowerCase().includes(search.toLowerCase()) && !p.flavour?.toLowerCase().includes(search.toLowerCase())) return false
      if (p.price > filters.maxPrice) return false
      if (filters.flavours.length && !filters.flavours.some(f => p.flavour?.toLowerCase().includes(f.toLowerCase()))) return false
      if (filters.puffs.length && !filters.puffs.some(pf => p.puffs?.includes(pf))) return false
      if (filters.nicotine.length && !filters.nicotine.some(n => p.nicotine?.includes(n))) return false
      return true
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

     

      <div style={{ padding: '32px 48px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px', alignItems: 'start' }}>

        {/* Filter sidebar */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '24px', position: 'sticky', top: '80px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #f0f2f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Filters
            <span style={{ fontSize: '0.62rem', color: 'var(--red)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setFilters({ flavours:[], maxPrice:5000, puffs:[], nicotine:[] })}>Clear all</span>
          </div>

          {/* Flavour */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '12px' }}>Flavour</div>
            {['Strawberry','Mango','Blueberry','Menthol','Watermelon','Grape'].map(opt => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.78rem', color: '#555', marginBottom: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.flavours.includes(opt)} onChange={() => toggleFilter('flavours', opt)} style={{ accentColor: 'var(--red)', width: '14px', height: '14px', flexShrink: 0 }} />
                {opt}
              </label>
            ))}
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '12px' }}>Price Range</div>
            <input type="range" min="500" max="5000" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))} style={{ width: '100%', accentColor: 'var(--red)', marginBottom: '8px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#888' }}>
              <span>Rs. 500</span>
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Rs. {filters.maxPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Puffs */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '12px' }}>Puffs</div>
            {['5000','6000','10000','12000'].map(opt => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.78rem', color: '#555', marginBottom: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.puffs.includes(opt)} onChange={() => toggleFilter('puffs', opt)} style={{ accentColor: 'var(--red)', width: '14px', height: '14px', flexShrink: 0 }} />
                {opt} puffs
              </label>
            ))}
          </div>

          {/* Nicotine */}
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '12px' }}>Nicotine</div>
            {['2%','5%'].map(opt => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.78rem', color: '#555', marginBottom: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.nicotine.includes(opt)} onChange={() => toggleFilter('nicotine', opt)} style={{ accentColor: 'var(--red)', width: '14px', height: '14px', flexShrink: 0 }} />
                {opt} nic
              </label>
            ))}
          </div>
        </div>

        {/* Products area */}
        <div>
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', color: '#888' }}>Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
            <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search flavour, brand..."
                style={{ padding: '0 11px', border: '1px solid var(--border)', borderRight: 'none', borderRadius: '3px 0 0 3px', fontSize: '0.75rem', color: 'var(--ink)', outline: 'none', background: '#fff', width: '165px', height: '33px' }}
              />
              <button style={{ background: 'var(--ink)', border: 'none', padding: '0 11px', color: '#fff', cursor: 'pointer', height: '33px', borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              </button>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ fontSize: '0.72rem', padding: '0 9px', border: '1px solid var(--border)', borderLeft: 'none', borderRadius: '0 3px 3px 0', color: '#444', background: '#fff', outline: 'none', cursor: 'pointer', height: '33px' }}>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low–High</option>
                <option value="price-desc">Price: High–Low</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--light)', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>No products match your filters.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              {filtered.map((p, i) => (
                <div key={p._id}
                  onClick={() => navigate(`/products/${p._id}`)}
                  style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', transition: 'box-shadow 0.18s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ height: '155px', background: CARD_BG[i % CARD_BG.length], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {p.image
                      ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '0.68rem', color: '#bbb' }}>Product photo</span>
                    }
                    {p.badge && (
                      <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--red)', color: '#fff', fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 7px', borderRadius: '2px' }}>{p.badge}</span>
                    )}
                  </div>
                  <div style={{ padding: '12px 14px 14px' }}>
                    {(p.flavour || p.puffs) && (
                      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        {[p.flavour, p.puffs, p.nicotine].filter(Boolean).map((t, ti) => (
                          <span key={ti} style={{ fontSize: '0.52rem', color: '#888', background: 'var(--soft)', border: '1px solid var(--border)', padding: '2px 5px', borderRadius: '2px' }}>{t}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px', lineHeight: 1.35 }}>{p.name}</div>
                    {p.description && (
                      <div style={{ fontSize: '0.64rem', color: 'var(--mid)', lineHeight: 1.5, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f0f2f5' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--ink)' }}>Rs. {p.price}</span>
                      <button
                        onClick={e => { e.stopPropagation(); user ? addToCart(p) : navigate('/login') }}
                        style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: '3px', padding: '6px 10px', cursor: 'pointer', transition: 'background 0.18s', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--red)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}
                      >Add to cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}