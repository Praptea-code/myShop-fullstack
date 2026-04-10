import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Footer } from './Home'
import { useIsMobile } from '../hooks/useWindowWidth'

const STATS = [
  { n: 20, suffix: '+', label: 'Flavours always in stock', detail: 'From icy menthol to tropical mango — something for every mood.' },
  { n: 100, suffix: '%', label: 'Verified authentic', detail: 'Every device checked. We\'ve never sold a fake and never will.' },
  { n: 500, suffix: '+', label: 'Happy customers in KTM', detail: 'Word spreads fast. Our customers keep coming back.' },
  { n: 0, suffix: '', label: 'Fakes. Ever.', detail: 'This one\'s the most important number on this page.' },
]

const TIMELINE = [
  { year: '2021', title: 'Fed up.', body: 'Two vapers in Kathmandu, tired of paying Rs. 3000 for a device that tasted like burnt plastic on the second puff. Tired of sellers who ghosted after payment.', highlight: 'Something had to change.' },
  { year: '2022', title: 'We went to the source.', body: 'Spent months tracking down verified suppliers. Flew samples in. Tested everything ourselves before a single rupee changed hands with a customer.', highlight: 'First 50 orders. Zero complaints.' },
  { year: '2023', title: 'Word got out.', body: 'Started with a WhatsApp group. Then Instagram. Then orders from people we\'d never met. Launched same-day dispatch in Dhangadhi. Added 15 new flavours.', highlight: 'Still answering every DM ourselves.' },
  { year: 'Today', title: 'Still the same rule.', body: 'Bigger catalogue, faster shipping, more payment options — but the rule hasn\'t changed. If we wouldn\'t use it ourselves, it doesn\'t go on the shelf.', highlight: 'Nepal\'s most trusted vape shop.' },
]

