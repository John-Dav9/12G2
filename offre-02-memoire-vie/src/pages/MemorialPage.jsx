import { Bell, BookOpen, ImagePlus, Info, PenLine } from 'lucide-react'
import AlbumCard from '../components/AlbumCard.jsx'
import Candle from '../components/Candle.jsx'
import Guestbook from '../components/Guestbook.jsx'
import MembersGate from '../components/MembersGate.jsx'
import Photo from '../components/Photo.jsx'
import ShareButtons from '../components/ShareButtons.jsx'
import { relDate } from '../lib/format.js'
import { placeholderStyle } from '../lib/placeholder.js'
import { useRouter } from '../lib/router.jsx'
import { isHidden, useStore } from '../lib/store.jsx'
import NotFound from './NotFound.jsx'

const SECTIONS = [
  ['hommage', 'Hommage'],
  ['programme', 'Programme et infos pratiques'],
  ['medias', 'Photos et vidéos'],
  ['anecdotes', 'Anecdotes'],
  ['condoleances', 'Condoléances'],
]

const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

export default function MemorialPage({ slug }) {
  const { state, dispatch } = useStore()
  const { navigate } = useRouter()
  const m = state.memorials.find((x) => x.slug === slug)
  if (!m) return <NotFound />

  const albums = state.albums.filter((a) => a.memorial === slug)
  const anecdotes = state.anecdotes.filter((a) => a.memorial === slug)
  const hidden = isHidden(state, m)

  const contribute = (draft) => {
    if (!state.member) {
      dispatch({ type: 'login/open' })
      return
    }
    dispatch({ type: 'contribution/draft', draft })
    navigate('/mon-espace')
  }

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

        <Candle memorial={m} />

        {hidden ? (
          <div className="m-section">
            <MembersGate title="Espace réservé aux membres du 12G2">
              La famille a souhaité que cet espace soit visible uniquement par les membres connectés.
            </MembersGate>
          </div>
        ) : (
          <>
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
              {m.rappel && (
                <p className="notice">
                  <Bell aria-hidden="true" /> {m.rappel}
                </p>
              )}
            </section>

            <section id="programme" className="m-section" aria-labelledby="programme-titre">
              <h2 id="programme-titre">Programme et informations pratiques</h2>
              <div className="split split--tight">
                <div>
                  <p className="muted programme-intro">{m.programme.intro}</p>
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
                </div>
                <dl className="infos">
                  {m.infos.map((info) => (
                    <div key={info.label}>
                      <dt>{info.label}</dt>
                      <dd>{info.valeur}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            <section id="medias" className="m-section" aria-labelledby="medias-titre">
              <div className="m-section__head">
                <h2 id="medias-titre">Photos et vidéos</h2>
                <button type="button" className="btn btn--sm" onClick={() => contribute({ type: 'photos', albumId: albums[0]?.id })}>
                  <ImagePlus aria-hidden="true" /> Proposer mes photos ou vidéos
                </button>
              </div>
              <div className="album-grid">
                {albums.map((a) => (
                  <AlbumCard key={a.id} album={a} />
                ))}
              </div>
            </section>

            <section id="anecdotes" className="m-section" aria-labelledby="anecdotes-titre">
              <div className="m-section__head">
                <h2 id="anecdotes-titre">Anecdotes et souvenirs</h2>
                <button type="button" className="btn btn--sm" onClick={() => contribute({ type: 'souvenir', memorial: m.slug })}>
                  <BookOpen aria-hidden="true" /> Raconter un souvenir
                </button>
              </div>
              {anecdotes.length ? (
                <ul className="anecdotes">
                  {anecdotes.map((a) => (
                    <li key={a.id} className="anecdote">
                      {a.withPhoto && <Photo item={a.src ? { src: a.src, caption: '' } : null} seed={`${a.id}-photo`} className="anecdote__photo" label="Photo jointe" />}
                      <div className="anecdote__body">
                        <p>{a.text}</p>
                        <p className="entry__sig">
                          <span className="entry__author">{a.author}</span>
                          <span className="entry__rel">{relDate(a.date)}</span>
                          {a.example && <span className="chip">Exemple</span>}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty">Aucune anecdote pour l’instant. Les membres peuvent en proposer une.</p>
              )}
            </section>

            <section id="condoleances" className="m-section" aria-labelledby="condoleances-titre">
              <h2 id="condoleances-titre">Livre de condoléances</h2>
              <Guestbook memorial={m} />
            </section>
          </>
        )}
      </div>
    </article>
  )
}
