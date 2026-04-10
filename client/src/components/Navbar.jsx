import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../App'
import { useCart } from '../App'
import { useIsMobile } from '../hooks/useWindowWidth'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    ['/','Home'],
    ['/products','Products'],
    ['/about','About Us'],
    ['/contact','Contact Us'],
  ]

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <div style={{ background:'var(--navy-dark)', padding:'7px 20px', textAlign:'center', fontSize:'0.65rem', color:'rgba(255,255,255,0.45)', letterSpacing:'0.05em' }}>
        Same day dispatch in Dhangadhi &nbsp;·&nbsp; eSewa &amp; Khalti accepted &nbsp;·&nbsp; 100% authentic
      </div>

      <nav style={{ background:'var(--navy)', padding:`0 ${isMobile ? '16px' : '40px'}`, display:'flex', alignItems:'center', justifyContent:'space-between', height:'60px', borderBottom:'1px solid rgba(255,255,255,0.07)', position:'sticky', top:0, zIndex:100 }}>
        <Link to="/" onClick={closeMenu} style={{ fontFamily:'var(--serif)', fontSize:'1.35rem', fontWeight:700, color:'#fff', letterSpacing:'0.02em' }}>
          Puff<span style={{ color:'var(--red)', fontStyle:'italic' }}>Diaries</span>
        </Link>

        {/* Desktop nav */}
        {!isMobile && (
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
        )}

        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          {/* Cart icon */}
          <Link to="/cart" style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:'38px', height:'38px', borderRadius:'8px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.8)', textDecoration:'none', transition:'all 0.18s' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-14.83-3h14.83l1.68-8H5.21L4.17 3H1v2h2l3.6 7.59L5.25 15c-.16.28-.25.61-.25.96C5 17.1 5.9 18 7 18h13v-2H7.42c-.13 0-.25-.11-.25-.25l.03-.12.9-1.63z"/></svg>
            {cartCount > 0 && (
              <span style={{ position:'absolute', top:'-6px', right:'-6px', background:'var(--red)', color:'#fff', fontSize:'0.55rem', fontWeight:700, width:'18px', height:'18px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid var(--navy)' }}>
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Desktop auth buttons */}
          {!isMobile && (
            user ? (
              <>
                <button onClick={() => navigate('/account')} style={{ fontSize:'0.78rem', fontWeight:500, background:'transparent', color:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:'3px', padding:'7px 14px', cursor:'pointer' }}>
                  {user.name.split(' ')[0]}
                </button>
                <button onClick={() => { logout(); navigate('/') }} style={{ fontSize:'0.78rem', fontWeight:600, background:'var(--red)', color:'#fff', border:'none', borderRadius:'3px', padding:'7px 14px', cursor:'pointer' }}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} style={{ fontSize:'0.78rem', fontWeight:500, background:'transparent', color:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:'3px', padding:'7px 14px', cursor:'pointer' }}>Log in</button>
                <button onClick={() => navigate('/signup')} style={{ fontSize:'0.78rem', fontWeight:600, background:'var(--red)', color:'#fff', border:'none', borderRadius:'3px', padding:'7px 14px', cursor:'pointer' }}>Sign up</button>
              </>
            )
          )}

          {/* Hamburger */}
          {isMobile && (
            <button onClick={() => setMenuOpen(o => !o)} style={{ width:'38px', height:'38px', borderRadius:'8px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'#fff', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'5px', padding:0 }}>
              <span style={{ width:'18px', height:'2px', background: menuOpen ? 'transparent' : '#fff', display:'block', transition:'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
              <span style={{ width:'18px', height:'2px', background:'#fff', display:'block', transition:'all 0.2s', transform: menuOpen ? 'rotate(-45deg)' : 'none', marginTop: menuOpen ? '-7px' : '0' }} />
              {!menuOpen && <span style={{ width:'18px', height:'2px', background:'#fff', display:'block' }} />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile drawer */}
      {isMobile && menuOpen && (
        <div style={{ position:'fixed', top:'97px', left:0, right:0, bottom:0, zIndex:99, background:'rgba(0,0,0,0.5)' }} onClick={closeMenu}>
          <div style={{ background:'var(--navy)', borderBottom:'1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            {links.map(([to, label]) => {
              const active = location.pathname === to
              return (
                <Link key={to} to={to} onClick={closeMenu} style={{ display:'block', padding:'14px 20px', fontSize:'0.9rem', fontWeight: active ? 700 : 400, color: active ? '#fff' : 'rgba(255,255,255,0.65)', borderBottom:'1px solid rgba(255,255,255,0.06)', borderLeft: active ? '3px solid var(--red)' : '3px solid transparent' }}>
                  {label}
                </Link>
              )
            })}
            {user?.isAdmin && (
              <Link to="/admin" onClick={closeMenu} style={{ display:'block', padding:'14px 20px', fontSize:'0.9rem', color:'rgba(255,255,255,0.4)', borderBottom:'1px solid rgba(255,255,255,0.06)', borderLeft:'3px solid transparent' }}>Admin</Link>
            )}
            <div style={{ padding:'14px 20px', display:'flex', gap:'10px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
              {user ? (
                <>
                  <button onClick={() => { navigate('/account'); closeMenu() }} style={{ flex:1, fontSize:'0.8rem', fontWeight:500, background:'transparent', color:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:'6px', padding:'10px', cursor:'pointer' }}>
                    {user.name.split(' ')[0]}
                  </button>
                  <button onClick={() => { logout(); navigate('/'); closeMenu() }} style={{ flex:1, fontSize:'0.8rem', fontWeight:700, background:'var(--red)', color:'#fff', border:'none', borderRadius:'6px', padding:'10px', cursor:'pointer' }}>
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { navigate('/login'); closeMenu() }} style={{ flex:1, fontSize:'0.8rem', fontWeight:500, background:'transparent', color:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:'6px', padding:'10px', cursor:'pointer' }}>Log in</button>
                  <button onClick={() => { navigate('/signup'); closeMenu() }} style={{ flex:1, fontSize:'0.8rem', fontWeight:700, background:'var(--red)', color:'#fff', border:'none', borderRadius:'6px', padding:'10px', cursor:'pointer' }}>Sign up</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}