const TEAM_FACTS = [
  { q: 'Favourite flavour?', a: 'Mango Ice. Every single time. No competition.' },
  { q: 'How do you verify products?', a: 'Serial number checks, supplier documentation, and honestly — we vape everything ourselves before it goes live.' },
  { q: 'Do you actually read DMs?', a: 'Yes. Every one. Sometimes at 2am. We\'re a small team and we care too much to ignore messages.' },
  { q: 'Why only disposables for now?', a: 'We\'d rather do one thing exceptionally well than five things badly.' },
  { q: 'Wholesale minimum order?', a: 'No hard minimum. Email us your volume and we\'ll give you honest pricing.' },
  { q: 'What happens if I get a bad device?', a: 'We replace it. No interrogation. Just send us a message.' },
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
  const isMobile = useIsMobile()
  const [activeTimeline, setActiveTimeline] = useState(0)
  const [activeVal, setActiveVal] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* HERO */}
      <section style={{ position: 'relative', height: isMobile ? 'auto' : '580px', minHeight: isMobile ? '400px' : 'auto', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(125deg, #0d1117 0%, #111827 35%, #0a1628 70%, #0f3460 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px', zIndex: 1 }} />
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(232,65,74,0.07)', filter: 'blur(80px)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 3, padding: isMobile ? '56px 20px 48px' : '0 72px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(232,65,74,0.12)', border: '1px solid rgba(232,65,74,0.25)', borderRadius: '20px', padding: '5px 14px', marginBottom: '20px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }} />
            <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--red)', textTransform: 'uppercase' }}>Our story</span>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? 'clamp(28px,8vw,42px)' : 'clamp(38px,5vw,62px)', fontWeight: 700, color: '#fff', lineHeight: 1.08, marginBottom: '18px', maxWidth: '580px' }}>
            We got tired of<br />
            <em style={{ fontStyle: 'italic', color: '#f9a8ac' }}>buying fakes.</em><br />
            So we fixed it.
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.48)', lineHeight: 1.85, maxWidth: '380px', marginBottom: '28px' }}>
            Two vapers in Kathmandu who couldn't find a single reliable place to buy authentic disposables. So we built one.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/products')} style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '13px 24px', cursor: 'pointer' }}>Browse the shop →</button>
            <button onClick={() => navigate('/contact')} style={{ fontSize: '0.75rem', fontWeight: 500, background: 'transparent', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', padding: '13px 20px', cursor: 'pointer' }}>Talk to us</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: 'var(--navy)', padding: '0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: isMobile ? '28px 16px' : '48px 32px',
              borderRight: isMobile ? (i % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none') : (i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none'),
              borderBottom: isMobile && i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              textAlign: isMobile ? 'center' : 'left',
            }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '2rem' : 'clamp(2.2rem,4vw,3.2rem)', fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: '6px' }}>
                <CountUp target={s.n} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{s.label}</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)', lineHeight: 1.6 }}>{s.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{ padding: isMobile ? '56px 20px' : '96px 72px', background: 'var(--bg)' }}>
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '10px' }}>How we got here</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '1.6rem' : 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>
            The honest version<br /><em style={{ fontStyle: 'italic', color: 'var(--red)' }}>of our story.</em>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {TIMELINE.map((t, i) => (
            <div key={i} onClick={() => setActiveTimeline(activeTimeline === i ? null : i)} style={{ display: 'flex', gap: '0', cursor: 'pointer' }}>
              <div style={{ width: isMobile ? '60px' : '120px', flexShrink: 0, paddingTop: '28px', paddingRight: '16px', textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '0.75rem' : '0.95rem', fontWeight: 700, color: activeTimeline === i ? 'var(--red)' : 'var(--light)', transition: 'color 0.2s' }}>{t.year}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '32px' }}>
                <div style={{ width: i === 0 ? '0' : '2px', height: '28px', background: 'var(--border)' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: `2.5px solid ${activeTimeline === i ? 'var(--red)' : 'var(--border)'}`, background: activeTimeline === i ? 'var(--red)' : '#fff', flexShrink: 0, transition: 'all 0.22s', zIndex: 1 }} />
                <div style={{ width: '2px', flex: 1, minHeight: '40px', background: i === TIMELINE.length - 1 ? 'transparent' : 'var(--border)' }} />
              </div>
              <div style={{ flex: 1, paddingLeft: isMobile ? '12px' : '24px', paddingBottom: '8px', paddingTop: '18px' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{t.title}</div>
                <div style={{ maxHeight: activeTimeline === i ? '200px' : '0px', overflow: 'hidden', opacity: activeTimeline === i ? 1 : 0, transition: 'max-height 0.4s ease, opacity 0.3s ease' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--mid)', lineHeight: 1.85, marginBottom: '12px', paddingTop: '4px' }}>{t.body}</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff8f8', border: '1px solid rgba(232,65,74,0.2)', borderRadius: '6px', padding: '7px 12px', marginBottom: '18px' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--red)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--red)' }}>{t.highlight}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section style={{ background: 'var(--navy)', padding: isMobile ? '56px 20px' : '96px 72px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '380px 1fr', gap: isMobile ? '32px' : '80px', alignItems: 'start' }}>
          <div style={{ position: isMobile ? 'static' : 'sticky', top: '80px' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '10px' }}>What drives us</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '1.5rem' : 'clamp(1.6rem,2.5vw,2.1rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: '16px' }}>
              Three rules.<br /><em style={{ fontStyle: 'italic', color: '#f9a8ac' }}>Non-negotiable.</em>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.85 }}>
              We've had opportunities to cut corners. We said no every time.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { num: '01', title: 'We only sell what we\'d buy ourselves.', body: 'Every flavour on our site is something at least one of us uses regularly. If it doesn\'t make the cut for us personally, it doesn\'t get listed.', tag: 'Authentication standard' },
              { num: '02', title: 'We tell you the truth, even if it costs us a sale.', body: 'If a product is out of stock, we say so. If a device has a known issue, we mention it. Honesty first, always.', tag: 'Transparency commitment' },
              { num: '03', title: 'Your problem is our problem.', body: 'Got a bad device? Message us. Something didn\'t arrive? Message us. We\'re two people who genuinely want your experience to be good.', tag: 'Customer promise' },
            ].map((v, i) => (
              <div key={i} onClick={() => setActiveVal(activeVal === i ? null : i)}
                style={{ background: activeVal === i ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)', border: `1.5px solid ${activeVal === i ? 'rgba(232,65,74,0.5)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '12px', padding: '20px 22px', cursor: 'pointer', transition: 'all 0.22s' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1 }}>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--red)', flexShrink: 0, marginTop: '2px' }}>{v.num}</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: activeVal === i ? '10px' : '0', lineHeight: 1.4 }}>{v.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxHeight: activeVal === i ? '160px' : '0px', overflow: 'hidden', opacity: activeVal === i ? 1 : 0, transition: 'max-height 0.4s ease, opacity 0.3s ease', marginBottom: activeVal === i ? '10px' : '0' }}>{v.body}</div>
                      {activeVal === i && <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)', background: 'rgba(232,65,74,0.1)', border: '1px solid rgba(232,65,74,0.2)', padding: '3px 10px', borderRadius: '4px' }}>{v.tag}</span>}
                    </div>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.3rem', transform: activeVal === i ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.25s', flexShrink: 0 }}>+</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: isMobile ? '56px 20px' : '96px 72px', background: 'var(--bg)' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '10px' }}>Straight answers</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '1.6rem' : 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>
            Questions people actually<br /><em style={{ fontStyle: 'italic', color: 'var(--red)' }}>ask us.</em>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px' }}>
          {TEAM_FACTS.map((f, i) => (
            <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ background: '#fff', border: `1.5px solid ${openFaq === i ? 'var(--red)' : 'var(--border)'}`, borderRadius: '10px', padding: '18px 20px', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.4 }}>{f.q}</div>
                <div style={{ color: openFaq === i ? 'var(--red)' : 'var(--light)', fontSize: '1.2rem', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.25s', flexShrink: 0 }}>+</div>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--mid)', lineHeight: 1.8, maxHeight: openFaq === i ? '120px' : '0px', overflow: 'hidden', opacity: openFaq === i ? 1 : 0, transition: 'max-height 0.35s ease, opacity 0.28s ease', marginTop: openFaq === i ? '10px' : '0' }}>
                {f.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg)', padding: isMobile ? '0 20px 56px' : '0 72px 96px' }}>
        <div style={{ background: 'var(--ink)', borderRadius: '16px', padding: isMobile ? '36px 24px' : '64px 72px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: isMobile ? '24px' : '48px', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(232,65,74,0.07)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '10px' }}>Okay, you know us now</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: isMobile ? '1.4rem' : 'clamp(1.5rem,2.8vw,2rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: '10px' }}>
              Come see what all<br /><em style={{ fontStyle: 'italic', color: '#f9a8ac' }}>the fuss is about.</em>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, maxWidth: '380px' }}>
              20+ authentic flavours. Same day dispatch. eSewa, Khalti, bank transfer.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '10px', flexShrink: 0, position: 'relative', zIndex: 2, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/products')} style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '13px 24px', cursor: 'pointer', whiteSpace: 'nowrap', flex: isMobile ? 1 : 'unset' }}>Shop the collection →</button>
            <button onClick={() => navigate('/contact')} style={{ fontSize: '0.73rem', background: 'transparent', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '12px 20px', cursor: 'pointer', whiteSpace: 'nowrap', flex: isMobile ? 1 : 'unset' }}>Say hello first</button>
          </div>
        </div>
      </section>

      <Footer isMobile={isMobile} />
    </div>
  )
}