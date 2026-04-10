import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../App'
import Navbar from '../components/Navbar'
import API_BASE from '../api'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await axios.post(`${API_BASE}/api/auth/signup`, form)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) { setError(err.response?.data?.message || 'Signup failed') }
    setLoading(false)
  }

  const inp = { width: '100%', padding: '14px 18px', background: 'var(--soft)', border: '1.5px solid var(--border)', borderRadius: '10px', color: 'var(--ink)', fontSize: '16px', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: '420px', margin: '48px auto', padding: '0 20px 60px' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 200, marginBottom: '8px', color: 'var(--ink)' }}>
          Create your <i style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--navy)' }}>account.</i>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--mid)', marginBottom: '32px' }}>Track orders, reorder favourites, and more</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input style={inp} placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input style={inp} placeholder="Email address (optional if phone provided)" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input style={inp} placeholder="Phone number (optional if email provided)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <input style={inp} type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          {error && <p style={{ color: '#dc2626', fontSize: '0.8rem' }}>{error}</p>}
          <button className="btn btn-navy" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '14px' }}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.82rem', color: 'var(--mid)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--navy)', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}