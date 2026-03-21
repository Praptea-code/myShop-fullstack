import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth, useCart } from '../App'
import API_BASE from '../api'

const API = `${API_BASE}/api`

const SLIDES = [
  {
    tag: "Nepal's no.1 vape shop",
    h1: 'Premium Vapes,',
    em: 'Discreetly Delivered.',
    sub: 'Authentic disposables with 20+ flavours. eSewa & Khalti accepted. Same day dispatch in KTM.',
    cta: 'Shop Collection',
    ctaPath: '/products',
    cta2: 'About Us',
    cta2Path: '/about',
    bg: 'radial-gradient(ellipse at 65% 45%, #1e2d55 0%, #111827 55%, #080c14 100%)',
    shadow: '#3b6ccc',
    scrId: 'sc_g0',
    img: '/blueVape.png',
  },
  {
    tag: '20+ flavours in stock',
    h1: 'Every Flavour',
    em: 'You Crave.',
    sub: 'Mango, strawberry, menthol, blueberry — all 100% authentic, ready to ship today.',
    cta: 'Browse Flavours',
    ctaPath: '/products',
    cta2: 'Contact Us',
    cta2Path: '/contact',
    bg: 'radial-gradient(ellipse at 65% 45%, #122a1e 0%, #0d1f14 55%, #060e09 100%)',
    shadow: '#2da05a',
    scrId: 'sc_g1',
    img: '/greenVape.png',
  },
  {
    tag: 'Wholesale available',
    h1: 'Buy in Bulk,',
    em: 'Save More.',
    sub: 'Tiered wholesale pricing for shops and resellers. Priority dispatch. Best prices in KTM.',
    cta: 'Get Pricing',
    ctaPath: '/contact',
    cta2: 'Our Story',
    cta2Path: '/about',
    bg: 'radial-gradient(ellipse at 65% 45%, #22103a 0%, #160920 55%, #0a0510 100%)',
    shadow: '#8b3db8',
    scrId: 'sc_g2',
    img: '/purpleVape.png',
  },
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
    sub: 'Order before 3 PM and your package leaves the same day. We know you don\'t want to wait.',
    stat: '3 PM', statLabel: 'cutoff in KTM',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>,
    title: 'eSewa & Khalti',
    sub: 'Pay the way you already do. Every major digital wallet accepted — no cash, no hassle.',
    stat: '3+', statLabel: 'payment methods',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9.1 8V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>,
    title: 'Discreet Packaging',
    sub: 'Plain, unmarked box. No logos, no hints. Your order looks like everything else on the doorstep.',
    stat: '100%', statLabel: 'plain packaging',
  },
]

