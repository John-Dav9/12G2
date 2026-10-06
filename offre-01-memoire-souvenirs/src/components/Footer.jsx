import { SITE } from '../data/site.js'
import { Link } from '../lib/router.jsx'

export default function Footer({ onOpenOffer }) {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__grid">
        <div>
          <p className="site-footer__brand">
            12G2 · {SITE.formule}
          </p>
          <p>{SITE.association}. Plateforme gérée par ses administrateurs.</p>
        </div>
        <nav aria-label="Pied de page">
          <Link to="/">Accueil</Link>
          <Link to="/galerie">Galerie</Link>
          <Link to="/gestion">Gestion</Link>
          <button type="button" className="link-btn" onClick={onOpenOffer}>
            L’offre {SITE.offre}
          </button>
        </nav>
      </div>
    </footer>
  )
}
