import { useEffect, useState } from 'react'
import { Flame, Home, Images, Menu, Settings, X } from 'lucide-react'
import { SITE } from '../data/site.js'
import { Link, useRouter } from '../lib/router.jsx'
import { useStore } from '../lib/store.jsx'

const LINKS = [
  { to: '/', label: 'Accueil', icon: Home },
  { to: '/galerie', label: 'Galerie des souvenirs', icon: Images },
  { to: '/gestion', label: 'Gestion', icon: Settings },
]

export default function Header() {
  const { state } = useStore()
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
