import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Photo from './Photo.jsx'

// Visionneuse plein écran : flèches du clavier, balayage sur téléphone, Échap pour fermer.
export default function Lightbox({ items, index, onIndex, onClose, renderItem }) {
  const closeRef = useRef(null)
  const touchX = useRef(null)
  const latest = useRef({ index, items, onIndex, onClose })
  latest.current = { index, items, onIndex, onClose }

  const go = (delta) => {
    const { index: i, items: list, onIndex: setIndex } = latest.current
    setIndex((i + delta + list.length) % list.length)
  }

  useEffect(() => {
    const previous = document.activeElement
    closeRef.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event) => {
      if (event.key === 'Escape') latest.current.onClose()
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [])

  const item = items[index]
  if (!item) return null
  const several = items.length > 1

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Photo ${index + 1} sur ${items.length}`}>
      <div className="lightbox__top">
        <span className="tnum">
          {index + 1} / {items.length}
        </span>
        <button ref={closeRef} type="button" className="lb-btn" onClick={() => onClose()} aria-label="Fermer la visionneuse">
          <X aria-hidden="true" />
        </button>
      </div>
      <div
        className="lightbox__stage"
        onTouchStart={(event) => {
          touchX.current = event.touches[0].clientX
        }}
        onTouchEnd={(event) => {
          if (touchX.current == null) return
          const dx = event.changedTouches[0].clientX - touchX.current
          touchX.current = null
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
        }}
      >
        {several && (
          <button type="button" className="lb-btn lb-prev" onClick={() => go(-1)} aria-label="Photo précédente">
            <ChevronLeft aria-hidden="true" />
          </button>
        )}
        <figure className="lightbox__figure">
          {renderItem ? renderItem(item) : <Photo item={item} className="lightbox__img" />}
        </figure>
        {several && (
          <button type="button" className="lb-btn lb-next" onClick={() => go(1)} aria-label="Photo suivante">
            <ChevronRight aria-hidden="true" />
          </button>
        )}
      </div>
      <p className="lightbox__cap">{item.caption}</p>
    </div>
  )
}
