import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth, useCart } from '../App'
import { useIsMobile, useIsTablet } from '../hooks/useWindowWidth'
import API_BASE from '../api'

const API = `${API_BASE}/api`

const SHOWCASE = [
  { img: '/strawberry.jpg', name: 'Strawberry', bg: 'linear-gradient(135deg,#ffd6d6,#ff8a8a)' },
  { img: '/mango.jpg', name: 'Mango', bg: 'linear-gradient(135deg,#ffe8b3,#ffb347)' },
  { img: '/blueberry.jpg', name: 'Blueberry', bg: 'linear-gradient(135deg,#d6d6ff,#8a8aff)' },
  { img: '/menthol.jpg', name: 'Menthol', bg: 'linear-gradient(135deg,#d6f5e8,#4CAF7D)' },
  { img: '/watermelon.jpg', name: 'Watermelon', bg: 'linear-gradient(135deg,#ffd6e8,#ff6699)' },
  { img: '/grape.jpg', name: 'Grape', bg: 'linear-gradient(135deg,#e8d6ff,#9966ff)' },
  { img: '/lemon.jpg', name: 'Lemon', bg: 'linear-gradient(135deg,#fffbd6,#ffe066)' },
  { img: '/coolmint.jpg', name: 'Cool Mint', bg: 'linear-gradient(135deg,#d6f5ff,#66ccff)' },
]

const STATS = [
  { n: '20+', label: 'Flavours Available' },
  { n: '100%', label: 'Authentic Guaranteed' },
  { n: 'Thousands of', label: 'Happy Customers' },
]

const TICKER = [
  '★ Free delivery over Rs. 3000', 'eSewa & Khalti', '★ Same day dispatch KTM',
  '20+ flavours', '★ 100% authentic', 'Wholesale pricing',
  '★ Discreet packaging', 'Order before 3 PM',
]

const FLAVOURS = [
  { label: 'Strawberry', bg: 'linear-gradient(135deg,#ffd6d6,#ff8a8a)', img: '/strawberry.jpg' },
  { label: 'Mango', bg: 'linear-gradient(135deg,#ffe8b3,#ffb347)', img: '/mango.jpg' },
  { label: 'Blueberry', bg: 'linear-gradient(135deg,#d6d6ff,#8a8aff)', img: '/blueberry.jpg' },
  { label: 'Menthol', bg: 'linear-gradient(135deg,#d6f5e8,#4CAF7D)', img: '/menthol.jpg' },
  { label: 'Watermelon', bg: 'linear-gradient(135deg,#ffd6e8,#ff6699)', img: '/watermelon.jpg' },
  { label: 'Grape', bg: 'linear-gradient(135deg,#e8d6ff,#9966ff)', img: '/grape.jpg' },
  { label: 'Lemon', bg: 'linear-gradient(135deg,#fffbd6,#ffe066)', img: '/lemon.jpg' },
  { label: 'Cool Mint', bg: 'linear-gradient(135deg,#d6f5ff,#66ccff)', img: '/coolmint.jpg' },
]

const CARD_BG = ['#f5e8e8','#fdf3e0','#eae8f5','#e8f5ea']

const TRUST_ITEMS = [
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
    title: '100% Authentic',
    sub: 'Every single device is sourced directly and verified before it hits our shelves. Zero fakes. Zero exceptions.',
    stat: '0 fakes', statLabel: 'ever sold',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>,
    title: 'Same Day Dispatch',
    sub: 'Order before 3 PM and your package leaves the same day.',
    stat: '3 PM', statLabel: 'cutoff in KTM',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>,
    title: 'eSewa & Khalti',
    sub: 'Pay the way you already do. Every major digital wallet accepted.',
    stat: '3+', statLabel: 'payment methods',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9.1 8V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>,
    title: 'Discreet Packaging',
    sub: 'Plain, unmarked box. No logos, no hints.',
    stat: '100%', statLabel: 'plain packaging',
  },
]

