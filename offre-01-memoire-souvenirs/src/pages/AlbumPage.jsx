import { useState } from 'react'
import { ArrowLeft, Info, Lock } from 'lucide-react'
import Lightbox from '../components/Lightbox.jsx'
import Photo from '../components/Photo.jsx'
import { categoryLabel } from '../data/albums.js'
import { plural } from '../lib/format.js'
import { Link } from '../lib/router.jsx'
import { isAlbumLocked, useStore } from '../lib/store.jsx'
import NotFound from './NotFound.jsx'

function CodeGate({ album }) {
  const { dispatch } = useStore()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (code.trim().toUpperCase() === album.protected.code.toUpperCase()) {
      dispatch({ type: 'album/unlock', id: album.id })
    } else {
      setError('Code incorrect. Il est partagé dans le groupe WhatsApp du 12G2.')
    }
  }

  return (
    <form className="code-gate" onSubmit={submit} noValidate>
      <span className="code-gate__icon" aria-hidden="true">
        <Lock />
      </span>
      <h2>Album réservé au 12G2</h2>
      <p className="muted">
        Par respect pour la famille, les photos des obsèques s’affichent avec le code d’accès partagé dans le groupe du 12G2.
      </p>
      <div className="field">
        <label htmlFor={`code-${album.id}`}>Code d’accès</label>
        <input
          id={`code-${album.id}`}
          className="input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoComplete="off"
          aria-invalid={Boolean(error)}
        />
        {error && (
          <span className="field__error" role="alert">
            {error}
          </span>
        )}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn--primary">
          Ouvrir l’album
        </button>
      </div>
      <p className="demo-hint">
        Code de démonstration : <code>{album.protected.code}</code>
      </p>
    </form>
  )
}

export default function AlbumPage({ id }) {
  const { state } = useStore()
  const [index, setIndex] = useState(null)
  const album = state.albums.find((a) => a.id === id)
  if (!album) return <NotFound />

  const memorial = album.memorial ? state.memorials.find((m) => m.slug === album.memorial) : null
  const locked = isAlbumLocked(state, album)

  return (
    <section className="section">
      <div className="wrap">
        {memorial ? (
          <Link className="back-link" to={`/memoire/${memorial.slug}`}>
            <ArrowLeft aria-hidden="true" /> Espace de {memorial.name}
          </Link>
        ) : (
          <Link className="back-link" to="/galerie">
            <ArrowLeft aria-hidden="true" /> Galerie des souvenirs
          </Link>
        )}

        <header className="album-head">
          <p className="eyebrow">
            {categoryLabel(album.category)} · {album.year ?? album.period ?? ''}
          </p>
          <h1>{album.title}</h1>
          {album.description && <p className="lead">{album.description}</p>}
          <div className="album-head__meta">
            <span className="chip">{album.items.length ? plural(album.items.length, 'photo', 'photos') : 'Aucune photo'}</span>
            <span className="chip">Légendées · plein écran</span>
            {album.protected && (
              <span className="chip chip--bougie">
                <Lock aria-hidden="true" /> Accès par code
              </span>
            )}
          </div>
        </header>

        {locked ? (
          <CodeGate album={album} />
        ) : album.items.length ? (
          <>
            <ul className="photo-grid">
              {album.items.map((item, i) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="photo-tile"
                    onClick={() => setIndex(i)}
                    aria-label={`Agrandir : ${item.caption}`}
                  >
                    <Photo item={item} />
                  </button>
                  <p className="photo-cap">{item.caption}</p>
                </li>
              ))}
            </ul>
            {album.note && (
              <p className="notice notice--bougie" style={{ marginTop: '1.5rem' }}>
                <Info aria-hidden="true" /> {album.note}
              </p>
            )}
          </>
        ) : (
          <p className="empty">Cet album attend ses premières photos. Les administrateurs les ajoutent depuis l’espace de gestion.</p>
        )}

        {index != null && <Lightbox items={album.items} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />}
      </div>
    </section>
  )
}
