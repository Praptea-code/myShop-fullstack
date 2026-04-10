import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth, useCart } from '../App'
import { Footer } from './Home'
import { useIsMobile, useIsTablet } from '../hooks/useWindowWidth'
import API_BASE from '../api'

const CARD_BG = ['#f5e8e8','#fdf3e0','#eae8f5','#e8f5ea','#e8f5f5','#f5e8f5','#fdf5e0','#e8eaf5']

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [filters, setFilters] = useState({ flavours: [], maxPrice: 5000, puffs: [], nicotine: [] })
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()

  useEffect(() => {
    const flavour = searchParams.get('flavour')
    if (flavour) setFilters(f => ({ ...f, flavours: [flavour] }))
  }, [])

  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()

  useEffect(() => {
    axios.get(`${API_BASE}/api/products`).then(r => setProducts(r.data)).catch(() => {})
  }, [])

  const toggleFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val] }))
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

  const prodCols = isMobile ? 'repeat(2,1fr)' : isTablet ? 'repeat(3,1fr)' : 'repeat(4,1fr)'
  const activeFilterCount = filters.flavours.length + filters.puffs.length + filters.nicotine.length + (filters.maxPrice < 5000 ? 1 : 0)

  const FilterPanel = () => (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px' }}>
      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f0f2f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Filters
        <span style={{ fontSize: '0.62rem', color: 'var(--red)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setFilters({ flavours:[], maxPrice:5000, puffs:[], nicotine:[] })}>Clear all</span>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '10px' }}>Flavour</div>
        {['Strawberry','Mango','Blueberry','Menthol','Watermelon','Grape'].map(opt => (
          <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.78rem', color: '#555', marginBottom: '9px', cursor: 'pointer' }}>
            <input type="checkbox" checked={filters.flavours.includes(opt)} onChange={() => toggleFilter('flavours', opt)} style={{ accentColor: 'var(--red)', width: '14px', height: '14px' }} />
            {opt}
          </label>
        ))}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '10px' }}>Price Range</div>
        <input type="range" min="500" max="5000" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))} style={{ width: '100%', accentColor: 'var(--red)', marginBottom: '6px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#888' }}>
          <span>Rs. 500</span>
          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Rs. {filters.maxPrice.toLocaleString()}</span>
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '10px' }}>Puffs</div>
        {['3k','5k','18k','25k','30k','35k'].map(opt => (
          <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.78rem', color: '#555', marginBottom: '9px', cursor: 'pointer' }}>
            <input type="checkbox" checked={filters.puffs.includes(opt)} onChange={() => toggleFilter('puffs', opt)} style={{ accentColor: 'var(--red)', width: '14px', height: '14px' }} />
            {opt} puffs
          </label>
        ))}
      </div>
      <div>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '10px' }}>Nicotine</div>
        {['2%','5%'].map(opt => (
          <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.78rem', color: '#555', marginBottom: '9px', cursor: 'pointer' }}>
            <input type="checkbox" checked={filters.nicotine.includes(opt)} onChange={() => toggleFilter('nicotine', opt)} style={{ accentColor: 'var(--red)', width: '14px', height: '14px' }} />
            {opt} nic
          </label>
        ))}
      </div>
      {isMobile && (
        <button onClick={() => setFiltersOpen(false)} style={{ width: '100%', marginTop: '16px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '6px', padding: '12px', cursor: 'pointer' }}>
          Show {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </button>
      )}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <style>{`
        .prod-card { background: #fff; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; cursor: pointer; transition: box-shadow 0.25s, transform 0.25s; }
        .prod-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.1); transform: translateY(-3px); }
        .prod-card .pcard-img-inner { transition: transform 0.45s; }
        .prod-card:hover .pcard-img-inner { transform: scale(1.06); }
        .prod-card .pcard-quick { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%) translateY(8px); opacity: 0; transition: opacity 0.25s, transform 0.25s; white-space: nowrap; font-family: var(--sans); font-size: 0.58rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; background: #fff; color: var(--ink); border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,0.18); z-index: 3; }
        @media (hover: hover) { .prod-card:hover .pcard-quick { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @media (hover: none) { .pcard-quick { opacity: 1; transform: translateX(-50%) translateY(0); } }
        .pcard-quick:hover { background: var(--red) !important; color: #fff !important; }
      `}</style>

      {/* Mobile filter overlay */}
      {isMobile && filtersOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)' }} onClick={() => setFiltersOpen(false)}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '85%', maxWidth: '320px', background: 'var(--bg)', overflowY: 'auto', padding: '20px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)' }}>Filters</span>
              <button onClick={() => setFiltersOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: '1rem', color: 'var(--light)' }}>×</button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      <div style={{ padding: isMobile ? '16px' : '32px 48px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Desktop sidebar */}
        {!isMobile && (
          <div style={{ position: 'sticky', top: '80px' }}>
            <FilterPanel />
          </div>
        )}

        <div>
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isMobile && (
                <button onClick={() => setFiltersOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, background: '#fff', color: 'var(--ink)', border: `1.5px solid ${activeFilterCount > 0 ? 'var(--red)' : 'var(--border)'}`, borderRadius: '6px', padding: '7px 13px', cursor: 'pointer' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>
                  Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                </button>
              )}
              <span style={{ fontSize: '0.75rem', color: '#888' }}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                style={{ padding: '0 10px', border: '1px solid var(--border)', borderRight: 'none', borderRadius: '3px 0 0 3px', fontSize: '0.78rem', color: 'var(--ink)', outline: 'none', background: '#fff', width: isMobile ? '110px' : '150px', height: '33px' }} />
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ fontSize: '0.72rem', padding: '0 8px', border: '1px solid var(--border)', borderRadius: '0 3px 3px 0', color: '#444', background: '#fff', outline: 'none', cursor: 'pointer', height: '33px' }}>
                <option value="newest">Newest</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--light)', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>No products match your filters.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: prodCols, gap: '10px' }}>
              {filtered.map((p, i) => (
                <div key={p._id} className="prod-card" onClick={() => navigate(`/products/${p._id}`)}>
                  <div style={{ height: isMobile ? '160px' : '220px', background: CARD_BG[i % CARD_BG.length], position: 'relative', overflow: 'hidden' }}>
                    <div className="pcard-img-inner" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '0.65rem', color: '#bbb' }}>Photo</span>}
                    </div>
                    {p.badge && <span style={{ position: 'absolute', top: '6px', left: '6px', background: 'var(--red)', color: '#fff', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 6px', borderRadius: '3px', zIndex: 2 }}>{p.badge}</span>}
                    <button className="pcard-quick" onClick={e => { e.stopPropagation(); user ? addToCart(p) : navigate('/login') }}>+ Cart</button>
                  </div>
                  <div style={{ padding: '9px 10px 11px' }}>
                    {(p.flavour || p.puffs) && (
                      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        {[p.flavour, p.puffs].filter(Boolean).map((t, ti) => (
                          <span key={ti} style={{ fontSize: '0.48rem', color: '#888', background: 'var(--soft)', border: '1px solid var(--border)', padding: '1px 4px', borderRadius: '2px' }}>{t}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: isMobile ? '0.68rem' : '0.72rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '3px', lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '7px', borderTop: '1px solid #f0f2f5' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)' }}>Rs. {p.price}</span>
                      <button onClick={e => { e.stopPropagation(); navigate(`/products/${p._id}`) }} style={{ fontSize: '0.55rem', fontWeight: 600, color: 'var(--mid)', background: 'transparent', border: '1px solid var(--border)', borderRadius: '3px', padding: '3px 7px', cursor: 'pointer' }}>View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer isMobile={isMobile} />
    </div>
  )
}