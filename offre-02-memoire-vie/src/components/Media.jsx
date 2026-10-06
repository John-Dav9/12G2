import { useState } from 'react'
import { Play } from 'lucide-react'
import { placeholderStyle } from '../lib/placeholder.js'
import Photo from './Photo.jsx'

// Vignette d'album : photo, ou vidéo avec sa durée.
export function MediaTile({ item, onOpen }) {
  const isVideo = item.kind === 'video'
  return (
    <button
      type="button"
      className="photo-tile"
      onClick={onOpen}
      aria-label={`${isVideo ? 'Lire la vidéo' : 'Agrandir la photo'} : ${item.caption}`}
    >
      {isVideo && item.src ? (
        <video className="photo" src={item.src} muted playsInline preload="metadata" />
      ) : (
        <Photo item={isVideo ? { ...item, src: undefined } : item} />
      )}
      {isVideo && (
        <span className="tile-video" aria-hidden="true">
          <span className="tile-video__play">
            <Play fill="currentColor" />
          </span>
          {item.duration && <span className="tile-video__time">{item.duration}</span>}
        </span>
      )}
    </button>
  )
}

// Lecteur de la visionneuse. Les vidéos de la simulation sont simulées ; une vidéo choisie sur
// l'appareil (Mon espace) se lit vraiment.
export function VideoStage({ item }) {
  const [playing, setPlaying] = useState(false)
  if (item.src) {
    return <video className="lightbox__img lightbox__video" src={item.src} controls playsInline />
  }
  return (
    <div className="lightbox__img photo--ph video-stage" style={placeholderStyle(item.seed ?? item.id)}>
      {playing ? (
        <div className="video__sim" role="status">
          <p>
            <strong>Lecture simulée.</strong> Sur la vraie plateforme, la vidéo démarre ici dans une qualité adaptée à la connexion
            du téléphone.
          </p>
          <button type="button" className="btn btn--sm" onClick={() => setPlaying(false)}>
            Fermer
          </button>
        </div>
      ) : (
        <button type="button" className="video__play" onClick={() => setPlaying(true)} aria-label={`Lire : ${item.caption}`}>
          <Play aria-hidden="true" fill="currentColor" />
        </button>
      )}
    </div>
  )
}

export function renderMedia(item) {
  return item.kind === 'video' ? <VideoStage key={item.id} item={item} /> : <Photo item={item} className="lightbox__img" />
}
