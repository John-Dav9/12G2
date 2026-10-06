import { Camera } from 'lucide-react'
import { placeholderStyle } from '../lib/placeholder.js'

// Affiche une vraie photo si elle existe (ajoutée depuis la gestion), sinon un emplacement.
export default function Photo({ item, seed, icon: Icon = Camera, label, className = '' }) {
  if (item?.src) {
    return <img className={`photo ${className}`} src={item.src} alt={item.caption || label || ''} loading="lazy" />
  }
  const key = seed ?? item?.seed ?? item?.id ?? 'photo'
  return (
    <div
      className={`photo photo--ph ${className}`}
      style={placeholderStyle(key)}
      role="img"
      aria-label={item?.caption || label || 'Emplacement photo'}
    >
      <Icon className="photo__icon" aria-hidden="true" strokeWidth={1.5} />
    </div>
  )
}
