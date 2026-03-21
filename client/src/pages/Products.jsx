import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth, useCart } from '../App'
import { Footer } from './Home'
import API_BASE from '../api'

const CARD_BG = ['#f5e8e8','#fdf3e0','#eae8f5','#e8f5ea','#e8f5f5','#f5e8f5','#fdf5e0','#e8eaf5']

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [filters, setFilters] = useState({ flavours: [], maxPrice: 5000, puffs: [], nicotine: [] })
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const flavour = searchParams.get('flavour')
    if (flavour) {
      setFilters(f => ({ ...f, flavours: [flavour] }))
    }
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <style>{`
        .prod-card { background: #fff; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; cursor: pointer; transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s; }
        .prod-card:hover { box-shadow: 0 10px 36px rgba(0,0,0,0.12); transform: translateY(-4px); border-color: #cdd1da; }
        .prod-card .pcard-img-inner { transition: transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94); }
        .prod-card:hover .pcard-img-inner { transform: scale(1.06); }
        .prod-card .pcard-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,14,22,0.22) 0%, transparent 55%); opacity: 0; transition: opacity 0.3s; }
        .prod-card:hover .pcard-overlay { opacity: 1; }
        .prod-card .pcard-quick { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%) translateY(10px); opacity: 0; transition: opacity 0.25s, transform 0.25s; white-space: nowrap; font-family: var(--sans); font-size: 0.58rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; background: #fff; color: var(--ink); border: none; border-radius: 4px; padding: 6px 13px; cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,0.18); z-index: 3; }
        .prod-card:hover .pcard-quick { opacity: 1; transform: translateX(-50%) translateY(0); }
        .pcard-quick:hover { background: var(--red) !important; color: #fff !important; }
      `}</style>

      <div style={{ padding: '32px 48px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px', alignItems: 'start' }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '24px', position: 'sticky', top: '80px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #f0f2f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Filters
            <span style={{ fontSize: '0.62rem', color: 'var(--red)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setFilters({ flavours:[], maxPrice:5000, puffs:[], nicotine:[] })}>Clear all</span>
          </div>
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '12px' }}>Flavour</div>
            {['Strawberry','Mango','Blueberry','Menthol','Watermelon','Grape'].map(opt => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.78rem', color: '#555', marginBottom: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.flavours.includes(opt)} onChange={() => toggleFilter('flavours', opt)} style={{ accentColor: 'var(--red)', width: '14px', height: '14px' }} />
                {opt}
              </label>
            ))}
          </div>
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '12px' }}>Price Range</div>
            <input type="range" min="500" max="5000" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))} style={{ width: '100%', accentColor: 'var(--red)', marginBottom: '8px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#888' }}>
              <span>Rs. 500</span>
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Rs. {filters.maxPrice.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '12px' }}>Puffs</div>
            {['3k','5k','18k','25k','30k','35k'].map(opt => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.78rem', color: '#555', marginBottom: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.puffs.includes(opt)} onChange={() => toggleFilter('puffs', opt)} style={{ accentColor: 'var(--red)', width: '14px', height: '14px' }} />
                {opt} puffs
              </label>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '12px' }}>Nicotine</div>
            {['2%','5%'].map(opt => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.78rem', color: '#555', marginBottom: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.nicotine.includes(opt)} onChange={() => toggleFilter('nicotine', opt)} style={{ accentColor: 'var(--red)', width: '14px', height: '14px' }} />
                {opt} nic
              </label>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', color: '#888' }}>Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
            <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search flavour, brand..."
                style={{ padding: '0 11px', border: '1px solid var(--border)', borderRight: 'none', borderRadius: '3px 0 0 3px', fontSize: '0.75rem', color: 'var(--ink)', outline: 'none', background: '#fff', width: '165px', height: '33px' }} />
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {filtered.map((p, i) => (
                <div key={p._id} className="prod-card" onClick={() => navigate(`/products/${p._id}`)}>
                  <div style={{ height: '240px', background: CARD_BG[i % CARD_BG.length], position: 'relative', overflow: 'hidden' }}>
                    <div className="pcard-img-inner" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '0.65rem', color: '#bbb' }}>Product photo</span>}
                    </div>
                    <div className="pcard-overlay" />
                    {p.badge && <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--red)', color: '#fff', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 7px', borderRadius: '3px', zIndex: 2 }}>{p.badge}</span>}
                    <button className="pcard-quick" onClick={e => { e.stopPropagation(); user ? addToCart(p) : navigate('/login') }}>+ Add to cart</button>
                  </div>
                  <div style={{ padding: '10px 11px 12px' }}>
                    {(p.flavour || p.puffs) && (
                      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginBottom: '5px' }}>
                        {[p.flavour, p.puffs, p.nicotine].filter(Boolean).map((t, ti) => (
                          <span key={ti} style={{ fontSize: '0.5rem', color: '#888', background: 'var(--soft)', border: '1px solid var(--border)', padding: '1px 5px', borderRadius: '2px' }}>{t}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '3px', lineHeight: 1.3 }}>{p.name}</div>
                    {p.description && <div style={{ fontSize: '0.6rem', color: 'var(--mid)', lineHeight: 1.5, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f0f2f5' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)' }}>Rs. {p.price}</span>
                      <button onClick={e => { e.stopPropagation(); navigate(`/products/${p._id}`) }} style={{ fontSize: '0.56rem', fontWeight: 600, color: 'var(--mid)', background: 'transparent', border: '1px solid var(--border)', borderRadius: '3px', padding: '4px 8px', cursor: 'pointer' }}>View</button>
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