import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function OrderForm() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [form, setForm] = useState({ customerName: '', phone: '', address: '' })
  const [screenshot, setScreenshot] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${productId}`)
      .then(res => setProduct(res.data))
  }, [productId])

  const handleSubmit = async () => {
    if (!form.customerName || !form.phone || !form.address || !screenshot) {
      alert('Please fill all fields and upload payment screenshot')
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
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '4rem' }}>✓</div>
      <h2>Order Placed!</h2>
      <p style={{ color: '#aaa' }}>We'll verify your payment and contact you soon.</p>
      <button onClick={() => navigate('/')} style={{ padding: '12px 24px', background: '#4ade80', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
        Back to Home
      </button>
    </div>
  )

  if (!product) return <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', marginBottom: '24px', fontSize: '0.9rem' }}>
          ← Back
        </button>
        <h1 style={{ marginBottom: '8px' }}>{product.name}</h1>
        <p style={{ color: '#4ade80', fontWeight: 'bold', marginBottom: '32px' }}>Rs. {product.price}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {['customerName', 'phone', 'address'].map(field => (
            <input
              key={field}
              placeholder={field === 'customerName' ? 'Your name' : field === 'phone' ? 'Phone number' : 'Delivery address'}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              style={{ padding: '14px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#fff', fontSize: '1rem' }}
            />
          ))}

          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <p style={{ color: '#aaa', marginBottom: '12px' }}>Scan to pay</p>
            <div style={{ background: '#2a2a2a', borderRadius: '8px', padding: '40px', color: '#555', marginBottom: '12px' }}>
              📱 Your eSewa / Khalti QR here
              <br />
              <small style={{ color: '#444' }}>(replace this with your actual QR image)</small>
            </div>
            <p style={{ color: '#4ade80', fontWeight: 'bold' }}>Rs. {product.price}</p>
          </div>

          <div>
            <p style={{ color: '#aaa', marginBottom: '8px', fontSize: '0.9rem' }}>Upload payment screenshot</p>
            <input
              type="file"
              accept="image/*"
              onChange={e => setScreenshot(e.target.files[0])}
              style={{ width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#aaa' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ padding: '16px', background: loading ? '#333' : '#4ade80', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
          >
            {loading ? 'Submitting...' : 'Submit Order'}
          </button>
        </div>
      </div>
    </div>
  )
}