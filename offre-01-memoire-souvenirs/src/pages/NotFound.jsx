import { Link } from '../lib/router.jsx'

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap prose">
        <p className="eyebrow">Page introuvable</p>
        <h1 className="page-title">Cette page n’existe pas ou plus.</h1>
        <p>
          <Link to="/">Revenir à l’accueil</Link>
        </p>
      </div>
    </section>
  )
}
