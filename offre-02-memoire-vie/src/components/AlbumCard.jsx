import { Lock } from 'lucide-react'
import { categoryLabel } from '../data/albums.js'
import { plural } from '../lib/format.js'
import { Link } from '../lib/router.jsx'
import { isHidden, useStore } from '../lib/store.jsx'
import Photo from './Photo.jsx'

export function mediaCount(items) {
  const videos = items.filter((i) => i.kind === 'video').length
  const photos = items.length - videos
  const parts = []
  if (photos) parts.push(plural(photos, 'photo', 'photos'))
  if (videos) parts.push(plural(videos, 'vidéo', 'vidéos'))
  return parts.join(' · ') || 'Album vide'
}

export default function AlbumCard({ album }) {
  const { state } = useStore()
  const hidden = isHidden(state, album)
  const cover = album.items.find((i) => i.kind === 'photo') ?? null
  return (
    <Link className="album-card" to={`/album/${album.id}`}>
      <div className="album-card__cover">
        <div className="album-card__frame">
          <Photo item={hidden ? null : cover} seed={album.id} className={hidden ? 'is-blurred' : ''} label={album.title} />
        </div>
        <div className="album-card__badges">
          <span className="chip chip--on-photo">{mediaCount(album.items)}</span>
          {album.visibility === 'membres' && (
            <span className="chip chip--on-photo">
              <Lock aria-hidden="true" /> Membres
            </span>
          )}
        </div>
      </div>
      <div>
        <h3 className="album-card__title">{album.title}</h3>
        <p className="album-card__meta">
          <span>{categoryLabel(album.category)}</span>
          <span>{album.year ?? album.period ?? ''}</span>
        </p>
      </div>
    </Link>
  )
}
