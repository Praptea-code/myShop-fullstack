import { useState } from 'react'
import Navbar from '../components/Navbar'
import { Footer } from './Home'

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', contact: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const inp = {
    width: '100%',
    padding: '9px 12px',
    background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    fontSize: '0.8rem',
    color: 'var(--ink)',
    outline: 'none',
    fontFamily: 'var(--sans)',
    transition: 'border-color 0.15s',
  }

  const handleSubmit = e => {
    e.preventDefault()
    const subject = encodeURIComponent(form.subject || 'VOLT Vapour Inquiry')
    const body = encodeURIComponent(`Name: ${form.name}\nContact: ${form.contact}\n\n${form.message}`)
    window.location.href = `mailto:volt@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
  }

  const CONTACTS = [
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--red)"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>, label: 'Email', val: 'volt@gmail.com', href: 'mailto:volt@gmail.com' },
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--red)"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>, label: 'Phone / WhatsApp', val: '+977 98XXXXXXXX', href: null },
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--red)"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>, label: 'Location', val: 'Kathmandu, Nepal', href: null },
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--red)"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>, label: 'Instagram', val: '@voltvapour', href: 'https://instagram.com/voltvapour' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero — centered, compact */}
      <section style={{ position: 'relative', padding: '60px 48px', background: 'linear-gradient(135deg, #0f3460 0%, #111827 60%, #0d1117 100%)', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,14,22,0.82)' }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '9px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '18px', height: '1px', background: 'var(--red)' }} />
            Reach out
            <span style={{ width: '18px', height: '1px', background: 'var(--red)' }} />
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#fff', marginBottom: '7px' }}>
            Get in <em style={{ fontStyle: 'italic', color: '#f9a8ac' }}>touch.</em>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.48)', lineHeight: 1.7, maxWidth: '380px' }}>
            Questions, wholesale inquiries, feedback — we're a small team and we actually read every message.
          </p>
        </div>
      </section>

      {/* Body — centered max-width container */}
      <section style={{ padding: '56px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '860px', display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '20px' }}>

        {/* Contact info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {CONTACTS.map((c, i) => (
            <div key={i}
              style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '13px 15px', display: 'flex', alignItems: 'center', gap: '11px', cursor: c.href ? 'pointer' : 'default', transition: 'border-color 0.18s' }}
              onMouseEnter={e => { if (c.href) e.currentTarget.style.borderColor = 'var(--red)' }}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              onClick={() => c.href && window.open(c.href)}
            >
              <div style={{ width: '34px', height: '34px', borderRadius: '6px', background: '#fde8e9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {c.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#bbb', marginBottom: '2px' }}>{c.label}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>{c.val}</div>
              </div>
            </div>
          ))}

          {/* Wholesale box */}
          <div style={{ background: 'var(--navy)', borderRadius: '8px', padding: '16px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>Wholesale inquiries</div>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.42)', lineHeight: 1.65, marginBottom: '10px' }}>
              Running a shop? Email us your quantity and we'll send pricing. Tiered discounts on all products.
            </p>
            <button
              onClick={() => window.open('mailto:volt@gmail.com?subject=Wholesale Inquiry')}
              style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '3px', padding: '7px 14px', cursor: 'pointer', transition: 'background 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dark)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
            >
              Get wholesale pricing →
            </button>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '22px' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px' }}>
            Send us a message
          </div>

          {sent ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '28px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>✓</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#15803d', marginBottom: '4px' }}>Message sent!</div>
              <div style={{ fontSize: '0.75rem', color: '#166534' }}>Your email client should have opened. We'll get back to you soon.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' }}>
                <input
                  style={{ ...inp }}
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  onFocus={e => e.target.style.borderColor = 'var(--ink)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  required
                />
                <input
                  style={{ ...inp }}
                  placeholder="Email or phone"
                  value={form.contact}
                  onChange={e => setForm({ ...form, contact: e.target.value })}
                  onFocus={e => e.target.style.borderColor = 'var(--ink)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  required
                />
              </div>
              <input
                style={{ ...inp }}
                placeholder="Subject (e.g. Wholesale, Order issue)"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                onFocus={e => e.target.style.borderColor = 'var(--ink)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <textarea
                style={{ ...inp, minHeight: '90px', resize: 'vertical' }}
                placeholder="Your message..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                onFocus={e => e.target.style.borderColor = 'var(--ink)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                required
              />
              <button
                type="submit"
                style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '11px', cursor: 'pointer', transition: 'background 0.18s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dark)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
              >
                Send message →
              </button>
              <p style={{ fontSize: '0.62rem', color: '#aaa', textAlign: 'center' }}>
                Opens your email client · or email volt@gmail.com directly
              </p>
            </form>
          )}
        </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}