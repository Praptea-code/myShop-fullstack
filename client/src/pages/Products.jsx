import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../App'
import { Footer } from './Home'

const CARD_BG = ['#f5e8e8','#fdf3e0','#eae8f5','#e8f5ea','#e8f5f5','#f5e8f5','#fdf5e0','#e8eaf5']

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [filters, setFilters] = useState({ flavours: [], maxPrice: 5000, puffs: [], nicotine: [] })
  const navigate = useNavigate()
  const { user } = useAuth()

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

  const inp = { width: '100%', padding: '9px 12px', background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--ink)', outline: 'none', fontFamily: 'var(--sans)' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: 'var(--navy)', padding: '28px 40px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '5px' }}>Browse</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
          All <em style={{ fontStyle: 'italic', color: '#f9a8ac' }}>Products</em>
        </div>
      </div>

      <div style={{ padding: '24px 40px', display: 'grid', gridTemplateColumns: '185px 1fr', gap: '20px' }}>

        {/* Filter sidebar */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', height: 'fit-content' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '11px', paddingBottom: '9px', borderBottom: '1px solid #f0f2f5', display: 'flex', justifyContent: 'space-between' }}>
            Filters
            <span style={{ fontSize: '0.62rem', color: 'var(--red)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setFilters({ flavours:[], maxPrice:5000, puffs:[], nicotine:[] })}>Clear all</span>
          </div>

          {[
            { label: 'Flavour', key: 'flavours', opts: ['Strawberry','Mango','Blueberry','Menthol','Watermelon','Grape'] },
          ].map(g => (
            <div key={g.label} style={{ marginBottom: '13px' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '7px' }}>{g.label}</div>
              {g.opts.map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#555', marginBottom: '4px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={filters[g.key].includes(opt)} onChange={() => toggleFilter(g.key, opt)} style={{ accentColor: 'var(--red)' }} />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <div style={{ marginBottom: '13px' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '7px' }}>Price Range</div>
            <input type="range" min="500" max="5000" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))} style={{ width: '100%', accentColor: 'var(--red)', marginBottom: '3px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#888' }}>
              <span>Rs. 500</span>
              <span>Rs. {filters.maxPrice.toLocaleString()}</span>
            </div>
          </div>

          {[
            { label: 'Puffs', key: 'puffs', opts: ['5000','6000','10000','12000'] },
            { label: 'Nicotine', key: 'nicotine', opts: ['2%','5%'] },
          ].map(g => (
            <div key={g.label} style={{ marginBottom: '13px' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '7px' }}>{g.label}</div>
              {g.opts.map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#555', marginBottom: '4px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={filters[g.key].includes(opt)} onChange={() => toggleFilter(g.key, opt)} style={{ accentColor: 'var(--red)' }} />
                  {opt} {g.label === 'Puffs' ? 'puffs' : 'nic'}
                </label>
              ))}
            </div>
          ))}
        </div>

        {/* Products grid */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
              {filtered.map((p, i) => (
                <div key={p._id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ height: '130px', background: CARD_BG[i % CARD_BG.length], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '0.72rem', color: '#bbb' }}>Product photo</span>}
                    {p.badge && <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--red)', color: '#fff', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 7px', borderRadius: '2px' }}>{p.badge}</span>}
                  </div>
                  <div style={{ padding: '11px 13px 13px' }}>
                    {(p.flavour || p.puffs) && (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '5px' }}>
                        {[p.flavour, p.puffs, p.nicotine].filter(Boolean).map((t,ti) => (
                          <span key={ti} style={{ fontSize: '0.56rem', color: '#888', background: 'var(--soft)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: '2px' }}>{t}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '9px', lineHeight: 1.3 }}>{p.name}</div>
                    {p.description && <div style={{ fontSize: '0.7rem', color: 'var(--mid)', lineHeight: 1.6, marginBottom: '8px' }}>{p.description}</div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '9px', borderTop: '1px solid #f0f2f5' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--ink)' }}>Rs. {p.price}</span>
                      <button
                        onClick={() => user ? navigate(`/order/${p._id}`) : navigate('/login')}
                        style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: '3px', padding: '6px 13px', cursor: 'pointer', transition: 'background 0.18s' }}
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