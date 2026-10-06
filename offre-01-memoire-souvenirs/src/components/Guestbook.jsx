import { useState } from 'react'
import { CircleCheck, PenLine } from 'lucide-react'
import { RELATIONS } from '../data/messages.js'
import { relDate } from '../lib/format.js'
import { Link } from '../lib/router.jsx'
import { newId, useStore } from '../lib/store.jsx'

const EMPTY = { author: '', relation: RELATIONS[0], text: '', human: false }

// Livre de condoléances : chacun peut écrire sans compte, un administrateur valide avant publication.
export default function Guestbook({ memorial }) {
  const { state, dispatch } = useStore()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const messages = state.messages.filter((m) => m.memorial === memorial.slug && m.status === 'publié')
  const field = (key) => (event) =>
    setForm((f) => ({ ...f, [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    const next = {}
    if (!form.author.trim()) next.author = 'Indiquez votre nom.'
    if (form.text.trim().length < 3) next.text = 'Écrivez votre message.'
    if (!form.human) next.human = 'Cochez la case de protection antispam.'
    setErrors(next)
    if (Object.keys(next).length) return
    dispatch({
      type: 'message/add',
      message: {
        id: newId('msg'),
        memorial: memorial.slug,
        author: form.author.trim(),
        relation: form.relation,
        text: form.text.trim(),
        date: new Date().toISOString(),
        status: 'en attente',
      },
    })
    setForm(EMPTY)
    setSent(true)
  }

  return (
    <div className="guestbook">
      {messages.length ? (
        <ul className="notebook" aria-label={`Messages pour ${memorial.name}`}>
          {messages.map((m) => (
            <li key={m.id} className="notebook-entry">
              <p className="entry__text">{m.text}</p>
              <p className="entry__sig">
                <span className="entry__author">{m.author}</span>
                <span className="entry__rel">
                  {m.relation} · {relDate(m.date)}
                </span>
                {m.example && <span className="chip">Exemple</span>}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">Aucun message publié pour l’instant. Soyez le premier à écrire.</p>
      )}

      <form className="guestbook__form form" onSubmit={submit} noValidate>
        <h3>
          <PenLine aria-hidden="true" size={20} /> Écrire un message pour {memorial.firstName}
        </h3>
        <div className="form-row form-row--2">
          <div className="field">
            <label htmlFor={`gb-author-${memorial.slug}`}>Votre nom</label>
            <input
              id={`gb-author-${memorial.slug}`}
              className="input"
              value={form.author}
              onChange={field('author')}
              autoComplete="name"
              aria-invalid={Boolean(errors.author)}
            />
            {errors.author && <span className="field__error">{errors.author}</span>}
          </div>
          <div className="field">
            <label htmlFor={`gb-relation-${memorial.slug}`}>Votre lien avec {memorial.firstName}</label>
            <select id={`gb-relation-${memorial.slug}`} className="select" value={form.relation} onChange={field('relation')}>
              {RELATIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor={`gb-text-${memorial.slug}`}>Votre message</label>
          <textarea
            id={`gb-text-${memorial.slug}`}
            className="textarea"
            value={form.text}
            onChange={field('text')}
            aria-invalid={Boolean(errors.text)}
          />
          {errors.text && <span className="field__error">{errors.text}</span>}
        </div>
        <div className="field">
          <label className="check" htmlFor={`gb-human-${memorial.slug}`}>
            <input id={`gb-human-${memorial.slug}`} type="checkbox" checked={form.human} onChange={field('human')} />
            Je confirme être une personne (protection antispam)
          </label>
          {errors.human && <span className="field__error">{errors.human}</span>}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn--primary">
            Envoyer mon message
          </button>
          <span className="small muted">Publié après validation par un administrateur.</span>
        </div>
        {sent && (
          <div className="notice notice--ok" role="status">
            <CircleCheck aria-hidden="true" />
            <span>
              Merci. Votre message sera publié dès qu’un administrateur l’aura validé.{' '}
              <Link to="/gestion">Voir la validation côté gestion</Link>
            </span>
          </div>
        )}
      </form>
    </div>
  )
}