function WhyVolt({ navigate, isMobile }) {
  const [active, setActive] = useState(0)
  const intervalRef = useRef(null)

  const startAuto = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => setActive(a => (a + 1) % TRUST_ITEMS.length), 3000)
  }

  useEffect(() => { startAuto(); return () => clearInterval(intervalRef.current) }, [])

  const handleClick = (i) => { setActive(i); startAuto() }
  const item = TRUST_ITEMS[active]

  return (
    <section style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: isMobile ? '48px 16px' : '80px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '8px' }}>Why choose us</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '1.4rem' : '1.6rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.15 }}>
            Built different.<br /><em style={{ fontStyle: 'italic', color: 'var(--red)' }}>On purpose.</em>
          </div>
        </div>
        <button onClick={() => navigate('/about')} style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--red)', border: '1px solid var(--red)', borderRadius: '3px', padding: '8px 16px', background: 'transparent', cursor: 'pointer' }}>Our story →</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {TRUST_ITEMS.map((t, i) => (
            <div key={i} onClick={() => handleClick(i)} style={{ padding: '16px 18px', borderRadius: '10px', border: `1.5px solid ${i === active ? 'var(--red)' : 'var(--border)'}`, background: i === active ? '#fff8f8' : '#fff', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0, background: i === active ? 'var(--red)' : '#f0f2f5', color: i === active ? '#fff' : 'var(--light)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>{t.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: i === active ? 'var(--ink)' : 'var(--mid)' }}>{t.title}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--light)' }}>Click to learn more</div>
              </div>
              <div style={{ color: i === active ? 'var(--red)' : 'transparent', fontSize: '1rem' }}>→</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--navy)', borderRadius: '14px', padding: isMobile ? '28px 20px' : '48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '280px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(232,65,74,0.08)', pointerEvents: 'none' }} />
          <div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--red)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>{item.icon}</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '1.2rem' : '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>{item.title}</div>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>{item.sub}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--red)', lineHeight: 1 }}>{item.stat}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '4px' }}>{item.statLabel}</div>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
            {TRUST_ITEMS.map((_, i) => (
              <div key={i} onClick={() => handleClick(i)} style={{ width: i === active ? '24px' : '6px', height: '6px', borderRadius: '3px', background: i === active ? 'var(--red)' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function WholesalePromo({ navigate, isMobile }) {
  const perks = [
    { n: 'Tiered pricing', sub: 'Better rates as you order more' },
    { n: 'Priority dispatch', sub: 'Your orders ship first, always' },
    { n: 'Dedicated support', sub: 'Direct line to our team' },
    { n: 'No minimums', sub: 'Start small, scale up freely' },
  ]
  return (
    <section style={{ background: 'var(--navy)', padding: isMobile ? '56px 16px' : '100px 40px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '80px', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '12px' }}>For resellers &amp; shops</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '18px' }}>Buy in Bulk,<br /><em style={{ fontStyle: 'italic', color: '#f4868c' }}>Save More.</em></div>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: '28px' }}>Running a shop? We work directly with resellers — tiered pricing, priority dispatch, and a team that actually picks up the phone.</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/contact')} style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '12px 22px', cursor: 'pointer' }}>Get wholesale pricing →</button>
            <button onClick={() => navigate('/contact')} style={{ fontSize: '0.75rem', fontWeight: 500, background: 'transparent', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '4px', padding: '12px 18px', cursor: 'pointer' }}>Contact us</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {perks.map((p, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '18px 16px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', marginBottom: '12px' }} />
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{p.n}</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>{p.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer({ isMobile }) {
  const shopLinks = [{ label: 'All Products', path: '/products' }, { label: 'Disposables', path: '/products' }]
  const companyLinks = [{ label: 'About Us', path: '/about' }, { label: 'Contact Us', path: '/contact' }, { label: 'Wholesale', path: '/contact' }, { label: 'Track Order', path: '/track' }]
  const helpItems = [
    { label: 'puffdiaries9@gmail.com', href: 'mailto:puffdiaries9@gmail.com' },
    { label: '+977 9842195574', href: 'tel:+9779842195574' },
    { label: '+977 9824847086', href: 'tel:+9779824847086' },
    { label: 'Dhangadhi, Nepal', href: null },
    { label: '@puffdiaries_9', href: 'https://instagram.com/puffdiaries_9' },
  ]
  return (
    <footer style={{ background: 'var(--navy)', padding: isMobile ? '28px 16px 16px' : '36px 40px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr', gap: isMobile ? '20px' : '28px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ gridColumn: isMobile ? 'span 2' : 'auto' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Puff<span style={{ color: 'var(--red)', fontStyle: 'italic' }}>Diaries</span></div>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.36)', lineHeight: 1.8, maxWidth: '200px', marginBottom: '10px' }}>Nepal's trusted source for authentic disposable vapes.</p>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {['eSewa','Khalti','Bank Transfer'].map(t => <span key={t} style={{ fontSize: '0.62rem', fontWeight: 600, color: 'rgba(255,255,255,0.48)', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 9px', borderRadius: '3px' }}>{t}</span>)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.24)', marginBottom: '10px' }}>Shop</div>
          {shopLinks.map(l => <a key={l.label} href={l.path} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.46)', display: 'block', marginBottom: '7px' }}>{l.label}</a>)}
        </div>
        <div>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.24)', marginBottom: '10px' }}>Company</div>
          {companyLinks.map(l => <a key={l.label} href={l.path} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.46)', display: 'block', marginBottom: '7px' }}>{l.label}</a>)}
        </div>
        {!isMobile && (
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.24)', marginBottom: '11px' }}>Help</div>
            {helpItems.map(l => l.href
              ? <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.46)', display: 'block', marginBottom: '7px' }}>{l.label}</a>
              : <span key={l.label} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.46)', display: 'block', marginBottom: '7px' }}>{l.label}</span>
            )}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.18)' }}>
        <span>© 2025 Puff Diaries · Dhangadhi, Nepal.</span>
        <span>Retail &amp; Wholesale</span>
      </div>
    </footer>
  )
}

export { Footer }

export default function Home() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const tickRef = useRef(null)
  const tickPos = useRef(0)
  const [showIdx, setShowIdx] = useState(0)
  const showRef = useRef(null)
  const showIntervalRef = useRef(null)

  useEffect(() => {
    axios.get(`${API}/products`).then(r => setProducts(r.data.slice(0, 4))).catch(() => {})
  }, [])

  useEffect(() => {
    showIntervalRef.current = setInterval(() => setShowIdx(i => (i + 1) % SHOWCASE.length), 3500)
    return () => clearInterval(showIntervalRef.current)
  }, [])

  useEffect(() => {
    if (!isMobile) return
    const el = showRef.current
    if (!el) return
    el.scrollTo({ left: Math.max(0, showIdx * 336 + 160 - el.clientWidth / 2), behavior: 'smooth' })
  }, [isMobile, showIdx])

  useEffect(() => {
    const el = document.getElementById('ticker-inner')
    if (!el) return
    const run = () => {
      tickPos.current += 0.55
      if (tickPos.current >= el.scrollWidth / 2) tickPos.current = 0
      el.style.transform = `translateX(-${tickPos.current}px)`
      tickRef.current = requestAnimationFrame(run)
    }
    tickRef.current = requestAnimationFrame(run)
    return () => cancelAnimationFrame(tickRef.current)
  }, [])

  const prodCols = isMobile ? 'repeat(2,1fr)' : isTablet ? 'repeat(3,1fr)' : 'repeat(4,1fr)'
  const flavourCols = isMobile ? 'repeat(4,1fr)' : isTablet ? 'repeat(4,1fr)' : 'repeat(8,1fr)'
  const showCardW = 600
  const showGap = 70
  const showRowW = SHOWCASE.length * showCardW + (SHOWCASE.length - 1) * showGap
  const showOffset = showRowW / 2 - (showIdx * (showCardW + showGap) + showCardW / 2)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <style>{`
        .prod-card { transition: box-shadow 0.28s, transform 0.28s; border-radius: 12px; overflow: hidden; }
        .prod-card:hover { box-shadow: 0 14px 40px rgba(0,0,0,0.14); transform: translateY(-4px); }
        .prod-card:hover .prod-img { transform: scale(1.07); }
        .prod-img { transition: transform 0.5s; width: 100%; height: 100%; object-fit: cover; }
        .prod-overlay-btn { position: absolute; bottom: 10px; right: 10px; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; background: var(--ink); color: #fff; border: none; border-radius: 4px; padding: 6px 10px; cursor: pointer; z-index: 2; opacity: 0; transform: translateY(6px); transition: opacity 0.22s, transform 0.22s; }
        @media (hover: hover) { .prod-card:hover .prod-overlay-btn { opacity: 1; transform: translateY(0); } .prod-overlay-btn:hover { background: var(--red) !important; } }
        @media (hover: none) { .prod-overlay-btn { opacity: 1; transform: translateY(0); } }
        .flavour-card { transition: box-shadow 0.28s, transform 0.28s; border-radius: 8px; overflow: hidden; }
        .flavour-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12); transform: translateY(-4px); }
        .flavour-img { transition: transform 0.5s; width: 100%; height: 100%; object-fit: cover; }
        .flavour-card:hover .flavour-img { transform: scale(1.08); }
      `}</style>

      {/* HERO */}
      <section style={{ position: 'relative', height: isMobile ? '92vh' : '100vh', minHeight: '540px', display: 'flex', alignItems: 'center', zIndex: 6 }}>
        {/* Fallback dark gradient — visible while the video loads or if it fails */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 40%, #1e2d55 0%, var(--navy) 55%, var(--navy-dark) 100%)' }} />
        {/* Video background — TODO: drop the real clip at client/public/hero-video.mp4 */}
        <video
          autoPlay muted loop playsInline
          poster="/vapebg1.jpg"
          src="/hero-video.mp4"
          onError={e => { e.currentTarget.style.display = 'none' }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Readability overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8, 11, 18, 0.55)' }} />

        <div style={{ position: 'relative', zIndex: 2, width: '100%', padding: isMobile ? '48px 24px' : '0 72px', textAlign: 'center', transform: isMobile ? 'translateY(-6vh)' : 'translateY(-14vh)' }}>
          <div style={{ fontSize: isMobile ? '0.62rem' : '0.72rem', fontWeight: 700, letterSpacing: '0.22em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ width: '18px', height: '1.5px', background: 'var(--red)', flexShrink: 0 }} />Nepal's no.1 vape shop
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 'clamp(34px,9vw,48px)' : 'clamp(54px,6.5vw,84px)', fontWeight: 600, color: '#fff', lineHeight: 1.05, maxWidth: '640px', margin: '0 auto 16px' }}>
            Premium Vapes,<br /><em style={{ fontStyle: 'italic', color: '#f9a8ac' }}>Discreetly Delivered.</em>
          </h1>
          <p style={{ fontSize: isMobile ? '0.85rem' : '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: '400px', margin: '0 auto 28px' }}>
            Authentic disposables with 20+ flavours. eSewa &amp; Khalti accepted. Same day dispatch.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/products')} style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '3px', padding: '13px 24px', cursor: 'pointer' }}>Shop Collection</button>
            <button onClick={() => navigate('/about')} style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', fontWeight: 500, background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.24)', borderRadius: '3px', padding: '13px 20px', cursor: 'pointer' }}>About Us</button>
          </div>
          <div ref={showRef} style={{ position: 'absolute', left: '50%', top: isMobile ? 'calc(100% + 8px)' : 'calc(100% + 12px)', transform: 'translateX(-50%)', width: '100%', maxWidth: isMobile ? 'none' : '1280px', height: isMobile ? '250px' : '520px', overflowX: isMobile ? 'auto' : 'hidden', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
            <div style={isMobile ? { display: 'flex', alignItems: 'center', height: '100%' } : { position: 'absolute', left: '50%', top: 0, height: '100%', marginLeft: -showRowW / 2, display: 'flex', alignItems: 'center', transform: `translateX(${showOffset}px)`, transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)' }}>
              {SHOWCASE.map((p, i) => (
                <div key={p.name} style={{
                  flexShrink: 0,
                  marginLeft: i === 0 ? 0 : (isMobile ? '16px' : '70px'),
                  transform: isMobile ? 'none' : `rotate(${(i % 2 === 0 ? -1 : 1) * 2.2}deg) translateY(${(i % 3) * 6}px) scale(${i === showIdx ? 1.1 : 1})`,
                  transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
                  zIndex: i === showIdx ? 3 : 1,
                }}>
                  <div style={{
                    width: isMobile ? '320px' : '600px',
                    height: isMobile ? '214px' : '400px',
                    borderRadius: '14px', overflow: 'hidden',
                    background: p.bg,
                    border: '1px solid var(--border)',
                    boxShadow: '0 18px 44px rgba(17,24,39,0.18)',
                  }}>
                    <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '10px', fontSize: isMobile ? '0.68rem' : '0.75rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.04em' }}>{p.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE SHOWCASE */}
      <section style={{ background: 'var(--bg)', padding: isMobile ? 'max(0px, calc(415px - 46vh)) 16px 48px' : 'max(0px, calc(645px - 50vh)) 40px 80px' }}>
        <div>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '6px' }}>The collection</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '1.3rem' : '1.6rem', fontWeight: 600, color: 'var(--ink)' }}>
            A signature <em style={{ fontStyle: 'italic', color: 'var(--red)' }}>line-up</em>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: 'var(--navy)', padding: isMobile ? '40px 16px' : '56px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: isMobile ? '26px' : '0' }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: isMobile ? '0' : '0 28px', borderLeft: isMobile || i === 0 ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '2rem' : '2.6rem', fontWeight: 600, color: '#fff', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TICKER */}
      <div style={{ background: 'var(--red)', padding: '8px 0', overflow: 'hidden' }}>
        <div id="ticker-inner" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} style={{ fontSize: '0.63rem', fontWeight: i % 2 === 0 ? 600 : 400, color: '#fff', padding: '0 18px', letterSpacing: '0.07em', borderRight: '1px solid rgba(255,255,255,0.28)', opacity: i % 2 === 0 ? 1 : 0.8, flexShrink: 0 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* NEW ARRIVALS */}
      <section style={{ padding: isMobile ? '48px 16px' : '80px 40px', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '3px' }}>Just dropped</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: 700, color: 'var(--ink)' }}>New <em style={{ fontStyle: 'italic', color: 'var(--red)' }}>Arrivals</em></div>
          </div>
          <button onClick={() => navigate('/products')} style={{ fontSize: '0.72rem', color: 'var(--red)', fontWeight: 600, border: '1px solid var(--red)', borderRadius: '3px', padding: '6px 12px', background: '#fff', cursor: 'pointer' }}>View all →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: prodCols, gap: '10px' }}>
          {(products.length === 0 ? [{},{},{},{}] : products.slice(0,4)).map((p, i) => (
            <div key={p._id || i} className="prod-card" onClick={() => p._id && navigate(`/products/${p._id}`)} style={{ background: '#fff', border: '1px solid var(--border)', cursor: p._id ? 'pointer' : 'default' }}>
              <div style={{ height: isMobile ? '160px' : '220px', background: CARD_BG[i % CARD_BG.length], position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#bbb' }}>
                {p.image ? <img src={p.image} alt={p.name} className="prod-img" /> : <span>Photo</span>}
                {p.badge && <span style={{ position: 'absolute', top: '6px', left: '6px', background: 'var(--red)', color: '#fff', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 7px', borderRadius: '3px', zIndex: 2 }}>{p.badge}</span>}
                {p._id && <button className="prod-overlay-btn" onClick={e => { e.stopPropagation(); user ? addToCart(p) : navigate('/login') }}>+ Cart</button>}
              </div>
              <div style={{ padding: '9px 10px 11px' }}>
                {p.flavour && <div style={{ fontSize: '0.5rem', color: '#888', background: 'var(--soft)', border: '1px solid var(--border)', padding: '1px 5px', borderRadius: '2px', display: 'inline-block', marginBottom: '4px' }}>{p.flavour}</div>}
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px', lineHeight: 1.3 }}>{p.name || 'Product name'}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #f0f2f5' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)' }}>Rs. {p.price || '—'}</span>
                  {p._id && <span style={{ fontSize: '0.58rem', color: 'var(--red)', fontWeight: 600 }}>View →</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP FLAVOURS */}
      <section style={{ padding: isMobile ? '0 16px 48px' : '0 40px 80px', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '14px', paddingBottom: '12px', borderBottom: '2px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '3px' }}>Browse by taste</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: 700, color: 'var(--ink)' }}>Top <em style={{ fontStyle: 'italic', color: 'var(--red)' }}>Flavours</em></div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: flavourCols, gap: '8px' }}>
          {FLAVOURS.map(f => (
            <div key={f.label} className="flavour-card" onClick={() => navigate(`/products?flavour=${f.label}`)} style={{ background: '#fff', border: '1px solid var(--border)', cursor: 'pointer' }}>
              <div style={{ height: isMobile ? '80px' : '140px', background: f.bg, overflow: 'hidden' }}>
                {f.img && <img src={f.img} alt={f.label} className="flavour-img" />}
              </div>
              <div style={{ padding: '8px 4px', fontSize: isMobile ? '0.6rem' : '0.7rem', fontWeight: 600, color: 'var(--ink)', textAlign: 'center' }}>{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BANNERS */}
      <section style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px', padding: isMobile ? '0 16px 48px' : '0 40px 80px', background: 'var(--bg)' }}>
        {[
          { bgImg: '/vapebg1.jpg', fallbackBg: 'linear-gradient(135deg,#111827,#1a2744)', tag: 'Our story', h: 'Who is', em: 'Puff Diaries?', sub: 'Built out of passion for authentic vapes.', cta: 'Read about us →', cta2: 'Our values', path: '/about' },
          { bgImg: '/vapebg2.jpg', fallbackBg: 'linear-gradient(135deg,#0f3460,#111827)', tag: 'Get in touch', h: 'Questions or', em: 'Wholesale?', sub: "We're a small team and we actually read every message.", cta: 'Contact us →', cta2: 'Wholesale pricing', path: '/contact' },
        ].map((b, i) => (
          <div key={i} onClick={() => navigate(b.path)} style={{ height: isMobile ? '280px' : '400px', position: 'relative', cursor: 'pointer', background: b.fallbackBg, borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${b.bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,14,22,.95) 0%, rgba(10,14,22,.38) 55%, transparent 100%)', zIndex: 1 }} />
            <div style={{ position: 'absolute', bottom: '22px', left: '22px', right: '22px', zIndex: 2 }}>
              <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '8px' }}>{b.tag}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: 700, color: '#fff', lineHeight: 1.18, marginBottom: '8px' }}>{b.h} <em style={{ fontStyle: 'italic' }}>{b.em}</em></div>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.56)', lineHeight: 1.6, marginBottom: '12px', maxWidth: '260px' }}>{b.sub}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '9px 16px', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); navigate(b.path) }}>{b.cta}</button>
                <button style={{ fontSize: '0.62rem', fontWeight: 500, color: 'rgba(255,255,255,0.62)', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', padding: '9px 14px', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); navigate(b.path) }}>{b.cta2}</button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <WholesalePromo navigate={navigate} isMobile={isMobile} />
      <WhyVolt navigate={navigate} isMobile={isMobile} />

      {!user && (
        <section style={{ background: 'var(--bg)', padding: isMobile ? '32px 16px' : '80px 40px' }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: isMobile ? '20px 16px' : '22px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>Track your orders & reorder <em style={{ fontStyle: 'italic', color: 'var(--red)' }}>fast</em></div>
              <p style={{ fontSize: '0.75rem', color: 'var(--light)', lineHeight: 1.6 }}>Create an account to view order history and track deliveries.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button onClick={() => navigate('/login')} style={{ fontSize: '0.72rem', fontWeight: 500, background: 'transparent', color: 'var(--light)', border: '1px solid var(--border)', borderRadius: '3px', padding: '9px 16px', cursor: 'pointer' }}>Log in</button>
              <button onClick={() => navigate('/signup')} style={{ fontSize: '0.72rem', fontWeight: 700, background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '3px', padding: '9px 16px', cursor: 'pointer' }}>Create account</button>
            </div>
          </div>
        </section>
      )}

      <Footer isMobile={isMobile} />
    </div>
  )
}