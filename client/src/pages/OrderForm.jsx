import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../App'
import { useIsMobile } from '../hooks/useWindowWidth'
import API_BASE from '../api'

export default function OrderForm() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const isMobile = useIsMobile()
  const [product, setProduct] = useState(null)
  const [form, setForm] = useState({ customerName: user?.name || '', phone: user?.phone || '', address: '' })
  const [screenshot, setScreenshot] = useState(null)
  const [preview, setPreview] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)

  useEffect(() => {
    axios.get(`${API_BASE}/api/products/${productId}`).then(res => setProduct(res.data))
  }, [productId])

  const handleFile = (e) => {
    const file = e.target.files[0]
    setScreenshot(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!form.customerName || !form.phone || !form.address || !screenshot) {
      alert('Please fill all fields and upload your payment screenshot')
      return
    }
    setLoading(true)
    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => data.append(k, v))
    data.append('product', productId)
    data.append('screenshot', screenshot)
    await axios.post(`${API_BASE}/api/orders`, data, { headers: { Authorization: `Bearer ${token}` } })
    setSubmitted(true)
    setLoading(false)
  }

  const inp = { width: '100%', padding: '13px 16px', background: 'var(--soft)', border: '1.5px solid var(--border)', borderRadius: '10px', color: 'var(--ink)', fontSize: '16px', outline: 'none', fontFamily: 'var(--sans)' }

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '18px', padding: '80px 20px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--soft)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>✓</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 200, color: 'var(--ink)' }}>Order received</h2>
        <p style={{ color: 'var(--mid)', fontSize: '0.88rem', textAlign: 'center', maxWidth: '300px', lineHeight: 1.7 }}>We'll verify your payment and reach out soon.</p>
        <button className="btn btn-navy" onClick={() => navigate('/')}>Back to shop</button>
      </div>
    </div>
  )

  if (!product) return <div style={{ minHeight: '100vh' }}><Navbar /></div>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* QR Modal */}
      {qrOpen && (
        <div onClick={() => setQrOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', boxShadow: '0 24px 64px rgba(0,0,0,0.32)', maxWidth: '320px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)' }}>Scan &amp; Pay</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>Rs. {product.price}</div>
              </div>
              <button onClick={() => setQrOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--soft)', cursor: 'pointer', fontSize: '1rem', color: 'var(--light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <img src="/qr.png" alt="Payment QR Code" style={{ width: '240px', height: '240px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border)' }} />
            <div style={{ fontSize: '0.68rem', color: 'var(--light)', textAlign: 'center', lineHeight: 1.6 }}>
              eSewa · Khalti · Bank Transfer<br />
              <span style={{ color: 'var(--red)', fontWeight: 600 }}>Upload your screenshot below after paying</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '520px', margin: '0 auto', padding: isMobile ? '24px 16px 60px' : '48px 24px 80px' }}>

        {/* Product summary */}
        <div style={{ background: 'var(--soft)', borderRadius: '14px', padding: '18px 22px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '4px' }}>Your order</div>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--ink)' }}>{product.name}</div>
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--navy)' }}>Rs. {product.price}</div>
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', fontWeight: 500 }}>Your details</div>
          <input style={inp} placeholder="Full name" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} />
          <input style={inp} placeholder="Phone number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <input style={inp} placeholder="Delivery address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
        </div>

        {/* QR payment */}
        <div style={{ background: 'var(--soft)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '14px', fontWeight: 500 }}>Scan &amp; pay</div>
          <div onClick={() => setQrOpen(true)} style={{ width: isMobile ? '160px' : '180px', height: isMobile ? '160px' : '180px', margin: '0 auto 12px', cursor: 'pointer', borderRadius: '10px', overflow: 'hidden', border: '2px solid var(--border)' }}>
            <img src="/qr.png" alt="Payment QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--navy)', fontWeight: 600, marginBottom: '4px' }}>Rs. {product.price}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--light)', marginBottom: '10px' }}>eSewa · Khalti · Bank transfer</div>
          <button onClick={() => setQrOpen(true)} style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: 'transparent', color: 'var(--red)', border: '1px solid var(--red)', borderRadius: '4px', padding: '6px 14px', cursor: 'pointer' }}>
            Enlarge QR ↗
          </button>
        </div>

        {/* Screenshot upload */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '10px', fontWeight: 500 }}>Upload payment screenshot</div>
          <label style={{ display: 'block', background: 'var(--soft)', border: `1.5px dashed ${preview ? 'var(--navy)' : 'var(--border)'}`, borderRadius: '12px', padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
            <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            {preview
              ? <img src={preview} alt="preview" style={{ maxHeight: '140px', borderRadius: '8px', objectFit: 'contain' }} />
              : <><div style={{ fontSize: '1.4rem', marginBottom: '6px', color: 'var(--mid)' }}>↑</div><div style={{ fontSize: '0.8rem', color: 'var(--mid)' }}>Tap to upload screenshot</div></>}
          </label>
        </div>

        <button onClick={handleSubmit} disabled={loading} className="btn btn-navy" style={{ width: '100%', justifyContent: 'center', padding: '15px', opacity: loading ? 0.7 : 1, fontSize: '0.82rem' }}>
          {loading ? 'Submitting...' : 'Place order'}
        </button>
      </div>
    </div>
  )
}