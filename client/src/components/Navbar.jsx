import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav style={{ height: '68px', padding: '0 56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--navy)', position: 'sticky', top: 0, zIndex: 100 }}>
      <Link to="/" style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 500, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none' }}>
        VOLT <span style={{ fontStyle: 'italic', fontWeight: 200, textTransform: 'none', fontSize: '0.95rem', color: 'rgba(255,255,255,0.45)', marginLeft: '3px' }}>vapour</span>
      </Link>
      <div style={{ display: 'flex', gap: '32px' }}>
        {[['/', 'Home'], ['/products', 'Products'], ['/track', 'Track order']].map(([to, label]) => (
          <Link key={to} to={to} style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</Link>
        ))}
        {user?.isAdmin && <Link to="/admin" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin</Link>}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        {user ? (
          <>
            <button className="btn btn-outline-white btn-sm" onClick={() => navigate('/account')}>{user.name.split(' ')[0]}</button>
            <button className="btn btn-white btn-sm" onClick={() => { logout(); navigate('/') }}>Log out</button>
          </>
        ) : (
          <>
            <button className="btn btn-outline-white btn-sm" onClick={() => navigate('/login')}>Log in</button>
            <button className="btn btn-white btn-sm" onClick={() => navigate('/signup')}>Sign up</button>
          </>
        )}
      </div>
    </nav>
  )
}