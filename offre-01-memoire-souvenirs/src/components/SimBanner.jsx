import { OFFRE } from '../data/offre.js'

export default function SimBanner({ onOpenOffer }) {
  return (
    <div className="sim-banner">
      <div className="wrap sim-banner__inner">
        <p className="sim-banner__text">
          <strong>Simulation de l’offre {OFFRE.numero}</strong> « {OFFRE.nom} ». Photos et messages d’exemple.
        </p>
        <button type="button" className="sim-banner__btn" onClick={onOpenOffer}>
          Voir l’offre et le budget
        </button>
      </div>
    </div>
  )
}
