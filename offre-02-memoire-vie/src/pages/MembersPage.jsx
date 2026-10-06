import { useState } from 'react'
import { Search, UserPlus } from 'lucide-react'
import MembersGate from '../components/MembersGate.jsx'
import { useToast } from '../components/Toast.jsx'
import { SITE } from '../data/site.js'
import { initials, plural } from '../lib/format.js'
import { placeholderStyle } from '../lib/placeholder.js'
import { canSeeMembersContent, useStore } from '../lib/store.jsx'

const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

export default function MembersPage() {
  const { state } = useStore()
  const toast = useToast()
  const [query, setQuery] = useState('')

  if (!canSeeMembersContent(state)) {
    return (
      <section className="section">
        <div className="wrap">
          <p className="eyebrow">Annuaire</p>
          <h1 className="page-title">Les membres du 12G2</h1>
          <MembersGate title="L’annuaire est réservé aux membres">
            Villes, métiers et coordonnées des camarades ne sont visibles que par les membres connectés.
          </MembersGate>
        </div>
      </section>
    )
  }

  const everyone = [
    ...(state.member ? [{ id: 'moi', nom: state.member.nom, ville: state.member.ville, metier: state.member.metier, moi: true }] : []),
    ...state.members,
  ]
  const q = normalize(query.trim())
  const list = q ? everyone.filter((m) => normalize(`${m.nom} ${m.ville} ${m.metier}`).includes(q)) : everyone

  const invite = async () => {
    const link = `${SITE.url}/invitation/12G2-2026`
    try {
      await navigator.clipboard.writeText(link)
      toast('Lien d’invitation copié : partagez-le dans le groupe WhatsApp')
    } catch {
      toast(`Lien d’invitation : ${link}`)
    }
  }

  return (
    <section className="section">
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="eyebrow">Annuaire · visible par les membres</p>
            <h1 className="page-title">Les membres du 12G2</h1>
            <p className="lead">{plural(everyone.length, 'camarade inscrit', 'camarades inscrits')}. Chacun choisit ce qu’il affiche sur son profil.</p>
          </div>
          <button type="button" className="btn" onClick={invite}>
            <UserPlus aria-hidden="true" /> Inviter un camarade
          </button>
        </div>
        <div className="search">
          <Search aria-hidden="true" />
          <label htmlFor="recherche-membre" className="sr-only">
            Rechercher un membre
          </label>
          <input
            id="recherche-membre"
            className="input"
            type="search"
            placeholder="Rechercher par nom, ville ou métier"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {list.length ? (
          <ul className="members">
            {list.map((m) => (
              <li key={m.id} className="member">
                <span className="avatar" style={placeholderStyle(m.id)} aria-hidden="true">
                  {initials(m.nom)}
                </span>
                <span className="member__body">
                  <span className="member__name">
                    {m.nom}
                    {m.moi && <span className="chip chip--encre">Vous</span>}
                    {m.nouveau && <span className="chip chip--ok">Nouveau</span>}
                  </span>
                  <span className="member__meta">
                    {m.ville} · {m.metier}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">Aucun membre ne correspond à « {query} ».</p>
        )}
        <p className="small muted members-note">Noms, villes et métiers d’exemple.</p>
      </div>
    </section>
  )
}
