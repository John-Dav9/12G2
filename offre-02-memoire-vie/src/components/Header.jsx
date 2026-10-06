import { useEffect, useState } from 'react'
import { CalendarDays, Flame, Home, Images, LogIn, Menu, Settings, UserRound, Users, X } from 'lucide-react'
import { SITE } from '../data/site.js'
import { initials } from '../lib/format.js'
import { Link, useRouter } from '../lib/router.jsx'
import { useStore } from '../lib/store.jsx'

const LINKS = [
  { to: '/', label: 'Accueil', icon: Home },
  { to: '/archives', label: 'Archives', icon: Images },
  { to: '/actualites', label: 'Actualités', icon: CalendarDays },
  { to: '/membres', label: 'Membres', icon: Users },
  { to: '/gestion', label: 'Gestion', icon: Settings },
]

export default function Header() {
  const { state, dispatch } = useStore()
  const { path } = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [path])

  const isActive = (to) => (to === '/' ? path === '/' : path.startsWith(to))

  return (
    <header className="site-header">
      <div className="wrap site-header__bar">
        <Link className="brand" to="/">
          <span className="brand__mark" aria-hidden="true">
            12G2
          </span>
          <span className="brand__text">
            <strong>{SITE.formule}</strong>
            <small>Plateforme du 12G2</small>
          </span>
        </Link>
        <nav className="nav" aria-label="Navigation principale">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} aria-current={isActive(l.to) ? 'page' : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        {state.member ? (
          <Link className="account-btn" to="/mon-espace" aria-current={isActive('/mon-espace') ? 'page' : undefined}>
            <span className="avatar avatar--sm" aria-hidden="true">
              {initials(state.member.nom)}
            </span>
            <span className="account-btn__label">Mon espace</span>
          </Link>
        ) : (
          <button type="button" className="btn btn--primary btn--sm login-btn" onClick={() => dispatch({ type: 'login/open' })}>
            <LogIn aria-hidden="true" /> <span className="login-btn__label">Se connecter</span>
          </button>
        )}
        <button
          type="button"
          className="icon-btn menu-btn"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav id="menu-mobile" className="wrap mobile-nav" aria-label="Menu">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} aria-current={isActive(l.to) ? 'page' : undefined}>
              <l.icon aria-hidden="true" /> {l.label}
            </Link>
          ))}
          <Link to="/mon-espace" aria-current={isActive('/mon-espace') ? 'page' : undefined}>
            <UserRound aria-hidden="true" /> Mon espace
          </Link>
        </nav>
      )}
      <div className="memorial-strip">
        <div className="wrap memorial-strip__inner">
          <span className="memorial-strip__label">In memoriam</span>
          {state.memorials.map((m) => (
            <Link
              key={m.slug}
              className="memorial-tab"
              to={`/memoire/${m.slug}`}
              aria-current={path === `/memoire/${m.slug}` ? 'page' : undefined}
            >
              <Flame aria-hidden="true" /> {m.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
