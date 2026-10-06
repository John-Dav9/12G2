import { SITE } from '../data/site.js'
import { Link } from '../lib/router.jsx'

export default function Footer({ onOpenOffer }) {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__grid">
        <div>
          <p className="site-footer__brand">12G2 · {SITE.formule}</p>
          <p>{SITE.association}. Contenus validés par les administrateurs avant publication.</p>
        </div>
        <nav aria-label="Pied de page">
          <Link to="/">Accueil</Link>
          <Link to="/archives">Archives</Link>
          <Link to="/actualites">Actualités</Link>
          <Link to="/membres">Membres</Link>
          <Link to="/mon-espace">Mon espace</Link>
          <Link to="/gestion">Gestion</Link>
          <button type="button" className="link-btn" onClick={onOpenOffer}>
            L’offre {SITE.offre}
          </button>
        </nav>
      </div>
    </footer>
  )
}
