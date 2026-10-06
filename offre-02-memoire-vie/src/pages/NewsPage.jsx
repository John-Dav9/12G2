import { useState } from 'react'
import { ArrowRight, CalendarCheck, Heart, Lock, MapPin, Plus } from 'lucide-react'
import { POST_TYPES, postTypeLabel } from '../data/posts.js'
import { num, relDate } from '../lib/format.js'
import { Link } from '../lib/router.jsx'
import { isHidden, useStore } from '../lib/store.jsx'

const dayFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric' })
const monthFormat = new Intl.DateTimeFormat('fr-FR', { month: 'short' })
const longFormat = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })

export function eventDay(iso) {
  const d = new Date(iso)
  const long = longFormat.format(d).replace(':', ' h ')
  return { day: dayFormat.format(d), month: monthFormat.format(d).replace('.', ''), long: long.charAt(0).toUpperCase() + long.slice(1) }
}

// Confirmation de présence : réservée aux membres connectés.
export function RsvpButton({ post }) {
  const { state, dispatch } = useStore()
  const going = Boolean(state.rsvp[post.id])
  const count = (post.rsvp ?? 0) + (going ? 1 : 0)
  if (!state.member) {
    return (
      <button type="button" className="btn btn--sm" onClick={() => dispatch({ type: 'login/open' })}>
        <CalendarCheck aria-hidden="true" /> Se connecter pour répondre · {num(count)} présents
      </button>
    )
  }
  return (
    <button
      type="button"
      className={`btn btn--sm${going ? ' btn--primary' : ''}`}
      aria-pressed={going}
      onClick={() => dispatch({ type: 'rsvp/toggle', id: post.id })}
    >
      <CalendarCheck aria-hidden="true" /> {going ? 'Je participe' : 'Je serai présent'} · {num(count)}
    </button>
  )
}

function ReactButton({ post }) {
  const { state, dispatch } = useStore()
  const reacted = Boolean(state.reacted[post.id])
  const count = (post.reactions ?? 0) + (reacted ? 1 : 0)
  return (
    <button
      type="button"
      className={`btn btn--sm${reacted ? ' btn--bougie' : ''}`}
      aria-pressed={reacted}
      onClick={() => dispatch(state.member ? { type: 'reaction/toggle', id: post.id } : { type: 'login/open' })}
    >
      <Heart aria-hidden="true" /> {reacted ? 'Félicitations envoyées' : 'Féliciter'} · {num(count)}
    </button>
  )
}

function PostCard({ post }) {
  const { state, dispatch } = useStore()
  const hidden = isHidden(state, post)
  const day = post.type === 'rencontre' ? eventDay(post.date) : null

  return (
    <article className="post">
      <div className="post__side" aria-hidden="true">
        {day ? (
          <span className="meeting__date">
            <span className="meeting__day">{day.day}</span>
            <span className="meeting__month">{day.month}</span>
          </span>
        ) : (
          <span className="post__rule" />
        )}
      </div>
      <div className="post__body">
        <p className="post__meta">
          <span className="chip chip--encre">{postTypeLabel(post.type)}</span>
          <span>{day ? day.long : relDate(post.date)}</span>
          {post.visibility === 'membres' && (
            <span className="chip">
              <Lock aria-hidden="true" /> Membres
            </span>
          )}
          {post.example && <span className="chip">Exemple</span>}
        </p>
        <h2 className="post__title">{post.title}</h2>
        {hidden ? (
          <p className="muted">
            Contenu réservé aux membres.{' '}
            <button type="button" className="link-btn link-btn--accent" onClick={() => dispatch({ type: 'login/open' })}>
              Se connecter
            </button>
          </p>
        ) : (
          <>
            <p>{post.text}</p>
            {post.points && (
              <ul className="bullets">
                {post.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
            {post.lieu && (
              <p className="meeting__where">
                <MapPin aria-hidden="true" /> {post.lieu}
              </p>
            )}
          </>
        )}
        <div className="post__actions">
          {post.type === 'rencontre' && <RsvpButton post={post} />}
          {post.reactions != null && <ReactButton post={post} />}
          {post.link && !hidden && (
            <Link className="text-link" to={post.link.to}>
              {post.link.label} <ArrowRight aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

export default function NewsPage() {
  const { state } = useStore()
  const [type, setType] = useState('tout')
  const posts = state.posts
    .filter((p) => type === 'tout' || p.type === type)
    .sort((a, b) => {
      const upcomingA = a.type === 'rencontre' && new Date(a.date) >= new Date()
      const upcomingB = b.type === 'rencontre' && new Date(b.date) >= new Date()
      if (upcomingA !== upcomingB) return upcomingA ? -1 : 1
      return new Date(b.date) - new Date(a.date)
    })

  return (
    <section className="section">
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="eyebrow">Actualités et événements</p>
            <h1 className="page-title">La vie du 12G2</h1>
            <p className="lead">Rencontres, comptes rendus, solidarité et heureux événements.</p>
          </div>
          {state.admin && (
            <Link className="btn btn--primary" to="/gestion">
              <Plus aria-hidden="true" /> Publier une actualité
            </Link>
          )}
        </div>
        <div className="toolbar">
          <div className="filter-chips" role="group" aria-label="Filtrer par type">
            <button type="button" className="filter-chip" aria-pressed={type === 'tout'} onClick={() => setType('tout')}>
              Tout
            </button>
            {POST_TYPES.map((t) => (
              <button key={t.id} type="button" className="filter-chip" aria-pressed={type === t.id} onClick={() => setType(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {posts.length ? (
          <div className="posts">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <p className="empty">Aucune publication de ce type pour l’instant.</p>
        )}
      </div>
    </section>
  )
}
