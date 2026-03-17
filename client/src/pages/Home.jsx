import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../App'

const API = 'http://localhost:5000/api'

// ── hero slider data ──────────────────────────────────────────
const SLIDES = [
  {
    bg: 'linear-gradient(125deg,#06091a 0%,#0e1e42 40%,#183278 65%,#0e1e42 100%)',
    blob: '#2050ee',
    num: '01 / 04',
    heading: ['Taste the', 'difference.'],
    body: 'Premium disposable vapes with rich flavours. Delivered discreetly across Nepal — pay with eSewa or Khalti.',
    cta1: { label: 'Shop all flavours', path: '/products' },
    cta2: { label: 'Track order →', path: '/track' },
  },
  {
    bg: 'linear-gradient(125deg,#060e08 0%,#0d2218 40%,#174030 65%,#0d2218 100%)',
    blob: '#18805a',
    num: '02 / 04',
    heading: ['20+ flavours,', 'one place.'],
    body: 'Strawberry, mango, blueberry, menthol and more — all authentic, in stock, ready to ship same day.',
    cta1: { label: 'Browse collection', path: '/products' },
    cta2: { label: 'View flavours', path: '/products?filter=flavour' },
  },
  {
    bg: 'linear-gradient(125deg,#0c0612 0%,#1c0c2e 40%,#30164e 65%,#1c0c2e 100%)',
    blob: '#5012a0',
    num: '03 / 04',
    heading: ['Premium quality,', 'always.'],
    body: 'Every device is 100% authentic. No fakes, no knockoffs — we stand behind everything we stock.',
    cta1: { label: 'Shop now', path: '/products' },
    cta2: { label: 'Learn more', path: '/about' },
  },
  {
    bg: 'linear-gradient(125deg,#100e00 0%,#282000 40%,#443600 65%,#282000 100%)',
    blob: '#806000',
    num: '04 / 04',
    heading: ['Buy in bulk,', 'save more.'],
    body: 'Wholesale pricing for shops and resellers. Tiered discounts, priority dispatch, support in KTM.',
    cta1: { label: 'Wholesale pricing', path: '/wholesale' },
    cta2: { label: 'Contact us', path: '/contact' },
    double: true,
  },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  const { user } = useAuth()

  // slider
  const [current, setCurrent] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [bars, setBars] = useState(['run', '', '', ''])
  const timerRef = useRef(null)

  useEffect(() => {
    axios.get(`${API}/products/recent`).then(res => setProducts(res.data)).catch(() => {})
  }, [])

  // slider auto-advance
  useEffect(() => {
    timerRef.current = setTimeout(() => goTo((current + 1) % SLIDES.length), 4200)
    return () => clearTimeout(timerRef.current)
  }, [current])

  // inject keyframes once — only the animations we need
  useEffect(() => {
    const id = 'volt-hero-kf'
    if (!document.getElementById(id)) {
      const s = document.createElement('style')
      s.id = id
      s.textContent = `
        @keyframes vHeroFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes vHeroBar    { from{width:0} to{width:100%} }
        @keyframes vHeroFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes voltTicker  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `
      document.head.appendChild(s)
    }
  }, [])

  function goTo(n) {
    clearTimeout(timerRef.current)
    setCurrent(n)
    setAnimKey(k => k + 1)
    setBars(SLIDES.map((_, i) => i < n ? 'done' : i === n ? 'run' : ''))
  }

  const handleOrder = (productId) => {
    if (user) navigate(`/order/${productId}`)
    else navigate('/login')
  }

  const bgs = ['#e8ecf6', '#e8f2ee', '#ece8f6']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* hero section*/}
      <section style={{ position: 'relative', height: 650, overflow: 'hidden', background: '#080c16' }}>
        {SLIDES.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            opacity: current === i ? 1 : 0,
            transition: 'opacity 0.7s',
            pointerEvents: current === i ? 'all' : 'none',
          }}>
            {/* gradient bg */}
            <div style={{ position: 'absolute', inset: 0, background: s.bg }} />
            {/* glow blob */}
            <div style={{
              position: 'absolute', borderRadius: '50%', filter: 'blur(75px)',
              width: 300, height: 300, right: '6%', top: '-25%',
              background: s.blob, opacity: 0.12,
              animation: 'vHeroFloat 4s ease-in-out infinite',
            }} />
            {/* left-to-right dark overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg,rgba(0,0,0,.7) 0%,rgba(0,0,0,.3) 55%,rgba(0,0,0,.04) 100%)',
            }} />

            {/* slide text */}
            <div
              key={current === i ? animKey : i}
              style={{
                position: 'relative', zIndex: 2,
                padding: '0 106px', maxWidth: 530,
                animation: current === i ? 'vHeroFadeUp .55s ease both' : 'none',
              }}
            >
              <div style={{
                fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,.3)', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ display: 'block', width: 22, height: 1, background: 'rgba(255,255,255,.3)', flexShrink: 0 }} />
                {s.num}
              </div>
              <h1 style={{
                fontFamily: 'var(--serif)', fontSize: 50, fontWeight: 200,
                color: '#fff', lineHeight: 1.03, letterSpacing: '-0.025em', marginBottom: 16,
              }}>
                {s.heading[0]}<br />
                <i style={{ fontStyle: 'italic', fontWeight: 500 }}>{s.heading[1]}</i>
              </h1>
              <p style={{
                fontSize: 11, color: 'rgba(255,255,255,.45)', lineHeight: 1.9,
                maxWidth: 330, marginBottom: 30, fontWeight: 300,
              }}>{s.body}</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => navigate(s.cta1.path)}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  style={{
                    fontSize: 9, padding: '12px 28px', borderRadius: 100,
                    background: '#fff', color: '#0c1628', border: 'none', cursor: 'pointer',
                    letterSpacing: '0.09em', textTransform: 'uppercase', fontWeight: 600,
                    transition: 'transform .22s',
                  }}
                >{s.cta1.label}</button>
                <button
                  onClick={() => navigate(s.cta2.path)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.5)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.22)'; e.currentTarget.style.color = 'rgba(255,255,255,.6)' }}
                  style={{
                    fontSize: 9, padding: '12px 28px', borderRadius: 100,
                    background: 'transparent', color: 'rgba(255,255,255,.6)',
                    border: '1px solid rgba(255,255,255,.22)', cursor: 'pointer',
                    letterSpacing: '0.09em', textTransform: 'uppercase', transition: 'all .22s',
                  }}
                >{s.cta2.label}</button>
              </div>
            </div>

            {/* vape image area — replace the inner div/span with <img> when you have photos */}
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '40%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1, gap: s.double ? 12 : 0,
            }}>
              {s.double ? (
                <>
                  {[0, 28].map((mt, idx) => (
                    <div key={idx} onClick={() => navigate('/products')} style={{
                      width: 76, height: 200, borderRadius: 22,
                      background: 'rgba(255,255,255,.06)', border: '1px dashed rgba(255,255,255,.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      animation: `vHeroFloat 4s ease-in-out ${idx * 0.5}s infinite`,
                      cursor: 'pointer', marginTop: mt,
                    }}>
                      <span style={{ fontSize: 8, color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', writingMode: 'vertical-rl', letterSpacing: '0.08em' }}>product</span>
                    </div>
                  ))}
                </>
              ) : (
                <div onClick={() => navigate('/products')} style={{
                  width: 90, height: 245, borderRadius: 22,
                  background: 'rgba(255,255,255,.06)', border: '1px dashed rgba(255,255,255,.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'vHeroFloat 4s ease-in-out infinite', cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 8, color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', writingMode: 'vertical-rl', letterSpacing: '0.08em' }}>your image</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* progress bars */}
        <div style={{ position: 'absolute', bottom: 26, left: 76, display: 'flex', alignItems: 'center', gap: 14, zIndex: 10 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {bars.map((state, i) => (
              <div
                key={i} onClick={() => goTo(i)}
                style={{ width: 38, height: 2, background: 'rgba(255,255,255,.15)', borderRadius: 1, overflow: 'hidden', cursor: 'pointer' }}
              >
                <div style={{
                  height: '100%', borderRadius: 1, background: 'rgba(255,255,255,.8)',
                  width: state === 'done' ? '100%' : 0,
                  animation: state === 'run' ? 'vHeroBar 4.2s linear forwards' : 'none',
                }} />
              </div>
            ))}
          </div>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,.22)', letterSpacing: '0.1em' }}>{SLIDES[current].num}</span>
        </div>

        {/* prev / next arrows */}
        <div style={{ position: 'absolute', bottom: 18, right: 60, display: 'flex', gap: 8, zIndex: 10 }}>
          {['‹', '›'].map((ch, idx) => (
            <button
              key={ch}
              onClick={() => goTo(idx === 0 ? (current - 1 + SLIDES.length) % SLIDES.length : (current + 1) % SLIDES.length)}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.14)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.4)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.color = 'rgba(255,255,255,.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)' }}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.05)',
                color: 'rgba(255,255,255,.5)', fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .22s',
              }}
            >{ch}</button>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Everything below is UNCHANGED from your
          original Home.jsx
      ══════════════════════════════════════════ */}

      {/* TICKER */}
      <div style={{ overflow: 'hidden', padding: '12px 0', background: 'var(--navy)' }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'voltTicker 26s linear infinite', fontSize: '0.67rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {['Discreet delivery', 'eSewa · Khalti accepted', 'Same day dispatch · KTM', '20+ flavours in stock', 'Wholesale available', 'Track your order anytime',
            'Discreet delivery', 'eSewa · Khalti accepted', 'Same day dispatch · KTM', '20+ flavours in stock', 'Wholesale available', 'Track your order anytime'
          ].map((t, i) => (
            <span key={i} style={{ padding: '0 28px', color: i % 2 === 0 ? 'rgba(255,255,255,.82)' : 'rgba(255,255,255,.38)', borderRight: '1px solid rgba(255,255,255,.1)', fontWeight: i % 2 === 0 ? 500 : 300 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* RECENTLY ADDED */}
      <div style={{ padding: '88px 56px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '8px', fontWeight: 500 }}>Just dropped</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 200, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
              Recently <i style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--navy)' }}>added</i>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--light)' }}>20+ flavours available</span>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/products')}>View all →</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
          {products.length === 0
            ? bgs.map((bg, i) => (
                <div key={i} style={{ borderRadius: '14px', overflow: 'hidden', background: '#fff', border: '1px solid var(--border)', height: '320px', opacity: 0.5 }}>
                  <div style={{ height: '180px', background: bg }} />
                </div>
              ))
            : products.map((p, i) => (
                <div key={p._id}
                  style={{ borderRadius: '14px', overflow: 'hidden', background: '#fff', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all .3s cubic-bezier(.25,.8,.25,1)', display: 'flex', flexDirection: 'column' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 56px rgba(15,31,61,0.11)'; e.currentTarget.style.borderColor = 'transparent' }}
                  onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  <div style={{ height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: bgs[i % bgs.length], position: 'relative' }}>
                    {p.image
                      ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.7)', border: '1px dashed rgba(15,31,61,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📦</div>
                        </div>
                    }
                    {p.badge && (
                      <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'var(--navy)', color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
                        {p.badge}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    {(p.flavour || p.puffs || p.nicotine) && (
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {[p.flavour, p.puffs, p.nicotine].filter(Boolean).map((tag, ti) => (
                          <span key={ti} style={{ fontSize: '0.6rem', color: 'var(--mid)', background: 'var(--soft)', padding: '3px 10px', borderRadius: '100px', border: '1px solid var(--border)' }}>{tag}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 200, fontStyle: 'italic', lineHeight: 1.3, color: 'var(--ink)' }}>{p.name}</div>
                    {p.description && <div style={{ fontSize: '0.74rem', color: 'var(--mid)', lineHeight: 1.6 }}>{p.description}</div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--navy)' }}>Rs. {p.price}</span>
                      <button
                        onClick={() => handleOrder(p._id)}
                        style={{ fontSize: '0.64rem', fontFamily: 'var(--sans)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', padding: '8px 18px', borderRadius: '100px', background: 'var(--navy)', color: '#fff', border: '1.5px solid var(--navy)', transition: 'all .18s' }}
                        onMouseOver={e => e.currentTarget.style.background = 'var(--navy2)'}
                        onMouseOut={e => e.currentTarget.style.background = 'var(--navy)'}
                      >
                        Order now
                      </button>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
      </div>

      {/* VIEW ALL BANNER */}
      <div style={{ padding: '0 56px 88px' }}>
        <div style={{ background: 'var(--navy)', borderRadius: '16px', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 200, fontStyle: 'italic', color: '#fff', marginBottom: '6px' }}>See all flavours & devices</h3>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>Strawberry, mango, watermelon, tobacco and more — all in one place.</p>
          </div>
          <button className="btn btn-white" onClick={() => navigate('/products')}>Browse all products →</button>
        </div>
      </div>

      {/* WHOLESALE */}
      <div style={{ padding: '0 56px 88px', borderTop: '1px solid var(--border)', paddingTop: '88px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ background: 'var(--navy)', padding: '56px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', fontWeight: 500 }}>For businesses & resellers</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', fontWeight: 200, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '16px' }}>
              Buy in bulk,<br /><i style={{ fontStyle: 'italic', fontWeight: 500 }}>save more.</i>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '320px' }}>
              Running a shop? Stocking up for resale? We offer wholesale pricing on all products. Just reach out.
            </p>
            <button className="btn btn-white" style={{ width: 'fit-content' }} onClick={() => window.open('mailto:volt@gmail.com?subject=Wholesale Inquiry')}>
              Get wholesale pricing →
            </button>
          </div>
          <div style={{ background: '#fff', padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '26px' }}>
            {[
              { icon: '📦', title: 'Bulk order discounts', desc: 'The more you order, the less you pay per unit. Tiered pricing on all products.' },
              { icon: '🚚', title: 'Priority dispatch', desc: 'Wholesale orders get priority handling and same day dispatch before 2 PM.' },
              { icon: '🤝', title: 'Dedicated support', desc: "A direct line to our team. We'll help you figure out what to stock and how much." },
            ].map((perk, i) => (
              <div key={i}>
                {i > 0 && <div style={{ height: '1px', background: 'var(--border)', marginBottom: '26px' }} />}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--soft)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{perk.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>{perk.title}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--mid)', lineHeight: 1.65 }}>{perk.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PAYMENT BAND */}
      <div style={{ padding: '48px 56px', background: 'var(--soft)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 200, fontStyle: 'italic', marginBottom: '5px', color: 'var(--ink)' }}>Simple, discreet payments</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--mid)' }}>Scan, pay, upload your screenshot. That's all we need.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {['eSewa', 'Khalti', 'Bank transfer', 'Same day dispatch', 'Wholesale available'].map(tag => (
            <div key={tag} style={{ padding: '9px 18px', borderRadius: '100px', border: '1.5px solid var(--border)', fontSize: '0.68rem', color: 'var(--mid)', letterSpacing: '0.06em', background: '#fff', fontWeight: 500 }}>{tag}</div>
          ))}
        </div>
      </div>

      {/* TRUST */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderTop: '1px solid var(--border)' }}>
        {[
          { n: '01', title: '100% authentic products', desc: 'Every device we sell is genuine. No fakes, no knockoffs — we stand behind every product.' },
          { n: '02', title: 'Discreet packaging', desc: 'All orders ship in plain, unmarked packaging. Your privacy is our priority.' },
          { n: '03', title: 'Same day dispatch', desc: 'Order before 3 PM and we dispatch same day. Most Kathmandu orders arrive next day.' },
        ].map((item, i) => (
          <div key={i}
            style={{ padding: '52px 48px', borderRight: i < 2 ? '1px solid var(--border)' : 'none', background: 'var(--bg)', transition: 'background .2s' }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--soft)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--bg)'}
          >
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '2.2rem', fontWeight: 200, color: 'var(--border)', marginBottom: '16px', lineHeight: 1 }}>{item.n}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>{item.title}</div>
            <div style={{ fontSize: '0.76rem', color: 'var(--mid)', lineHeight: 1.75 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* LOGIN CALLOUT */}
      {!user && (
        <div style={{ padding: '48px 56px', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '32px' }}>
            <div>
              <h4 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 200, fontStyle: 'italic', marginBottom: '6px', color: 'var(--ink)' }}>Have an account? Your orders are waiting.</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--mid)', lineHeight: 1.6 }}>Log in to view order history, track all orders, and reorder your favourites in seconds.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
              <button className="btn btn-outline" onClick={() => navigate('/login')}>Log in</button>
              <button className="btn btn-navy" onClick={() => navigate('/signup')}>Create account</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ background: 'var(--navy)', padding: '68px 56px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 500, color: '#fff', marginBottom: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              VOLT <span style={{ fontStyle: 'italic', fontWeight: 200, textTransform: 'none', fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)', marginLeft: '3px' }}>vapour</span>
            </div>
            <div style={{ fontSize: '0.77rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, maxWidth: '210px' }}>
              Premium disposable vapes delivered discreetly across Nepal. Retail and wholesale available.
            </div>
          </div>
          {[
            { title: 'Shop', links: ['All products', 'Disposables', 'Pods', 'Flavours'] },
            { title: 'Account', links: ['Log in', 'Sign up', 'My orders', 'Track order'] },
            { title: 'Contact', links: ['volt@gmail.com', '+977 98XXXXXXXX', 'Kathmandu, Nepal', 'Instagram'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '14px', fontWeight: 500 }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {col.links.map(link => (
                  <span key={link} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontWeight: 300, transition: 'color .15s' }}
                    onMouseOver={e => e.currentTarget.style.color = '#fff'}
                    onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                  >{link}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '22px', display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>
          <span>© 2025 VOLT Vapour · Kathmandu, Nepal</span>
          <span>Retail & Wholesale</span>
        </div>
      </footer>
    </div>
  )
}