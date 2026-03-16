import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../App'

export default function OrderForm() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [product, setProduct] = useState(null)
  const [form, setForm] = useState({ customerName: user?.name || '', phone: user?.phone || '', address: '' })
  const [screenshot, setScreenshot] = useState(null)
  const [preview, setPreview] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${productId}`).then(res => setProduct(res.data))
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
    await axios.post('http://localhost:5000/api/orders', data, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setSubmitted(true)
    setLoading(false)
  }

  const inp = { width: '100%', padding: '14px 18px', background: 'var(--soft)', border: '1.5px solid var(--border)', borderRadius: '10px', color: 'var(--ink)', fontSize: '0.88rem', outline: 'none' }

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', padding: '80px 40px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--soft)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>✓</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 200, color: 'var(--ink)' }}>Order received</h2>
        <p style={{ color: 'var(--mid)', fontSize: '0.88rem', textAlign: 'center', maxWidth: '320px', lineHeight: 1.7 }}>We'll verify your payment and reach out soon.</p>
        <button className="btn btn-navy" onClick={() => navigate('/')}>Back to shop</button>
      </div>
    </div>
  )

  if (!product) return <div style={{ minHeight: '100vh' }}><Navbar /></div>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '52px 24px 80px' }}>
        <div style={{ background: 'var(--soft)', borderRadius: '14px', padding: '22px 28px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '5px' }}>Your order</div>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--ink)' }}>{product.name}</div>
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--navy)' }}>Rs. {product.price}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', fontWeight: 500 }}>Your details</div>
          <input style={inp} placeholder="Full name" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} />
          <input style={inp} placeholder="Phone number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <input style={inp} placeholder="Delivery address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
        </div>

        <div style={{ background: 'var(--soft)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px', textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '14px', fontWeight: 500 }}>Scan & pay</div>
          {/* Replace div below with: <img src="/qr.png" style={{width:'180px',borderRadius:'12px'}} /> */}
          <div style={{ width: '180px', height: '180px', background: 'var(--border)', borderRadius: '10px', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--light)', fontSize: '0.78rem' }}>Your QR here</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--navy)', fontWeight: 600 }}>Rs. {product.price}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--light)', marginTop: '5px' }}>eSewa · Khalti · Bank transfer</div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: '10px', fontWeight: 500 }}>Upload payment screenshot</div>
          <label style={{ display: 'block', background: 'var(--soft)', border: `1.5px dashed ${preview ? 'var(--navy)' : 'var(--border)'}`, borderRadius: '12px', padding: '28px', textAlign: 'center', cursor: 'pointer' }}>
            <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            {preview
              ? <img src={preview} alt="preview" style={{ maxHeight: '160px', borderRadius: '8px', objectFit: 'contain' }} />
              : <><div style={{ fontSize: '1.4rem', marginBottom: '6px', color: 'var(--mid)' }}>↑</div><div style={{ fontSize: '0.8rem', color: 'var(--mid)' }}>Click to upload screenshot</div></>
            }
          </label>
        </div>

        <button onClick={handleSubmit} disabled={loading} className={`btn btn-navy`} style={{ width: '100%', justifyContent: 'center', padding: '16px', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Submitting...' : 'Place order'}
        </button>
      </div>
    </div>
  )
}