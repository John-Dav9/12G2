import { Lock } from 'lucide-react'
import { categoryLabel } from '../data/albums.js'
import { plural } from '../lib/format.js'
import { Link } from '../lib/router.jsx'
import { isAlbumLocked, useStore } from '../lib/store.jsx'
import Photo from './Photo.jsx'

export default function AlbumCard({ album }) {
  const { state } = useStore()
  const locked = isAlbumLocked(state, album)
  const count = album.items.length
  return (
    <Link className="album-card" to={`/album/${album.id}`}>
      <div className="album-card__cover">
        <div className="album-card__frame">
          <Photo item={locked ? null : album.items[0]} seed={album.id} className={locked ? 'is-blurred' : ''} label={album.title} />
        </div>
        <div className="album-card__badges">
          <span className="chip chip--on-photo">{count ? plural(count, 'photo', 'photos') : 'Aucune photo'}</span>
          {album.protected && (
            <span className="chip chip--on-photo">
              <Lock aria-hidden="true" /> Accès par code
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
