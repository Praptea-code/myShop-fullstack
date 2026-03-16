import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function OrderForm() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [form, setForm] = useState({ customerName: '', phone: '', address: '' })
  const [screenshot, setScreenshot] = useState(null)
  const [preview, setPreview] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${productId}`)
      .then(res => setProduct(res.data))
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
    data.append('customerName', form.customerName)
    data.append('phone', form.phone)
    data.append('address', form.address)
    data.append('product', productId)
    data.append('screenshot', screenshot)
    await axios.post('http://localhost:5000/api/orders', data)
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', padding: '40px' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>✓</div>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 400 }}>Order received</h2>
      <p style={{ color: 'var(--ink2)', fontSize: '0.88rem', textAlign: 'center', maxWidth: '320px', lineHeight: 1.7 }}>
        We'll verify your payment and reach out to you soon. Thank you for shopping with aura.
      </p>
      <button onClick={() => navigate('/')} style={{
        marginTop: '8px', background: 'var(--ink)', color: 'var(--bg)',
        padding: '12px 28px', borderRadius: '100px', border: 'none',
        fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
        cursor: 'pointer', fontWeight: 500
      }}>
        Back to shop
      </button>
    </div>
  )

  if (!product) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink3)', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>
      Loading...
    </div>
  )

  const inputStyle = {
    width: '100%', padding: '14px 18px',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: '12px', color: 'var(--ink)', fontSize: '0.88rem',
    outline: 'none', transition: 'border .2s'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '0 0 80px' }}>
      {/* Nav */}
      <nav style={{ padding: '22px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
        <div onClick={() => navigate('/')} style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontStyle: 'italic', cursor: 'pointer' }}>aura</div>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--ink2)', cursor: 'pointer', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          ← Back
        </button>
      </nav>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '52px 24px 0' }}>
        {/* Product summary */}
        <div style={{ background: 'var(--bg3)', borderRadius: '16px', padding: '24px 28px', marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.67rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '6px' }}>Your order</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem' }}>{product.name}</div>
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 700 }}>Rs. {product.price}</div>
        </div>

        {/* Form fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '4px' }}>Your details</div>
          {[
            { key: 'customerName', placeholder: 'Full name' },
            { key: 'phone', placeholder: 'Phone number' },
            { key: 'address', placeholder: 'Delivery address' }
          ].map(({ key, placeholder }) => (
            <input
              key={key}
              placeholder={placeholder}
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              style={inputStyle}
            />
          ))}
        </div>

        {/* QR section */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '16px' }}>
            Scan & pay
          </div>
          {/* 👇 Replace this div with: <img src="/qr.png" style={{width:'180px',borderRadius:'12px'}} /> */}
          <div style={{ width: '180px', height: '180px', background: 'var(--border)', borderRadius: '12px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink3)', fontSize: '0.8rem' }}>
            Your QR here
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem' }}>Rs. {product.price}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ink3)', marginTop: '6px' }}>eSewa · Khalti · Bank transfer</div>
        </div>

        {/* Screenshot upload */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '12px' }}>
            Upload payment screenshot
          </div>
          <label style={{
            display: 'block', background: 'var(--bg2)', border: `1px dashed ${preview ? 'var(--ink2)' : 'var(--border)'}`,
            borderRadius: '14px', padding: '28px', textAlign: 'center', cursor: 'pointer', transition: 'all .2s'
          }}>
            <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            {preview ? (
              <img src={preview} alt="preview" style={{ maxHeight: '160px', borderRadius: '10px', objectFit: 'contain' }} />
            ) : (
              <>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>↑</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ink2)' }}>Click to upload screenshot</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--ink3)', marginTop: '4px' }}>JPG, PNG supported</div>
              </>
            )}
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '16px',
            background: loading ? 'var(--bg3)' : 'var(--ink)',
            color: loading ? 'var(--ink3)' : 'var(--bg)',
            border: 'none', borderRadius: '100px',
            fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase',
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all .2s'
          }}
        >
          {loading ? 'Submitting...' : 'Place order'}
        </button>
      </div>
    </div>
  )
}