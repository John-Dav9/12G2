import { Info, MapPin, PenLine, Send } from 'lucide-react'
import AlbumCard from '../components/AlbumCard.jsx'
import Guestbook from '../components/Guestbook.jsx'
import ShareButtons from '../components/ShareButtons.jsx'
import VideoBlock from '../components/VideoBlock.jsx'
import { placeholderStyle } from '../lib/placeholder.js'
import { useStore } from '../lib/store.jsx'
import NotFound from './NotFound.jsx'

const SECTIONS = [
  ['hommage', 'Hommage'],
  ['programme', 'Programme des obsèques'],
  ['photos', 'Photos'],
  ['video', 'Vidéo'],
  ['condoleances', 'Condoléances'],
]

const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

export default function MemorialPage({ slug }) {
  const { state } = useStore()
  const m = state.memorials.find((x) => x.slug === slug)
  if (!m) return <NotFound />
  const albums = state.albums.filter((a) => a.memorial === slug)

  return (
    <article>
      <div className="memorial-cover" style={placeholderStyle(m.seed)} aria-hidden="true" />
      <div className="wrap">
        <header className="memorial-head">
          <span className="portrait portrait--lg" style={placeholderStyle(m.slug)} aria-hidden="true">
            {m.monogram}
          </span>
          <div>
            <p className="eyebrow">In memoriam · Espace du 12G2</p>
            <h1>{m.name}</h1>
            <p className="memorial-dates">{m.dates}</p>
          </div>
        </header>

        <p className="lead memorial-intro">{m.accroche}</p>

        <div className="memorial-actions">
          <button type="button" className="btn btn--bougie" onClick={() => scrollToSection('condoleances')}>
            <PenLine aria-hidden="true" /> Écrire un message
          </button>
          <ShareButtons title={`Espace mémoire de ${m.name} · 12G2`} path={`/memoire/${m.slug}`} />
        </div>

        <nav className="subnav" aria-label="Sections de l’espace">
          {SECTIONS.map(([id, label]) => (
            <button key={id} type="button" onClick={() => scrollToSection(id)}>
              {label}
            </button>
          ))}
        </nav>

        <section id="hommage" className="m-section" aria-labelledby="hommage-titre">
          <h2 id="hommage-titre">Hommage</h2>
          <div className="prose">
            {m.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {m.bioNote && (
            <p className="placeholder-note">
              <Info aria-hidden="true" /> {m.bioNote}
            </p>
          )}
        </section>

        <section id="programme" className="m-section" aria-labelledby="programme-titre">
          <h2 id="programme-titre">Programme des obsèques</h2>
          <p className="muted">{m.programme.intro}</p>
          <ol className="programme">
            {m.programme.etapes.map((etape) => (
              <li key={etape.label}>
                <span className="programme__label">{etape.label}</span>
                <span className="programme__when">
                  {etape.quand} · {etape.ou}
                </span>
              </li>
            ))}
          </ol>
          {m.programme.pratique && (
            <p className="notice">
              <MapPin aria-hidden="true" /> {m.programme.pratique}
            </p>
          )}
        </section>

        <section id="photos" className="m-section" aria-labelledby="photos-titre">
          <h2 id="photos-titre">Photos</h2>
          <div className="album-grid">
            {albums.map((a) => (
              <AlbumCard key={a.id} album={a} />
            ))}
          </div>
          <p className="notice">
            <Send aria-hidden="true" /> Vous étiez présent ? Envoyez vos photos à un administrateur dans le groupe WhatsApp du 12G2 :
            elles seront publiées ici avec une légende.
          </p>
        </section>

        <section id="video" className="m-section" aria-labelledby="video-titre">
          <div className="m-section__head">
            <h2 id="video-titre">Vidéo</h2>
            <span className="chip">Une vidéo par espace</span>
          </div>
          <VideoBlock video={m.video} seed={`${m.slug}-video`} />
        </section>

        <section id="condoleances" className="m-section" aria-labelledby="condoleances-titre">
          <h2 id="condoleances-titre">Livre de condoléances</h2>
          <Guestbook memorial={m} />
        </section>
      </div>
    </article>
  )
}
