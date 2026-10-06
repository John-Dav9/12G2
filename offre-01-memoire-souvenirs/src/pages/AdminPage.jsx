import { useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  CircleCheck,
  Clock,
  Flame,
  FolderPlus,
  ImageOff,
  ImagePlus,
  Inbox,
  KeyRound,
  LogOut,
  Mail,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
} from 'lucide-react'
import { useToast } from '../components/Toast.jsx'
import { CATEGORIES, DEMO_CODE, categoryLabel } from '../data/albums.js'
import { defaultProgramme } from '../data/memorials.js'
import { SITE } from '../data/site.js'
import { fileSize, initials, plural, relDate, slugify } from '../lib/format.js'
import { compressImage } from '../lib/images.js'
import { Link, useRouter } from '../lib/router.jsx'
import { newId, useStore } from '../lib/store.jsx'

const LOGIN_CODE = '482913'

const TABS = [
  { id: 'valider', label: 'Messages à valider', icon: Inbox },
  { id: 'photos', label: 'Ajouter des photos', icon: ImagePlus },
  { id: 'espaces', label: 'Espaces mémoire', icon: Flame },
  { id: 'albums', label: 'Albums', icon: FolderPlus },
  { id: 'equipe', label: 'Administrateurs', icon: ShieldCheck },
]

