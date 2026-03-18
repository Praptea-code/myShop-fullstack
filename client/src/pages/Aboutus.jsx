import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Footer } from './Home'

export default function AboutUs() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, #111827 0%, #1a2744 50%, #0f3460 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(10,14,22,0.94) 0%, rgba(10,14,22,0.6) 52%, rgba(10,14,22,0.2) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 48px' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '18px', height: '1px', background: 'var(--red)' }} />
            Our story
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3.5vw, 32px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: '8px' }}>
            Built for Nepal,<br /><em style={{ fontStyle: 'italic', color: '#f9a8ac' }}>by vapers.</em>
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.48)', lineHeight: 1.7, maxWidth: '360px' }}>
            We started because we were tired of fakes. Now we're KTM's most trusted source for authentic disposable vapes.
          </p>
        </div>
      </section>

      {/* Story + Stats */}
      <section style={{ padding: '72px 40px', background: 'var(--bg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '6px' }}>Who we are</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '11px' }}>
              A team that<br /><em style={{ fontStyle: 'italic', color: 'var(--red)' }}>gives a damn.</em>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--mid)', lineHeight: 1.8, marginBottom: '8px' }}>
              We're based in Kathmandu and started VOLT because ordering vapes in Nepal was a nightmare — overpriced knockoffs, sketchy sellers, zero accountability.
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--mid)', lineHeight: 1.8, marginBottom: '16px' }}>
              So we built the supply chain ourselves. Every product is sourced directly, verified personally, and stocked only if we'd use it ourselves. That's still the rule.
            </p>
            <button
              onClick={() => navigate('/products')}
              style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '3px', padding: '10px 18px', cursor: 'pointer', transition: 'background 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dark)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
            >
              Shop our products →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { n: '20+', l: 'Flavours in stock' },
              { n: '100%', l: 'Authentic products' },
              { n: '1 day', l: 'Delivery in KTM' },
              { n: '0', l: 'Fakes ever sold' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '18px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '3px' }}>{s.n}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--light)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div style={{ background: 'var(--navy)', borderRadius: '10px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '5px' }}>What we stand for</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            Our <em style={{ fontStyle: 'italic' }}>values</em>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
            {[
              { title: 'No fakes. Ever.', sub: "If we can't verify it's genuine, it doesn't go on the shelf. Period." },
              { title: 'Real talk only.', sub: "No hype. We tell you exactly what you're getting — flavour, strength, puffs." },
              { title: 'Always improving.', sub: 'New flavours, faster delivery, better pricing. We listen and act on feedback.' },
            ].map((v, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '18px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(232,65,74,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)', marginBottom: '10px' }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', marginBottom: '5px' }}>{v.title}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.44)', lineHeight: 1.6 }}>{v.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '24px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '18px' }}>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
              Ready to try it <em style={{ fontStyle: 'italic', color: 'var(--red)' }}>yourself?</em>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--light)', lineHeight: 1.6 }}>Browse our full collection — no account needed to look around.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button onClick={() => navigate('/products')} style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '3px', padding: '10px 16px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dark)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
            >Shop now</button>
            <button onClick={() => navigate('/contact')} style={{ fontSize: '0.72rem', background: 'transparent', color: 'var(--light)', border: '1px solid var(--border)', borderRadius: '3px', padding: '10px 16px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Contact us</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}