import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Footer } from './Home'

const STATS = [
  { n: 20, suffix: '+', label: 'Flavours always in stock', detail: 'From icy menthol to tropical mango — something for every mood.' },
  { n: 100, suffix: '%', label: 'Verified authentic', detail: 'Every single device checked. We\'ve never sold a fake and never will.' },
  { n: 500, suffix: '+', label: 'Happy customers in KTM', detail: 'Word spreads fast in this city. Our customers keep coming back.' },
  { n: 0, suffix: '', label: 'Fakes. Ever.', detail: 'This one\'s the most important number on this page.' },
]

const TIMELINE = [
  {
    year: '2021',
    title: 'Fed up.',
    body: 'Two vapers in Kathmandu, tired of paying Rs. 3000 for a device that tasted like burnt plastic on the second puff. Tired of sellers who ghosted after payment. Tired of having no idea if what we bought was even real.',
    highlight: 'Something had to change.',
  },
  {
    year: '2022',
    title: 'We went to the source.',
    body: 'Spent months tracking down actual verified suppliers. Flew samples in. Tested everything ourselves before a single rupee changed hands with a customer. If we wouldn\'t vape it daily, it didn\'t make the cut.',
    highlight: 'First 50 orders. Zero complaints.',
  },
  {
    year: '2023',
    title: 'Word got out.',
    body: 'Started with a WhatsApp group. Then Instagram. Then orders from people we\'d never met, referred by people who trusted us. Launched same-day dispatch in KTM. Added 15 new flavours. Started supplying shops wholesale.',
    highlight: 'Still answering every DM ourselves.',
  },
  {
    year: 'Today',
    title: 'Still the same rule.',
    body: 'Bigger catalogue, faster shipping, more payment options — but the rule hasn\'t changed. If we wouldn\'t use it ourselves, it doesn\'t go on the shelf. That\'s not a slogan. It\'s how we actually operate.',
    highlight: 'KTM\'s most trusted vape shop.',
  },
]

const TEAM_FACTS = [
  { q: 'Favourite flavour?', a: 'Mango Ice. Every single time. No competition.' },
  { q: 'How do you verify products?', a: 'Serial number checks, supplier documentation, and honestly — we vape everything ourselves before it goes live.' },
  { q: 'Do you actually read DMs?', a: 'Yes. Every one. Sometimes at 2am. We\'re a small team and we care too much to ignore messages.' },
  { q: 'Why only disposables for now?', a: 'We\'d rather do one thing exceptionally well than five things badly. Disposables first, done right.' },
  { q: 'Wholesale minimum order?', a: 'No hard minimum. Email us your volume and we\'ll give you honest pricing. No games.' },
  { q: 'What happens if I get a bad device?', a: 'We replace it. No interrogation, no "that\'s not our problem." Just send us a message.' },
]

function CountUp({ target, suffix }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        if (target === 0) { setCount(0); return }
        const steps = 45
        const increment = target / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= target) { setCount(target); clearInterval(timer) }
          else setCount(Math.floor(current))
        }, 1600 / steps)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])
  return <span ref={ref}>{count}{suffix}</span>
}

