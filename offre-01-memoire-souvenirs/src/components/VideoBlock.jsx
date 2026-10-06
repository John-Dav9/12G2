import { useState } from 'react'
import { Play, Video } from 'lucide-react'
import { placeholderStyle } from '../lib/placeholder.js'

// Offre 01 : une vidéo par espace mémoire, hébergée sur YouTube en mode non répertorié.
export default function VideoBlock({ video, seed }) {
  const [playing, setPlaying] = useState(false)

  if (!video) {
    return (
      <p className="placeholder-note video-empty">
        <Video aria-hidden="true" /> Aucune vidéo pour le moment. Un administrateur peut ajouter un lien YouTube depuis l’espace de gestion.
      </p>
    )
  }

  return (
    <div className="video" style={placeholderStyle(seed)}>
      {playing ? (
        <div className="video__sim" role="status">
          <p>
            <strong>Lecture simulée.</strong> Sur le vrai site, la vidéo YouTube non répertoriée se lit ici, sans quitter la page.
          </p>
          <button type="button" className="btn btn--sm" onClick={() => setPlaying(false)}>
            Fermer
          </button>
        </div>
      ) : (
        <>
          <button type="button" className="video__play" onClick={() => setPlaying(true)} aria-label={`Lire la vidéo : ${video.title}`}>
            <Play aria-hidden="true" fill="currentColor" />
          </button>
          <span className="video__label">{video.title}</span>
        </>
      )}
    </div>
  )
}
