import { useMemo, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import AlbumCard from '../components/AlbumCard.jsx'
import { CATEGORIES } from '../data/albums.js'
import { plural } from '../lib/format.js'
import { useRouter } from '../lib/router.jsx'
import { useStore } from '../lib/store.jsx'

export default function Gallery() {
  const { state, dispatch } = useStore()
  const { navigate } = useRouter()
  const [category, setCategory] = useState('tous')
  const [year, setYear] = useState('toutes')

  const years = useMemo(
    () => [...new Set(state.albums.map((a) => a.year).filter(Boolean))].sort((a, b) => b - a),
    [state.albums],
  )

  const albums = state.albums.filter((a) => {
    if (category !== 'tous' && a.category !== category) return false
    if (year === 'toutes') return true
    if (year === 'sans') return !a.year
    return String(a.year) === year
  })

  const items = state.albums.flatMap((a) => a.items)
  const videos = items.filter((i) => i.kind === 'video').length

  const propose = () => {
    if (!state.member) {
      dispatch({ type: 'login/open' })
      return
    }
    dispatch({ type: 'contribution/draft', draft: { type: 'photos' } })
    navigate('/mon-espace')
  }

  return (
    <section className="section">
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="eyebrow">
              Archives · {plural(state.albums.length, 'album', 'albums')} · {plural(items.length - videos, 'photo', 'photos')} ·{' '}
              {plural(videos, 'vidéo', 'vidéos')}
            </p>
            <h1 className="page-title">Les archives du 12G2</h1>
            <p className="lead">Années d’école, retrouvailles, célébrations, activités et solidarité. Certains albums sont réservés aux membres.</p>
          </div>
          <button type="button" className="btn btn--primary" onClick={propose}>
            <ImagePlus aria-hidden="true" /> Proposer des photos
          </button>
        </div>

        <div className="toolbar">
          <div className="filter-chips" role="group" aria-label="Filtrer par catégorie">
            <button type="button" className="filter-chip" aria-pressed={category === 'tous'} onClick={() => setCategory('tous')}>
              Tous
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className="filter-chip"
                aria-pressed={category === c.id}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <label className="inline-select" htmlFor="filtre-annee">
            Année
            <select id="filtre-annee" className="select" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="toutes">Toutes</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
              <option value="sans">Archives sans date</option>
            </select>
          </label>
        </div>

        {albums.length ? (
          <div className="album-grid">
            {albums.map((a) => (
              <AlbumCard key={a.id} album={a} />
            ))}
          </div>
        ) : (
          <p className="empty">Aucun album ne correspond à ce filtre.</p>
        )}
      </div>
    </section>
  )
}
