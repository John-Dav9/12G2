import { useMemo, useState } from 'react'
import AlbumCard from '../components/AlbumCard.jsx'
import { CATEGORIES } from '../data/albums.js'
import { plural } from '../lib/format.js'
import { useStore } from '../lib/store.jsx'

export default function Gallery() {
  const { state } = useStore()
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

  const photoCount = state.albums.reduce((sum, a) => sum + a.items.length, 0)

  return (
    <section className="section">
      <div className="wrap">
        <p className="eyebrow">
          Galerie des souvenirs · {plural(state.albums.length, 'album', 'albums')} · {plural(photoCount, 'photo', 'photos')}
        </p>
        <h1 className="page-title">Nos albums</h1>
        <p className="lead">Photos d’école, retrouvailles et activités du 12G2, classées par catégorie et par année.</p>

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
