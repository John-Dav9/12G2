import { Flame } from 'lucide-react'
import { num } from '../lib/format.js'
import { useStore } from '../lib/store.jsx'

// Bougie du souvenir : chaque visiteur peut en allumer une par espace.
export default function Candle({ memorial }) {
  const { state, dispatch } = useStore()
  const lit = Boolean(state.candlesLit[memorial.slug])
  return (
    <div className={`candle${lit ? ' is-lit' : ''}`}>
      <span className="candle__art" aria-hidden="true">
        <span className="candle__flame" />
        <span className="candle__wick" />
        <span className="candle__body" />
      </span>
      <div className="candle__text">
        <p className="candle__count">
          <strong className="tnum">{num(memorial.candles)}</strong> bougies allumées
        </p>
        <p className="small muted" role="status">
          {lit ? `Merci. Votre bougie brille pour ${memorial.firstName}.` : `Allumez une bougie en mémoire de ${memorial.firstName}.`}
        </p>
      </div>
      <button
        type="button"
        className="btn btn--bougie btn--sm"
        onClick={() => dispatch({ type: 'candle/light', slug: memorial.slug })}
        disabled={lit}
      >
        <Flame aria-hidden="true" /> {lit ? 'Bougie allumée' : 'Allumer une bougie'}
      </button>
    </div>
  )
}
