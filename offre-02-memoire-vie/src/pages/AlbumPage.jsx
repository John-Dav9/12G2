import { useState } from 'react'
import { ArrowLeft, ImagePlus, Info, Lock } from 'lucide-react'
import { mediaCount } from '../components/AlbumCard.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { MediaTile, renderMedia } from '../components/Media.jsx'
import MembersGate from '../components/MembersGate.jsx'
import { categoryLabel } from '../data/albums.js'
import { Link, useRouter } from '../lib/router.jsx'
import { isHidden, useStore } from '../lib/store.jsx'
import NotFound from './NotFound.jsx'

export default function AlbumPage({ id }) {
  const { state, dispatch } = useStore()
  const { navigate } = useRouter()
  const [index, setIndex] = useState(null)
  const album = state.albums.find((a) => a.id === id)
  if (!album) return <NotFound />

  const memorial = album.memorial ? state.memorials.find((m) => m.slug === album.memorial) : null
  const hidden = isHidden(state, album)

  const propose = () => {
    if (!state.member) {
      dispatch({ type: 'login/open' })
      return
    }
    dispatch({ type: 'contribution/draft', draft: { type: 'photos', albumId: album.id } })
    navigate('/mon-espace')
  }

  return (
    <section className="section">
      <div className="wrap">
        {memorial ? (
          <Link className="back-link" to={`/memoire/${memorial.slug}`}>
            <ArrowLeft aria-hidden="true" /> Espace de {memorial.name}
          </Link>
        ) : (
          <Link className="back-link" to="/archives">
            <ArrowLeft aria-hidden="true" /> Archives
          </Link>
        )}

        <header className="album-head">
          <p className="eyebrow">
            {categoryLabel(album.category)} · {album.year ?? album.period ?? ''}
          </p>
          <h1>{album.title}</h1>
          {album.description && <p className="lead">{album.description}</p>}
          <div className="album-head__meta">
            <span className="chip">{mediaCount(album.items)}</span>
            {album.visibility === 'membres' ? (
              <span className="chip chip--bougie">
                <Lock aria-hidden="true" /> Réservé aux membres
              </span>
            ) : (
              <span className="chip">Public</span>
            )}
          </div>
        </header>

        {hidden ? (
          <MembersGate title="Album réservé aux membres du 12G2">
            Par respect pour les familles, cet album n’est visible que par les membres connectés.
          </MembersGate>
        ) : (
          <>
            {album.items.length ? (
              <ul className="photo-grid">
                {album.items.map((item, i) => (
                  <li key={item.id}>
                    <MediaTile item={item} onOpen={() => setIndex(i)} />
                    <p className="photo-cap">{item.caption}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">Cet album attend ses premières photos.</p>
            )}
            <div className="album-foot">
              {album.note && (
                <p className="notice notice--bougie">
                  <Info aria-hidden="true" /> {album.note}
                </p>
              )}
              <button type="button" className="btn" onClick={propose}>
                <ImagePlus aria-hidden="true" /> Proposer des photos ou des vidéos pour cet album
              </button>
            </div>
          </>
        )}

        {index != null && (
          <Lightbox items={album.items} index={index} onIndex={setIndex} onClose={() => setIndex(null)} renderItem={renderMedia} />
        )}
      </div>
    </section>
  )
}