function useForm(initial) {
  const [form, setForm] = useState(initial)
  const bind = (key) => (event) =>
    setForm((f) => ({ ...f, [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }))
  return [form, setForm, bind]
}

function AdminLogin() {
  const { dispatch } = useStore()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const sendCode = (event) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Saisissez une adresse email valide.')
      return
    }
    setError('')
    setStep('code')
  }

  const verify = (event) => {
    event.preventDefault()
    if (code.replace(/\s/g, '') !== LOGIN_CODE) {
      setError('Code incorrect. Utilisez le code de démonstration ci-dessous.')
      return
    }
    const address = email.trim().toLowerCase()
    const account = SITE.admins.find((a) => a.email === address) ?? SITE.admins[0]
    dispatch({ type: 'admin/login', admin: { ...account, email: address } })
  }

  return (
    <section className="section">
      <div className="wrap">
        <div className="auth">
          <div>
            <p className="eyebrow">Espace de gestion</p>
            <h1>Connexion administrateur</h1>
          </div>
          <p className="muted">
            Chaque administrateur a son propre accès. Aucun mot de passe à retenir ni à partager : un code à usage unique est envoyé
            par email.
          </p>
          {step === 'email' ? (
            <form className="form" onSubmit={sendCode} noValidate>
              <div className="field">
                <label htmlFor="admin-email">Adresse email</label>
                <input
                  id="admin-email"
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
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
                  <Mail aria-hidden="true" /> Recevoir un code
                </button>
              </div>
              <p className="demo-hint">
                Compte de démonstration : <code>{SITE.admins[0].email}</code>
                <button type="button" className="btn btn--sm" onClick={() => setEmail(SITE.admins[0].email)}>
                  Utiliser ce compte
                </button>
              </p>
            </form>
          ) : (
            <form className="form" onSubmit={verify} noValidate>
              <p>
                Sur la vraie plateforme, le code arrive dans la boîte de <strong>{email.trim()}</strong>.
              </p>
              <div className="field">
                <label htmlFor="admin-code">Code à 6 chiffres</label>
                <input
                  id="admin-code"
                  className="input"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
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
                  <KeyRound aria-hidden="true" /> Se connecter
                </button>
                <button
                  type="button"
                  className="btn btn--quiet"
                  onClick={() => {
                    setStep('email')
                    setCode('')
                    setError('')
                  }}
                >
                  Changer d’adresse
                </button>
              </div>
              <p className="demo-hint">
                Code de démonstration : <code>{LOGIN_CODE}</code>
                <button type="button" className="btn btn--sm" onClick={() => setCode(LOGIN_CODE)}>
                  Remplir
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function PendingPanel({ pending }) {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const nameOf = (slug) => state.memorials.find((m) => m.slug === slug)?.name ?? slug

  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Messages à valider</h2>
        <p className="muted">Les messages des visiteurs n’apparaissent qu’après votre accord. Un message refusé est supprimé.</p>
      </div>
      {pending.length ? (
        <ul className="queue">
          {pending.map((m) => (
            <li key={m.id}>
              <p className="queue__meta">
                <span className="chip chip--bougie">{nameOf(m.memorial)}</span>
                <span>
                  {m.author} · {m.relation} · {relDate(m.date)}
                </span>
                {m.example && <span className="chip">Exemple</span>}
              </p>
              <p className="queue__text">« {m.text} »</p>
              <div className="queue__actions">
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => {
                    dispatch({ type: 'message/approve', id: m.id })
                    toast(`Message publié dans l’espace de ${nameOf(m.memorial)}`)
                  }}
                >
                  <Check aria-hidden="true" /> Publier
                </button>
                <button
                  type="button"
                  className="btn btn--sm btn--danger"
                  onClick={() => {
                    dispatch({ type: 'message/reject', id: m.id })
                    toast('Message refusé et supprimé')
                  }}
                >
                  <Trash2 aria-hidden="true" /> Refuser
                </button>
                <Link className="btn btn--sm btn--quiet" to={`/memoire/${m.memorial}`}>
                  Voir l’espace
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">
          Aucun message en attente. Écrivez un message dans un espace mémoire pour voir le parcours de validation.
        </p>
      )}
    </div>
  )
}

function PhotosPanel() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const [albumId, setAlbumId] = useState(state.albums[0]?.id ?? '')
  const [uploads, setUploads] = useState([])
  const [busy, setBusy] = useState(false)
  const [over, setOver] = useState(false)
  const [done, setDone] = useState(null)
  const inputRef = useRef(null)
  const album = state.albums.find((a) => a.id === albumId)
  const ready = uploads.filter((u) => u.url)

  const addFiles = async (fileList) => {
    const files = Array.from(fileList || [])
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, 30)
    if (!files.length) return
    setBusy(true)
    setDone(null)
    const results = []
    for (const file of files) {
      try {
        const { blob } = await compressImage(file)
        results.push({ id: newId('photo'), name: file.name, before: file.size, after: blob.size, url: URL.createObjectURL(blob), caption: '' })
      } catch {
        results.push({ id: newId('photo'), name: file.name, before: file.size, after: 0, url: null, caption: '' })
      }
    }
    setUploads((list) => [...list, ...results])
    setBusy(false)
  }

  const publish = () => {
    if (!ready.length || !album) return
    const items = ready.map((u) => ({
      id: u.id,
      kind: 'photo',
      caption: u.caption.trim() || `Photo ajoutée par ${state.admin.nom}`,
      src: u.url,
    }))
    dispatch({ type: 'album/addItems', albumId: album.id, items, bytes: ready.reduce((sum, u) => sum + u.after, 0) })
    toast(`${plural(items.length, 'photo publiée', 'photos publiées')} dans « ${album.title} »`)
    setDone(album.id)
    setUploads([])
  }

  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Ajouter des photos</h2>
        <p className="muted">
          Choisissez un album, puis des photos depuis votre téléphone ou votre ordinateur. Elles sont réduites automatiquement avant
          l’envoi pour rester légères sur les connexions mobiles.
        </p>
      </div>
      <div className="field">
        <label htmlFor="photos-album">Album</label>
        <select id="photos-album" className="select" value={albumId} onChange={(e) => setAlbumId(e.target.value)}>
          {state.albums.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
      </div>
      <div
        className={`dropzone${over ? ' is-over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          addFiles(e.dataTransfer.files)
        }}
      >
        <Upload aria-hidden="true" />
        <p>
          <strong>Glissez vos photos ici</strong> ou
        </p>
        <button type="button" className="btn" onClick={() => inputRef.current?.click()}>
          <ImagePlus aria-hidden="true" /> Choisir des photos
        </button>
        <input
          ref={inputRef}
          id="photos-fichiers"
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <p className="small muted">Simulation : les photos restent sur votre appareil et disparaissent au rechargement de la page.</p>
      </div>

      {busy && (
        <p className="notice" role="status">
          <Clock aria-hidden="true" /> Réduction des photos en cours…
        </p>
      )}

      {uploads.length > 0 && (
        <>
          <ul className="uploads">
            {uploads.map((u) => (
              <li key={u.id}>
                {u.url ? (
                  <img src={u.url} alt="" />
                ) : (
                  <span className="upload-missing">
                    <ImageOff aria-hidden="true" />
                  </span>
                )}
                <div className="field">
                  <label htmlFor={`legende-${u.id}`} className="sr-only">
                    Légende de {u.name}
                  </label>
                  <input
                    id={`legende-${u.id}`}
                    className="input"
                    placeholder="Légende, par exemple : Recueillement de la famille"
                    value={u.caption}
                    disabled={!u.url}
                    onChange={(e) =>
                      setUploads((list) => list.map((x) => (x.id === u.id ? { ...x, caption: e.target.value } : x)))
                    }
                  />
                  <span className="size">
                    {u.name} · {u.url ? `${fileSize(u.before)} → ${fileSize(u.after)}` : 'format non lu par ce navigateur'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="form-actions">
            <button type="button" className="btn btn--primary" onClick={publish} disabled={!ready.length}>
              <Upload aria-hidden="true" /> Publier {plural(ready.length, 'photo', 'photos')}
            </button>
            <button type="button" className="btn btn--quiet" onClick={() => setUploads([])}>
              Annuler
            </button>
          </div>
        </>
      )}

      {done && (
        <p className="notice notice--ok" role="status">
          <CircleCheck aria-hidden="true" />
          <span>
            Photos publiées. <Link to={`/album/${done}`}>Voir l’album</Link>
          </span>
        </p>
      )}
    </div>
  )
}

function SpacesPanel() {
  const { state, dispatch } = useStore()
  const { navigate } = useRouter()
  const toast = useToast()
  const [form, , bind] = useForm({ name: '', dates: '', texte: '', video: '', proteger: true, code: DEMO_CODE })
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    const name = form.name.trim().replace(/\s+/g, ' ')
    if (name.length < 3) {
      setError('Indiquez le nom complet du camarade.')
      return
    }
    const base = slugify(name)
    let slug = base
    for (let n = 2; state.memorials.some((m) => m.slug === slug); n++) slug = `${base}-${n}`
    const firstName = name.split(' ')[0]
    const memorial = {
      slug,
      name,
      firstName,
      monogram: initials(name),
      seed: `${slug}-couverture`,
      dates: form.dates.trim() || 'Dates à compléter avec la famille',
      accroche: `Cet espace rassemble les messages, les photos et les souvenirs du 12G2 en hommage à ${firstName}.`,
      bio: form.texte.trim() ? [form.texte.trim()] : [],
      bioNote: 'Biographie à compléter avec la famille.',
      programme: defaultProgramme(),
      video: form.video.trim() ? { title: `Hommage du 12G2 à ${firstName}`, url: form.video.trim() } : null,
    }
    const albums = [
      {
        id: `obseques-${slug}`,
        title: `Obsèques de ${name}`,
        category: 'hommages',
        year: null,
        period: 'Espace mémoire',
        memorial: slug,
        protected: form.proteger ? { code: form.code.trim() || DEMO_CODE } : null,
        description: 'Photos des obsèques, publiées par les administrateurs.',
        items: [],
      },
    ]
    dispatch({ type: 'memorial/create', memorial, albums })
    toast(`Espace de ${name} créé. Son onglet est ajouté au menu In memoriam.`)
    navigate(`/memoire/${slug}`)
  }

  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Espaces mémoire</h2>
        <p className="muted">Chaque espace a son onglet, son livre de condoléances, ses albums et sa vidéo.</p>
      </div>
      <ul className="rows">
        {state.memorials.map((m) => {
          const count = state.messages.filter((x) => x.memorial === m.slug && x.status === 'publié').length
          return (
            <li key={m.slug}>
              <div className="rows__main">
                <span className="rows__title">{m.name}</span>
                <span className="rows__sub">
                  {plural(count, 'message publié', 'messages publiés')} · {m.dates}
                </span>
              </div>
              <Link className="btn btn--sm" to={`/memoire/${m.slug}`}>
                Ouvrir
              </Link>
            </li>
          )
        })}
      </ul>
      <hr className="divider" />
      <form className="form" onSubmit={submit} noValidate>
        <div className="panel__head">
          <h3 className="form-title">Créer un nouvel espace</h3>
          <p className="small muted">
            Sans intervention du développeur : l’onglet apparaît aussitôt dans le menu In memoriam, avec un livre de condoléances et un
            album des obsèques.
          </p>
        </div>
        <div className="form-row form-row--2">
          <div className="field">
            <label htmlFor="espace-nom">Nom complet</label>
            <input id="espace-nom" className="input" value={form.name} onChange={bind('name')} aria-invalid={Boolean(error)} />
            {error && (
              <span className="field__error" role="alert">
                {error}
              </span>
            )}
          </div>
          <div className="field">
            <label htmlFor="espace-dates">Dates (facultatif)</label>
            <input id="espace-dates" className="input" value={form.dates} onChange={bind('dates')} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="espace-texte">Texte d’hommage (facultatif)</label>
          <textarea id="espace-texte" className="textarea" value={form.texte} onChange={bind('texte')} />
        </div>
        <div className="field">
          <label htmlFor="espace-video">Lien de la vidéo YouTube (facultatif)</label>
          <input
            id="espace-video"
            className="input"
            type="url"
            placeholder="https://youtu.be/…"
            value={form.video}
            onChange={bind('video')}
          />
          <span className="field__hint">Une vidéo par espace, publiée sur YouTube en mode non répertorié.</span>
        </div>
        <label className="check" htmlFor="espace-proteger">
          <input id="espace-proteger" type="checkbox" checked={form.proteger} onChange={bind('proteger')} />
          Protéger l’album des obsèques par un code
        </label>
        {form.proteger && (
          <div className="field">
            <label htmlFor="espace-code">Code d’accès</label>
            <input id="espace-code" className="input" value={form.code} onChange={bind('code')} autoComplete="off" />
          </div>
        )}
        <div className="form-actions">
          <button type="submit" className="btn btn--primary">
            <Plus aria-hidden="true" /> Créer l’espace
          </button>
        </div>
      </form>
    </div>
  )
}

function AlbumsPanel() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const [form, setForm, bind] = useForm({
    title: '',
    category: 'retrouvailles',
    year: String(new Date().getFullYear()),
    proteger: false,
    code: DEMO_CODE,
  })
  const [error, setError] = useState('')
  const [created, setCreated] = useState(null)

  const submit = (event) => {
    event.preventDefault()
    const title = form.title.trim()
    if (title.length < 3) {
      setError('Donnez un titre à l’album.')
      return
    }
    const year = Number.parseInt(form.year, 10)
    const id = newId('album')
    dispatch({
      type: 'album/create',
      album: {
        id,
        title,
        category: form.category,
        year: Number.isFinite(year) ? year : null,
        period: Number.isFinite(year) ? undefined : 'Sans date',
        protected: form.proteger ? { code: form.code.trim() || DEMO_CODE } : null,
        items: [],
      },
    })
    toast(`Album « ${title} » créé`)
    setCreated(id)
    setError('')
    setForm((f) => ({ ...f, title: '' }))
  }

  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Albums</h2>
        <p className="muted">{plural(state.albums.length, 'album classé', 'albums classés')} par catégorie et par année.</p>
      </div>
      <ul className="rows">
        {state.albums.map((a) => (
          <li key={a.id}>
            <div className="rows__main">
              <span className="rows__title">{a.title}</span>
              <span className="rows__sub">
                {categoryLabel(a.category)} · {a.year ?? a.period ?? 'Sans date'} · {plural(a.items.length, 'photo', 'photos')}
                {a.protected ? ' · accès par code' : ''}
              </span>
            </div>
            <Link className="btn btn--sm" to={`/album/${a.id}`}>
              Ouvrir
            </Link>
          </li>
        ))}
      </ul>
      <hr className="divider" />
      <form className="form" onSubmit={submit} noValidate>
        <h3 className="form-title">Créer un album</h3>
        <div className="form-row form-row--2">
          <div className="field">
            <label htmlFor="album-titre">Titre</label>
            <input id="album-titre" className="input" value={form.title} onChange={bind('title')} aria-invalid={Boolean(error)} />
            {error && (
              <span className="field__error" role="alert">
                {error}
              </span>
            )}
          </div>
          <div className="field">
            <label htmlFor="album-categorie">Catégorie</label>
            <select id="album-categorie" className="select" value={form.category} onChange={bind('category')}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row form-row--2">
          <div className="field">
            <label htmlFor="album-annee">Année</label>
            <input id="album-annee" className="input" inputMode="numeric" value={form.year} onChange={bind('year')} />
            <span className="field__hint">Laissez vide pour des archives sans date.</span>
          </div>
          <div className="field">
            <span className="field__label">Accès</span>
            <label className="check" htmlFor="album-proteger">
              <input id="album-proteger" type="checkbox" checked={form.proteger} onChange={bind('proteger')} />
              Protéger par un code
            </label>
          </div>
        </div>
        {form.proteger && (
          <div className="field">
            <label htmlFor="album-code">Code d’accès</label>
            <input id="album-code" className="input" value={form.code} onChange={bind('code')} autoComplete="off" />
          </div>
        )}
        <div className="form-actions">
          <button type="submit" className="btn btn--primary">
            <FolderPlus aria-hidden="true" /> Créer l’album
          </button>
          {created && (
            <Link className="text-link" to={`/album/${created}`}>
              Ouvrir le nouvel album <ArrowRight aria-hidden="true" />
            </Link>
          )}
        </div>
      </form>
    </div>
  )
}

function TeamPanel() {
  const { state } = useStore()
  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Administrateurs</h2>
        <p className="muted">
          L’offre 01 comprend trois comptes personnels. Chacun se connecte avec son adresse email et un code à usage unique : aucun
          mot de passe n’est partagé.
        </p>
      </div>
      <ul className="rows">
        {SITE.admins.map((a) => (
          <li key={a.email}>
            <div className="rows__main">
              <span className="rows__title">{a.nom}</span>
              <span className="rows__sub">
                {a.role} · {a.email}
              </span>
            </div>
            {state.admin?.nom === a.nom ? <span className="chip chip--ok">Connecté</span> : <span className="chip">Actif</span>}
          </li>
        ))}
      </ul>
      <p className="notice">
        <KeyRound aria-hidden="true" />
        <span>
          Le nom de domaine, l’hébergement et le code source sont enregistrés au nom de l’association. Deux membres du bureau gardent
          les accès principaux : la plateforme continue de fonctionner même quand un administrateur change.
        </span>
      </p>
    </div>
  )
}

function AdminDashboard() {
  const { state, dispatch } = useStore()
  const [tab, setTab] = useState('valider')
  const pending = state.messages.filter((m) => m.status === 'en attente')
  const photoCount = state.albums.reduce((sum, a) => sum + a.items.length, 0)
  const usage = Math.min(100, (state.storageUsed / SITE.stockageTotal) * 100)

  return (
    <section className="section">
      <div className="wrap admin">
        <div className="admin-top">
          <div>
            <p className="eyebrow">Espace de gestion · {state.admin.role}</p>
            <h1>Bonjour, {state.admin.nom}</h1>
          </div>
          <button type="button" className="btn" onClick={() => dispatch({ type: 'admin/logout' })}>
            <LogOut aria-hidden="true" /> Se déconnecter
          </button>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="stat__value">{pending.length}</span>
            <span className="stat__label">messages à valider</span>
          </div>
          <div className="stat">
            <span className="stat__value">{photoCount}</span>
            <span className="stat__label">photos publiées</span>
          </div>
          <div className="stat">
            <span className="stat__value">{state.memorials.length}</span>
            <span className="stat__label">espaces mémoire</span>
          </div>
          <div className="stat">
            <span className="stat__value">{fileSize(state.storageUsed)}</span>
            <span className="stat__label">utilisés sur {fileSize(SITE.stockageTotal)}</span>
            <span className="meter" aria-hidden="true">
              <span style={{ width: `${usage}%` }} />
            </span>
          </div>
        </div>

        <div className="admin-layout">
          <nav className="admin-nav" aria-label="Rubriques de gestion">
            {TABS.map((t) => (
              <button key={t.id} type="button" aria-current={tab === t.id} onClick={() => setTab(t.id)}>
                <t.icon aria-hidden="true" /> {t.label}
                {t.id === 'valider' && pending.length > 0 && <span className="count">{pending.length}</span>}
              </button>
            ))}
          </nav>
          <div>
            {tab === 'valider' && <PendingPanel pending={pending} />}
            {tab === 'photos' && <PhotosPanel />}
            {tab === 'espaces' && <SpacesPanel />}
            {tab === 'albums' && <AlbumsPanel />}
            {tab === 'equipe' && <TeamPanel />}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AdminPage() {
  const { state } = useStore()
  return state.admin ? <AdminDashboard /> : <AdminLogin />
}
