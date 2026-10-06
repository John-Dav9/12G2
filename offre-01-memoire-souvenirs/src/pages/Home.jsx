import { ArrowRight, Flame, Images, Users } from 'lucide-react'
import AlbumCard from '../components/AlbumCard.jsx'
import Photo from '../components/Photo.jsx'
import { SITE } from '../data/site.js'
import { plural } from '../lib/format.js'
import { placeholderStyle } from '../lib/placeholder.js'
import { Link } from '../lib/router.jsx'
import { useStore } from '../lib/store.jsx'

export default function Home() {
  const { state } = useStore()
  const albums = state.albums.filter((a) => a.category !== 'hommages').slice(0, 4)
  const messagesFor = (slug) => state.messages.filter((m) => m.memorial === slug && m.status === 'publié').length
  const albumsFor = (slug) => state.albums.filter((a) => a.memorial === slug).length

  return (
    <>
      <section className="hero">
        <div className="wrap hero__grid">
          <div className="hero__text">
            <p className="eyebrow">{SITE.association}</p>
            <h1>{SITE.accroche}</h1>
            <p className="lead">{SITE.presentation[0]}</p>
            <div className="hero__actions">
              <Link className="btn btn--primary" to="/galerie">
                <Images aria-hidden="true" /> Voir les souvenirs
              </Link>
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById('memoire')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Flame aria-hidden="true" /> Espaces mémoire
              </button>
            </div>
          </div>
          <figure className="hero__figure">
            <Photo seed="groupe-12g2" icon={Users} label="Photo de groupe du 12G2" className="photo--hero" />
            <figcaption className="caption">Photo de groupe du 12G2 · emplacement à remplacer</figcaption>
          </figure>
        </div>
      </section>

      <section className="section" id="memoire" aria-labelledby="memoire-titre">
        <div className="wrap">
          <div className="section__head">
            <div>
              <p className="eyebrow">In memoriam</p>
              <h2 id="memoire-titre">Ils restent dans nos cœurs</h2>
            </div>
          </div>
          <div className="memorial-cards">
            {state.memorials.map((m) => (
              <Link key={m.slug} className="memorial-card" to={`/memoire/${m.slug}`}>
                <span className="portrait" style={placeholderStyle(m.slug)} aria-hidden="true">
                  {m.monogram}
                </span>
                <span className="memorial-card__body">
                  <span className="memorial-card__name">{m.name}</span>
                  <span className="memorial-card__dates">{m.dates}</span>
                  <span className="memorial-card__meta">
                    {plural(messagesFor(m.slug), 'message', 'messages')} · {plural(albumsFor(m.slug), 'album', 'albums')}
                  </span>
                  <span className="memorial-card__cta">
                    Entrer dans son espace <ArrowRight aria-hidden="true" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="albums-titre">
        <div className="wrap">
          <div className="section__head">
            <div>
              <p className="eyebrow">Galerie des souvenirs</p>
              <h2 id="albums-titre">Nos derniers albums</h2>
            </div>
            <Link className="text-link" to="/galerie">
              Toute la galerie <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="album-grid">
            {albums.map((a) => (
              <AlbumCard key={a.id} album={a} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="asso-titre">
        <div className="wrap split">
          <div className="prose">
            <p className="eyebrow">L’association</p>
            <h2 id="asso-titre" className="section-title">
              Le 12G2, hier sur les bancs de l’école, aujourd’hui en famille
            </h2>
            <p>{SITE.presentation[1]}</p>
            <p className="placeholder-note">{SITE.etablissement}</p>
          </div>
          <dl className="pillars">
            {SITE.piliers.map((p) => (
              <div key={p.titre}>
                <dt>{p.titre}</dt>
                <dd>{p.texte}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
