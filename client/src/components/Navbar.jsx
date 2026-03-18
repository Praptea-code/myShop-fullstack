import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { useCart } from '../App'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { cartCount } = useCart()

  const links = [
    ['/','Home'],
    ['/products','Products'],
    ['/about','About Us'],
    ['/contact','Contact Us'],
  ]

  return (
    <>
      <div style={{ background:'var(--navy-dark)', padding:'7px 40px', textAlign:'center', fontSize:'0.7rem', color:'rgba(255,255,255,0.45)', letterSpacing:'0.05em' }}>
        Same day dispatch in Kathmandu &nbsp;·&nbsp; eSewa &amp; Khalti accepted &nbsp;·&nbsp; 100% authentic products
      </div>

      <nav style={{ background:'var(--navy)', padding:'0 40px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'60px', borderBottom:'1px solid rgba(255,255,255,0.07)', position:'sticky', top:0, zIndex:100 }}>
        <Link to="/" style={{ fontFamily:'var(--serif)', fontSize:'1.45rem', fontWeight:700, color:'#fff', letterSpacing:'0.02em' }}>
          Puff<span style={{ color:'var(--red)', fontStyle:'italic' }}>Diaries</span>
        </Link>

        <div style={{ display:'flex', height:'100%' }}>
          {links.map(([to, label]) => {
            const active = location.pathname === to
            return (
              <Link key={to} to={to} style={{ fontSize:'0.82rem', fontWeight:500, color: active ? '#fff' : 'rgba(255,255,255,0.6)', padding:'0 16px', display:'flex', alignItems:'center', borderBottom: active ? '3px solid var(--red)' : '3px solid transparent', transition:'color 0.15s' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color='#fff' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color='rgba(255,255,255,0.6)' }}
              >{label}</Link>
            )
          })}
          {user?.isAdmin && (
            <Link to="/admin" style={{ fontSize:'0.82rem', fontWeight:500, color:'rgba(255,255,255,0.4)', padding:'0 16px', display:'flex', alignItems:'center', borderBottom:'3px solid transparent' }}>Admin</Link>
          )}
        </div>

        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          {/* Cart icon */}
          <Link to="/cart" style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:'38px', height:'38px', borderRadius:'8px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.8)', textDecoration:'none', transition:'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.14)'; e.currentTarget.style.color='#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='rgba(255,255,255,0.8)' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-14.83-3h14.83l1.68-8H5.21L4.17 3H1v2h2l3.6 7.59L5.25 15c-.16.28-.25.61-.25.96C5 17.1 5.9 18 7 18h13v-2H7.42c-.13 0-.25-.11-.25-.25l.03-.12.9-1.63z"/></svg>
            {cartCount > 0 && (
              <span style={{ position:'absolute', top:'-6px', right:'-6px', background:'var(--red)', color:'#fff', fontSize:'0.55rem', fontWeight:700, width:'18px', height:'18px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid var(--navy)' }}>
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <button onClick={() => navigate('/account')}
                style={{ fontSize:'0.78rem', fontWeight:500, background:'transparent', color:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:'3px', padding:'7px 14px', cursor:'pointer', transition:'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.4)'; e.currentTarget.style.color='#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; e.currentTarget.style.color='rgba(255,255,255,0.7)' }}
              >{user.name.split(' ')[0]}</button>
              <button onClick={() => { logout(); navigate('/') }}
                style={{ fontSize:'0.78rem', fontWeight:600, background:'var(--red)', color:'#fff', border:'none', borderRadius:'3px', padding:'7px 14px', cursor:'pointer', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='var(--red-dark)'}
                onMouseLeave={e => e.currentTarget.style.background='var(--red)'}
              >Log out</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}
                style={{ fontSize:'0.78rem', fontWeight:500, background:'transparent', color:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:'3px', padding:'7px 14px', cursor:'pointer', transition:'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.4)'; e.currentTarget.style.color='#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; e.currentTarget.style.color='rgba(255,255,255,0.6)' }}
              >Log in</button>
              <button onClick={() => navigate('/signup')}
                style={{ fontSize:'0.78rem', fontWeight:600, background:'var(--red)', color:'#fff', border:'none', borderRadius:'3px', padding:'7px 14px', cursor:'pointer', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='var(--red-dark)'}
                onMouseLeave={e => e.currentTarget.style.background='var(--red)'}
              >Sign up</button>
            </>
          )}
        </div>
      </nav>
    </>
  )
}