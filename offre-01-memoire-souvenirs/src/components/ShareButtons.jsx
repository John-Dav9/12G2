import { useState } from 'react'
import { Link as LinkIcon, MessageCircle } from 'lucide-react'
import { SITE } from '../data/site.js'
import { useToast } from './Toast.jsx'

// Partage d'un espace : lien WhatsApp avec texte prérempli et copie de l'adresse.
export default function ShareButtons({ title, path }) {
  const toast = useToast()
  const [fallback, setFallback] = useState(false)
  const url = `${SITE.url}${path}`
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${title} : ${url}`)}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast('Lien copié')
    } catch {
      setFallback(true)
    }
  }

  return (
    <>
      <a className="btn" href={whatsapp} target="_blank" rel="noopener noreferrer">
        <MessageCircle aria-hidden="true" /> Partager sur WhatsApp
      </a>
      <button type="button" className="btn" onClick={copy}>
        <LinkIcon aria-hidden="true" /> Copier le lien
      </button>
      {fallback && (
        <label className="field share-fallback">
          <span className="field__hint">Sélectionnez puis copiez l’adresse :</span>
          <input className="input" readOnly value={url} onFocus={(event) => event.target.select()} autoFocus />
        </label>
      )}
    </>
  )
}