function WhyVolt({ navigate }) {
  const [active, setActive] = useState(0)
  const intervalRef = useRef(null)

  const startAuto = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setActive(a => (a + 1) % TRUST_ITEMS.length)
    }, 3000)
  }

  useEffect(() => {
    startAuto()
    return () => clearInterval(intervalRef.current)
  }, [])

  const handleClick = (i) => { setActive(i); startAuto() }
  const item = TRUST_ITEMS[active]

  return (
    <section style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: '80px 40px' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '8px' }}>Why choose us</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.15 }}>
              Built different.<br /><em style={{ fontStyle: 'italic', color: 'var(--red)' }}>On purpose.</em>
            </div>
          </div>
          <button onClick={() => navigate('/about')} style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--red)', border: '1px solid var(--red)', borderRadius: '3px', padding: '8px 16px', background: 'transparent', cursor: 'pointer' }}>Our story →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '32px', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {TRUST_ITEMS.map((t, i) => (
              <div key={i} onClick={() => handleClick(i)} style={{ padding: '20px 22px', borderRadius: '10px', border: `1.5px solid ${i === active ? 'var(--red)' : 'var(--border)'}`, background: i === active ? '#fff8f8' : '#fff', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '10px', flexShrink: 0, background: i === active ? 'var(--red)' : '#f0f2f5', color: i === active ? '#fff' : 'var(--light)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>{t.icon}</div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: i === active ? 'var(--ink)' : 'var(--mid)', marginBottom: '2px' }}>{t.title}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--light)' }}>Click to learn more</div>
                </div>
                <div style={{ marginLeft: 'auto', color: i === active ? 'var(--red)' : 'transparent', fontSize: '1rem' }}>→</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--navy)', borderRadius: '14px', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '360px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(232,65,74,0.08)', pointerEvents: 'none' }} />
            <div>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'var(--red)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}>{item.icon}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '14px', lineHeight: 1.2 }}>{item.title}</div>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, maxWidth: '380px' }}>{item.sub}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginTop: '36px', paddingTop: '28px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '3rem', fontWeight: 700, color: 'var(--red)', lineHeight: 1 }}>{item.stat}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '6px' }}>{item.statLabel}</div>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '20px' }}>
              {TRUST_ITEMS.map((_, i) => (
                <div key={i} onClick={() => handleClick(i)} style={{ width: i === active ? '24px' : '6px', height: '6px', borderRadius: '3px', background: i === active ? 'var(--red)' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.3s' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WholesalePromo({ navigate }) {
  const [hovered, setHovered] = useState(null)
  const perks = [
    { n: 'Tiered pricing', sub: 'Better rates as you order more' },
    { n: 'Priority dispatch', sub: 'Your orders ship first, always' },
    { n: 'Dedicated support', sub: 'Direct line to our team' },
    { n: 'No minimums', sub: 'Start small, scale up freely' },
  ]
  return (
    <section style={{ background: 'var(--navy)', padding: '100px 40px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(232,65,74,0.05)', pointerEvents: 'none' }} />
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '12px' }}>For resellers &amp; shops</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '18px' }}>Buy in Bulk,<br /><em style={{ fontStyle: 'italic', color: '#f4868c' }}>Save More.</em></div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: '36px', maxWidth: '380px' }}>Running a shop in Dhangadhi? We work directly with resellers — tiered pricing, priority dispatch, and a team that actually picks up the phone.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => navigate('/contact')} style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '14px 28px', cursor: 'pointer' }}>Get wholesale pricing →</button>
              <button onClick={() => navigate('/contact')} style={{ fontSize: '0.75rem', fontWeight: 500, background: 'transparent', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '4px', padding: '14px 24px', cursor: 'pointer' }}>Contact us</button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {perks.map((p, i) => (
              <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                style={{ background: hovered === i ? 'rgba(232,65,74,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${hovered === i ? 'rgba(232,65,74,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '10px', padding: '24px 20px', cursor: 'default', transition: 'all 0.22s' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: hovered === i ? 'var(--red)' : 'rgba(255,255,255,0.2)', marginBottom: '14px' }} />
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{p.n}</div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>{p.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const shopLinks = [{ label: 'All Products', path: '/products' }, { label: 'Disposables', path: '/products' }, { label: 'Pod Kits', path: '/products' }, { label: 'E-Liquids', path: '/products' }]
  const companyLinks = [{ label: 'About Us', path: '/about' }, { label: 'Contact Us', path: '/contact' }, { label: 'Wholesale', path: '/contact' }, { label: 'Track Order', path: '/track' }]
  const helpItems = [
    { label: 'puffdiaries9@gmail.com', href: 'mailto:puffdiaries9@gmail.com' },
    { label: '+977 9842195574', href: 'tel:+9779842195574' },
    { label: '+977 9824847086', href: 'tel:+9779824847086' },
    { label: 'Dhangadhi, Nepal', href: null },
    { label: '@puffdiaries_9', href: 'https://instagram.com/puffdiaries_9' },
  ]
  return (
    <footer style={{ background: 'var(--navy)', padding: '36px 40px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '28px', marginBottom: '22px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Puff<span style={{ color: 'var(--red)', fontStyle: 'italic' }}>Diaries</span></div>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.36)', lineHeight: 1.8, maxWidth: '180px', marginBottom: '12px' }}>Nepal's trusted source for authentic disposable vapes. Retail and wholesale available.</p>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {['eSewa','Khalti','Bank Transfer'].map(t => <span key={t} style={{ fontSize: '0.62rem', fontWeight: 600, color: 'rgba(255,255,255,0.48)', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 9px', borderRadius: '3px' }}>{t}</span>)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.24)', marginBottom: '11px' }}>Shop</div>
          {shopLinks.map(l => <a key={l.label} href={l.path} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.46)', display: 'block', marginBottom: '7px', textDecoration: 'none' }}>{l.label}</a>)}
        </div>
        <div>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.24)', marginBottom: '11px' }}>Company</div>
          {companyLinks.map(l => <a key={l.label} href={l.path} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.46)', display: 'block', marginBottom: '7px', textDecoration: 'none' }}>{l.label}</a>)}
        </div>
        <div>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.24)', marginBottom: '11px' }}>Help</div>
          {helpItems.map(l => l.href
            ? <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.46)', display: 'block', marginBottom: '7px', textDecoration: 'none' }}>{l.label}</a>
            : <span key={l.label} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.46)', display: 'block', marginBottom: '7px' }}>{l.label}</span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'rgba(255,255,255,0.18)' }}>
        <span>© 2025 Puff Diaries · Dhangadhi, Nepal. All rights reserved.</span>
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
  const [cur, setCur] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [progW, setProgW] = useState(0)
  const timerRef = useRef(null)
  const progRef = useRef(null)
  const tickRef = useRef(null)
  const tickPos = useRef(0)

  useEffect(() => {
    axios.get(`${API}/products`).then(r => setProducts(r.data.slice(0, 4))).catch(() => {})
  }, [])

  const goTo = (n) => {
    clearTimeout(timerRef.current)
    clearInterval(progRef.current)
    setCur(n)
    setAnimKey(k => k + 1)
    setProgW(0)
    let p = 0
    progRef.current = setInterval(() => {
      p += 0.4
      setProgW(Math.min(p, 100))
      if (p >= 100) clearInterval(progRef.current)
    }, 20)
    timerRef.current = setTimeout(() => goTo((n + 1) % SLIDES.length), 5000)
  }

  useEffect(() => {
    goTo(0)
    return () => { clearTimeout(timerRef.current); clearInterval(progRef.current) }
  }, [])

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

  const s = SLIDES[cur]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <style>{`
        .prod-card { transition: box-shadow 0.28s, transform 0.28s; border-radius: 12px; overflow: hidden; }
        .prod-card:hover { box-shadow: 0 14px 40px rgba(0,0,0,0.14); transform: translateY(-5px); }
        .prod-card:hover .prod-img { transform: scale(1.07); }
        .prod-img { transition: transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94); width: 100%; height: 100%; object-fit: cover; }
        .prod-overlay-btn { position: absolute; bottom: 12px; right: 12px; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; background: var(--ink); color: #fff; border: none; border-radius: 4px; padding: 7px 12px; cursor: pointer; z-index: 2; opacity: 0; transform: translateY(6px); transition: opacity 0.22s, transform 0.22s, background 0.18s; }
        .prod-card:hover .prod-overlay-btn { opacity: 1; transform: translateY(0); }
        .prod-overlay-btn:hover { background: var(--red) !important; }
        .flavour-card { transition: box-shadow 0.28s, transform 0.28s, border-color 0.22s; border-radius: 12px; overflow: hidden; }
        .flavour-card:hover { box-shadow: 0 12px 32px rgba(0,0,0,0.14); transform: translateY(-6px); border-color: var(--red) !important; }
        .flavour-card:hover .flavour-img { transform: scale(1.08); }
        .flavour-img { transition: transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94); width: 100%; height: 100%; object-fit: cover; }
        .banner-card { transition: box-shadow 0.35s; border-radius: 12px; overflow: hidden; }
        .banner-card:hover { box-shadow: 0 24px 64px rgba(0,0,0,0.38); }
        .banner-card:hover .banner-bg-img { transform: scale(1.06); }
        .banner-bg-img { transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94); position: absolute; inset: 0; background-size: cover; background-position: center; }
        .banner-overlay { transition: background 0.4s; }
        .banner-cta { transition: background 0.18s, transform 0.15s; }
        .banner-cta:hover { background: var(--red-dark) !important; transform: translateX(3px); }
        .banner-outline { transition: all 0.18s; }
        .banner-tag { transition: letter-spacing 0.35s; }
      `}</style>

      {/* HERO */}
      <section style={{ position: 'relative', height: '760px', overflow: 'hidden', display: 'flex' }}>
        <div style={{ width: '52%', background: 'var(--navy)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 52px', position: 'relative', zIndex: 4, flexShrink: 0 }}>
          <div style={{ position: 'absolute', right: '-50px', top: 0, bottom: 0, width: '100px', background: 'var(--navy)', transform: 'skewX(-5deg)', zIndex: 1 }} />
          <div key={animKey} style={{ position: 'relative', zIndex: 3 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.22em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '13px', display: 'flex', alignItems: 'center', gap: '8px', animation: 'slideUpFade 0.5s ease both 0.1s', opacity: 0, animationFillMode: 'forwards' }}>
              <span style={{ width: '20px', height: '1.5px', background: 'var(--red)', flexShrink: 0 }} />{s.tag}
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(42px, 5vw, 64px)', fontWeight: 700, color: '#fff', lineHeight: 1.09, marginBottom: '13px', animation: 'slideUpFade 0.55s ease both 0.22s', opacity: 0, animationFillMode: 'forwards' }}>
              {s.h1}<br /><em style={{ fontStyle: 'italic', color: '#f4868c' }}>{s.em}</em>
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: '330px', marginBottom: '26px', animation: 'slideUpFade 0.5s ease both 0.34s', opacity: 0, animationFillMode: 'forwards' }}>{s.sub}</p>
            <div style={{ display: 'flex', gap: '10px', animation: 'slideUpFade 0.45s ease both 0.44s', opacity: 0, animationFillMode: 'forwards' }}>
              <button onClick={() => navigate(s.ctaPath)} style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '3px', padding: '14px 32px', cursor: 'pointer' }}>{s.cta}</button>
              <button onClick={() => navigate(s.cta2Path)} style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', fontWeight: 500, background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.24)', borderRadius: '3px', padding: '14px 28px', cursor: 'pointer' }}>{s.cta2}</button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', transition: 'background 1.2s ease', background: s.bg }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', background: 'linear-gradient(to right, var(--navy), transparent)', zIndex: 4, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-45%)', width: '110px', height: '22px', borderRadius: '50%', filter: 'blur(18px)', opacity: 0.5, zIndex: 2, background: s.shadow, transition: 'background 1.2s ease' }} />
          <div style={{ position: 'absolute', top: '85%', left: '68%', zIndex: 3, animation: 'floatUD 7.8s ease-in-out infinite', transform: 'translateY(-50%)' }}>
            <img key={cur} src={s.img} alt="vape" style={{ width: '340px', objectFit: 'contain', animation: 'floatUD 2.8s ease-in-out infinite' }} />
          </div>
        </div>

        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '58px', background: 'rgba(0,0,0,0.38)', borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '9px', zIndex: 10 }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{String(cur+1).padStart(2,'0')}</span>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>03</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '5px' }}>
            {SLIDES.map((_,i) => <button key={i} onClick={() => goTo(i)} style={{ width: '4px', height: i === cur ? '14px' : '4px', borderRadius: i === cur ? '2px' : '50%', background: i === cur ? 'var(--red)' : 'rgba(255,255,255,0.22)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s' }} />)}
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '20px', right: '70px', display: 'flex', gap: '5px', zIndex: 10 }}>
          {SLIDES.map((_,i) => <button key={i} onClick={() => goTo(i)} style={{ width: i === cur ? '36px' : '22px', height: '3px', borderRadius: '2px', background: i === cur ? 'var(--red)' : 'rgba(255,255,255,0.22)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s' }} />)}
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: '58px', height: '3px', background: 'rgba(255,255,255,0.08)', zIndex: 11 }}>
          <div style={{ height: '100%', background: 'var(--red)', width: `${progW}%`, transition: 'width 0.08s linear' }} />
        </div>
      </section>

      {/* TICKER */}
      <div style={{ background: 'var(--red)', padding: '8px 0', overflow: 'hidden' }}>
        <div id="ticker-inner" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} style={{ fontSize: '0.66rem', fontWeight: i % 2 === 0 ? 600 : 400, color: '#fff', padding: '0 22px', letterSpacing: '0.07em', borderRight: '1px solid rgba(255,255,255,0.28)', opacity: i % 2 === 0 ? 1 : 0.8, flexShrink: 0 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* NEW ARRIVALS */}
      <section style={{ padding: '80px 40px', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '18px', paddingBottom: '12px', borderBottom: '2px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '3px' }}>Just dropped</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)' }}>New <em style={{ fontStyle: 'italic', color: 'var(--red)' }}>Arrivals</em></div>
          </div>
          <button onClick={() => navigate('/products')} style={{ fontSize: '0.72rem', color: 'var(--red)', fontWeight: 600, border: '1px solid var(--red)', borderRadius: '3px', padding: '6px 13px', background: '#fff', cursor: 'pointer' }}>View all →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
          {(products.length === 0 ? [{},{},{},{}] : products.slice(0,4)).map((p, i) => (
            <div key={p._id || i} className="prod-card" onClick={() => p._id && navigate(`/products/${p._id}`)} style={{ background: '#fff', border: '1px solid var(--border)', cursor: p._id ? 'pointer' : 'default' }}>
              <div style={{ height: '240px', background: CARD_BG[i % CARD_BG.length], position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#bbb' }}>
                {p.image ? <img src={p.image} alt={p.name} className="prod-img" /> : <span style={{ display: 'block' }}>Product photo</span>}
                {p.badge && <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--red)', color: '#fff', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 7px', borderRadius: '3px', zIndex: 2 }}>{p.badge}</span>}
                {p._id && <button className="prod-overlay-btn" onClick={e => { e.stopPropagation(); user ? addToCart(p) : navigate('/login') }}>+ Add to cart</button>}
              </div>
              <div style={{ padding: '10px 11px 12px' }}>
                {(p.flavour || p.puffs) && (
                  <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginBottom: '5px' }}>
                    {[p.flavour, p.puffs, p.nicotine].filter(Boolean).map((t,ti) => <span key={ti} style={{ fontSize: '0.5rem', color: '#888', background: 'var(--soft)', border: '1px solid var(--border)', padding: '1px 5px', borderRadius: '2px' }}>{t}</span>)}
                  </div>
                )}
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.35 }}>{p.name || 'Product name'}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f0f2f5' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)' }}>Rs. {p.price || '—'}</span>
                  {p._id && <span style={{ fontSize: '0.58rem', color: 'var(--red)', fontWeight: 600 }}>View →</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP FLAVOURS */}
      <section style={{ padding: '0 40px 80px', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '14px', paddingBottom: '12px', borderBottom: '2px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '3px' }}>Browse by taste</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)' }}>Top <em style={{ fontStyle: 'italic', color: 'var(--red)' }}>Flavours</em></div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: '10px' }}>
          {FLAVOURS.map(f => (
            <div key={f.label} className="flavour-card" onClick={() => navigate(`/products?flavour=${f.label}`)} style={{ background: '#fff', border: '1px solid var(--border)', cursor: 'pointer' }}>
              <div style={{ height: '160px', background: f.bg, overflow: 'hidden' }}>
                {f.img && <img src={f.img} alt={f.label} className="flavour-img" />}
              </div>
              <div style={{ padding: '12px 4px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--ink)', textAlign: 'center' }}>{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BANNERS */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '0 40px 80px', background: 'var(--bg)' }}>
        {[
          { bgImg: '/vapebg1.jpg', fallbackBg: 'linear-gradient(135deg,#111827,#1a2744)', tag: 'Our story', h: 'Who is', em: 'Puff Diaries?', sub: 'Built in Dhangadhi out of passion for authentic vapes. Learn our story, mission and why authenticity is everything.', cta: 'Read about us →', cta2: 'Our values', path: '/about' },
          { bgImg: '/vapebg2.jpg', fallbackBg: 'linear-gradient(135deg,#0f3460,#111827)', tag: 'Get in touch', h: 'Questions or', em: 'Wholesale?', sub: "We're a small team and we actually read every message. Orders, feedback, bulk pricing — just reach out.", cta: 'Contact us →', cta2: 'Wholesale pricing', path: '/contact' },
        ].map((b, i) => (
          <div key={i} className="banner-card" onClick={() => navigate(b.path)} style={{ height: '440px', position: 'relative', cursor: 'pointer', background: b.fallbackBg }}>
            <div className="banner-bg-img" style={{ backgroundImage: `url(${b.bgImg})` }} />
            <div className="banner-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,14,22,.95) 0%, rgba(10,14,22,.38) 55%, transparent 100%)', zIndex: 1 }} />
            <div style={{ position: 'absolute', bottom: '28px', left: '28px', right: '28px', zIndex: 2 }}>
              <div className="banner-tag" style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '9px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ width: '14px', height: '1px', background: 'var(--red)', flexShrink: 0 }} />{b.tag}
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, color: '#fff', lineHeight: 1.18, marginBottom: '10px' }}>{b.h} <em style={{ fontStyle: 'italic' }}>{b.em}</em></div>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.56)', lineHeight: 1.7, marginBottom: '16px', maxWidth: '290px' }}>{b.sub}</p>
              <div style={{ display: 'flex', gap: '9px', flexWrap: 'wrap' }}>
                <button className="banner-cta" style={{ fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 20px', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); navigate(b.path) }}>{b.cta}</button>
                <button className="banner-outline" style={{ fontSize: '0.64rem', fontWeight: 500, color: 'rgba(255,255,255,0.62)', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', padding: '10px 16px', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); navigate(b.path) }}>{b.cta2}</button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <WholesalePromo navigate={navigate} />
      <WhyVolt navigate={navigate} />

      {!user && (
        <section style={{ background: 'var(--bg)', padding: '80px 40px' }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '22px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>Track your orders & reorder <em style={{ fontStyle: 'italic', color: 'var(--red)' }}>fast</em></div>
              <p style={{ fontSize: '0.75rem', color: 'var(--light)', lineHeight: 1.6 }}>Create an account to view order history, track deliveries, and check out faster.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button onClick={() => navigate('/login')} style={{ fontSize: '0.72rem', fontWeight: 500, background: 'transparent', color: 'var(--light)', border: '1px solid var(--border)', borderRadius: '3px', padding: '9px 18px', cursor: 'pointer' }}>Log in</button>
              <button onClick={() => navigate('/signup')} style={{ fontSize: '0.72rem', fontWeight: 700, background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '3px', padding: '9px 18px', cursor: 'pointer' }}>Create account</button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}