export default function AboutUs() {
  const navigate = useNavigate()
  const [activeTimeline, setActiveTimeline] = useState(0)
  const [activeVal, setActiveVal] = useState(null)
  const [hoveredStat, setHoveredStat] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: '580px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(125deg, #0d1117 0%, #111827 35%, #0a1628 70%, #0f3460 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px', zIndex: 1 }} />
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(232,65,74,0.07)', filter: 'blur(80px)', zIndex: 1 }} />
        <div style={{ position: 'absolute', bottom: '0', left: '30%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(59,108,204,0.06)', filter: 'blur(60px)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 3, padding: '0 72px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(232,65,74,0.12)', border: '1px solid rgba(232,65,74,0.25)', borderRadius: '20px', padding: '5px 14px', marginBottom: '24px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }} />
            <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--red)', textTransform: 'uppercase' }}>Our story</span>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(38px, 5vw, 62px)', fontWeight: 700, color: '#fff', lineHeight: 1.08, marginBottom: '22px', maxWidth: '640px' }}>
            We got tired of<br />
            <em style={{ fontStyle: 'italic', color: '#f9a8ac' }}>buying fakes.</em><br />
            So we fixed it.
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.48)', lineHeight: 1.85, maxWidth: '420px', marginBottom: '36px' }}>
            Two vapers in Kathmandu who couldn't find a single reliable place to buy authentic disposables. So we built one.
          </p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={() => navigate('/products')}
              style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '14px 30px', cursor: 'pointer', transition: 'background 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dark)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
            >Browse the shop →</button>
            <button onClick={() => navigate('/contact')}
              style={{ fontSize: '0.75rem', fontWeight: 500, background: 'transparent', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', padding: '14px 24px', cursor: 'pointer', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
            >Talk to us</button>
          </div>
        </div>

        <div style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--serif)', fontSize: 'clamp(120px, 16vw, 200px)', fontWeight: 700, color: 'rgba(255,255,255,0.025)', lineHeight: 1, userSelect: 'none', zIndex: 2, whiteSpace: 'nowrap', letterSpacing: '-0.04em' }}>
          VOLT
        </div>

        {/* Vape smoke cloud — right side */}
        <div style={{ position: 'absolute', right: '80px', top: 0, bottom: 0, width: '420px', zIndex: 2, pointerEvents: 'none' }}>
          <style>{`
            @keyframes smokeRise1 { 0% { transform: translateY(0px) translateX(0px) scale(0.4); opacity: 0; } 15% { opacity: 0.18; } 70% { opacity: 0.12; } 100% { transform: translateY(-340px) translateX(30px) scale(2.8); opacity: 0; } }
            @keyframes smokeRise2 { 0% { transform: translateY(0px) translateX(0px) scale(0.3); opacity: 0; } 15% { opacity: 0.15; } 70% { opacity: 0.09; } 100% { transform: translateY(-300px) translateX(-40px) scale(2.4); opacity: 0; } }
            @keyframes smokeRise3 { 0% { transform: translateY(0px) translateX(0px) scale(0.5); opacity: 0; } 20% { opacity: 0.22; } 65% { opacity: 0.1; } 100% { transform: translateY(-380px) translateX(15px) scale(3.2); opacity: 0; } }
            @keyframes smokeRise4 { 0% { transform: translateY(0px) translateX(0px) scale(0.35); opacity: 0; } 15% { opacity: 0.14; } 60% { opacity: 0.08; } 100% { transform: translateY(-260px) translateX(-25px) scale(2.0); opacity: 0; } }
            @keyframes smokeRise5 { 0% { transform: translateY(0px) translateX(0px) scale(0.45); opacity: 0; } 20% { opacity: 0.2; } 70% { opacity: 0.11; } 100% { transform: translateY(-420px) translateX(50px) scale(3.6); opacity: 0; } }
          `}</style>
          {/* Smoke origin point — bottom center of right panel */}
          {[
            { w: 90,  left: '48%', delay: '0s',    dur: '5.5s', anim: 'smokeRise1' },
            { w: 70,  left: '52%', delay: '0.6s',  dur: '4.8s', anim: 'smokeRise2' },
            { w: 110, left: '44%', delay: '1.2s',  dur: '6.2s', anim: 'smokeRise3' },
            { w: 60,  left: '56%', delay: '1.8s',  dur: '4.4s', anim: 'smokeRise4' },
            { w: 130, left: '40%', delay: '2.4s',  dur: '7s',   anim: 'smokeRise5' },
            { w: 80,  left: '50%', delay: '0.3s',  dur: '5s',   anim: 'smokeRise2' },
            { w: 100, left: '46%', delay: '3s',    dur: '6s',   anim: 'smokeRise1' },
            { w: 55,  left: '58%', delay: '0.9s',  dur: '4.2s', anim: 'smokeRise4' },
            { w: 120, left: '42%', delay: '1.5s',  dur: '6.8s', anim: 'smokeRise5' },
            { w: 75,  left: '54%', delay: '2.1s',  dur: '5.2s', anim: 'smokeRise3' },
            { w: 95,  left: '49%', delay: '3.6s',  dur: '5.8s', anim: 'smokeRise1' },
            { w: 65,  left: '53%', delay: '4.2s',  dur: '4.6s', anim: 'smokeRise2' },
          ].map((p, i) => (
            <div key={i} style={{
              position: 'absolute',
              bottom: '15%',
              left: p.left,
              width: `${p.w}px`,
              height: `${p.w}px`,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 50%, transparent 75%)',
              animation: `${p.anim} ${p.dur} ease-out infinite`,
              animationDelay: p.delay,
              filter: 'blur(8px)',
            }} />
          ))}
          {/* Secondary smaller puffs for detail */}
          {[
            { w: 40, left: '47%', delay: '0.2s', dur: '3.8s', anim: 'smokeRise4' },
            { w: 35, left: '55%', delay: '1.1s', dur: '3.4s', anim: 'smokeRise2' },
            { w: 45, left: '51%', delay: '2.8s', dur: '4s',   anim: 'smokeRise1' },
            { w: 30, left: '57%', delay: '1.7s', dur: '3.2s', anim: 'smokeRise3' },
            { w: 50, left: '43%', delay: '3.3s', dur: '4.5s', anim: 'smokeRise5' },
          ].map((p, i) => (
            <div key={`s${i}`} style={{
              position: 'absolute',
              bottom: '18%',
              left: p.left,
              width: `${p.w}px`,
              height: `${p.w}px`,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(200,200,220,0.08) 60%, transparent 80%)',
              animation: `${p.anim} ${p.dur} ease-out infinite`,
              animationDelay: p.delay,
              filter: 'blur(5px)',
            }} />
          ))}
        </div>
      </section>

      {/* ── STATS — hover for detail ── */}
      <section style={{ background: 'var(--navy)', padding: '0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {STATS.map((s, i) => (
            <div key={i}
              onMouseEnter={() => setHoveredStat(i)}
              onMouseLeave={() => setHoveredStat(null)}
              style={{
                padding: '48px 32px',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                background: hoveredStat === i ? 'rgba(232,65,74,0.08)' : 'transparent',
                transition: 'background 0.25s',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {hoveredStat === i && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'var(--red)' }} />}
              <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700, color: hoveredStat === i ? 'var(--red)' : '#fff', lineHeight: 1, marginBottom: '8px', transition: 'color 0.25s' }}>
                <CountUp target={s.n} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: hoveredStat === i ? '#fff' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', transition: 'color 0.25s' }}>{s.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65, maxHeight: hoveredStat === i ? '60px' : '0px', overflow: 'hidden', opacity: hoveredStat === i ? 1 : 0, transition: 'max-height 0.3s ease, opacity 0.25s ease' }}>
                {s.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VERTICAL TIMELINE ── */}
      <section style={{ padding: '96px 72px', background: 'var(--bg)' }}>
        <div style={{ marginBottom: '60px' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '10px' }}>How we got here</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>
            The honest version<br /><em style={{ fontStyle: 'italic', color: 'var(--red)' }}>of our story.</em>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {TIMELINE.map((t, i) => (
            <div key={i}
              onClick={() => setActiveTimeline(activeTimeline === i ? null : i)}
              style={{ display: 'flex', gap: '0', cursor: 'pointer' }}
            >
              {/* Left year column */}
              <div style={{ width: '120px', flexShrink: 0, paddingTop: '28px', paddingRight: '24px', textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', fontWeight: 700, color: activeTimeline === i ? 'var(--red)' : 'var(--light)', transition: 'color 0.2s' }}>{t.year}</span>
              </div>

              {/* Center line + dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '40px' }}>
                <div style={{ width: i === 0 ? '0' : '2px', height: '28px', background: 'var(--border)' }} />
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: `2.5px solid ${activeTimeline === i ? 'var(--red)' : 'var(--border)'}`, background: activeTimeline === i ? 'var(--red)' : '#fff', flexShrink: 0, transition: 'all 0.22s', zIndex: 1 }} />
                <div style={{ width: '2px', flex: 1, minHeight: '40px', background: i === TIMELINE.length - 1 ? 'transparent' : 'var(--border)' }} />
              </div>

              {/* Right content */}
              <div style={{ flex: 1, paddingLeft: '24px', paddingBottom: '8px', paddingTop: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)' }}>{t.title}</span>
                </div>
                <div style={{ maxHeight: activeTimeline === i ? '200px' : '0px', overflow: 'hidden', opacity: activeTimeline === i ? 1 : 0, transition: 'max-height 0.4s ease, opacity 0.3s ease' }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--mid)', lineHeight: 1.85, marginBottom: '14px', paddingTop: '4px' }}>{t.body}</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff8f8', border: '1px solid rgba(232,65,74,0.2)', borderRadius: '6px', padding: '8px 14px', marginBottom: '20px' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--red)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--red)' }}>{t.highlight}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VALUES — accordion ── */}
      <section style={{ background: 'var(--navy)', padding: '96px 72px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '80px', alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: '80px' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '10px' }}>What drives us</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.6rem, 2.5vw, 2.1rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: '18px' }}>
              Three rules.<br /><em style={{ fontStyle: 'italic', color: '#f9a8ac' }}>Non-negotiable.</em>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.85, marginBottom: '28px' }}>
              We've had opportunities to cut corners. Import cheaper unverified stock. Charge more because "everyone else does". We said no every time.
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeVal === i ? 'var(--red)' : 'rgba(255,255,255,0.15)', transition: 'background 0.2s' }} />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              {
                num: '01', title: 'We only sell what we\'d buy ourselves.',
                body: 'Every flavour on our site is something at least one of us uses regularly. Not just "tested once" — actually vapes daily. If it doesn\'t make the cut for us personally, it doesn\'t get listed. Full stop.',
                tag: 'Authentication standard',
              },
              {
                num: '02', title: 'We tell you the truth, even if it costs us a sale.',
                body: 'If a product you want is out of stock, we say so instead of shipping something similar and hoping you don\'t notice. If a device has a known issue with a certain flavour, we mention it. Honesty first, always.',
                tag: 'Transparency commitment',
              },
              {
                num: '03', title: 'Your problem is our problem.',
                body: 'Got a bad device? Message us. Something didn\'t arrive? Message us. You have a question at midnight? Message us. We\'re not a faceless store — we\'re two people who genuinely want your experience to be good.',
                tag: 'Customer promise',
              },
            ].map((v, i) => (
              <div key={i}
                onClick={() => setActiveVal(activeVal === i ? null : i)}
                style={{
                  background: activeVal === i ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${activeVal === i ? 'rgba(232,65,74,0.5)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: '12px',
                  padding: '24px 28px',
                  cursor: 'pointer',
                  transition: 'all 0.22s',
                }}
                onMouseEnter={e => { if (activeVal !== i) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                onMouseLeave={e => { if (activeVal !== i) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flex: 1 }}>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--red)', flexShrink: 0, marginTop: '2px' }}>{v.num}</span>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginBottom: activeVal === i ? '12px' : '0', transition: 'margin 0.2s', lineHeight: 1.4 }}>{v.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxHeight: activeVal === i ? '160px' : '0px', overflow: 'hidden', opacity: activeVal === i ? 1 : 0, transition: 'max-height 0.4s ease, opacity 0.3s ease', marginBottom: activeVal === i ? '12px' : '0' }}>
                        {v.body}
                      </div>
                      {activeVal === i && (
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)', background: 'rgba(232,65,74,0.1)', border: '1px solid rgba(232,65,74,0.2)', padding: '3px 10px', borderRadius: '4px' }}>{v.tag}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.3rem', transform: activeVal === i ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.25s', flexShrink: 0 }}>+</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ / REAL TALK ── */}
      <section style={{ padding: '96px 72px', background: 'var(--bg)' }}>
        <div style={{ marginBottom: '52px' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '10px' }}>Straight answers</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>
            Questions people actually<br /><em style={{ fontStyle: 'italic', color: 'var(--red)' }}>ask us.</em>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {TEAM_FACTS.map((f, i) => (
            <div key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                background: '#fff',
                border: `1.5px solid ${openFaq === i ? 'var(--red)' : 'var(--border)'}`,
                borderRadius: '10px',
                padding: '20px 24px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (openFaq !== i) e.currentTarget.style.borderColor = '#f4a0a5' }}
              onMouseLeave={e => { if (openFaq !== i) e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.4 }}>{f.q}</div>
                <div style={{ color: openFaq === i ? 'var(--red)' : 'var(--light)', fontSize: '1.2rem', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.25s, color 0.2s', flexShrink: 0 }}>+</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--mid)', lineHeight: 1.8, maxHeight: openFaq === i ? '120px' : '0px', overflow: 'hidden', opacity: openFaq === i ? 1 : 0, transition: 'max-height 0.35s ease, opacity 0.28s ease', marginTop: openFaq === i ? '10px' : '0' }}>
                {f.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--bg)', padding: '0 72px 96px' }}>
        <div style={{ background: 'var(--ink)', borderRadius: '16px', padding: '64px 72px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '48px', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(232,65,74,0.07)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', left: '45%', bottom: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '12px' }}>Okay, you know us now</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.5rem, 2.8vw, 2rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: '12px' }}>
              Come see what all<br /><em style={{ fontStyle: 'italic', color: '#f9a8ac' }}>the fuss is about.</em>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, maxWidth: '400px' }}>
              20+ authentic flavours. Same day dispatch in KTM. eSewa, Khalti, bank transfer. No account needed to browse.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0, position: 'relative', zIndex: 2 }}>
            <button onClick={() => navigate('/products')}
              style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '15px 34px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dark)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
            >Shop the collection →</button>
            <button onClick={() => navigate('/contact')}
              style={{ fontSize: '0.75rem', background: 'transparent', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '13px 28px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.38)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
            >Say hello first</button>
          </div>
        </div>
      </section>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <Footer />
    </div>
  )
}