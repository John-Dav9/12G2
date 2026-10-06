import { useRef, useState } from 'react'
import {
  ArrowRight,
  CalendarPlus,
  Check,
  CircleCheck,
  Clock,
  DatabaseBackup,
  Flame,
  FolderPlus,
  ImageOff,
  ImagePlus,
  Inbox,
  KeyRound,
  Link as LinkIcon,
  LogOut,
  Mail,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  UserPlus,
} from 'lucide-react'
import { useToast } from '../components/Toast.jsx'
import { CATEGORIES, VISIBILITY, categoryLabel } from '../data/albums.js'
import { contributionLabel } from '../data/contributions.js'
import { defaultInfos, defaultProgramme } from '../data/memorials.js'
import { POST_TYPES } from '../data/posts.js'
import { SITE } from '../data/site.js'
import { fileSize, initials, num, plural, relDate, slugify } from '../lib/format.js'
import { compressImage } from '../lib/images.js'
import { Link, useRouter } from '../lib/router.jsx'
import { newId, useStore } from '../lib/store.jsx'

const LOGIN_CODE = '482913'

const TABS = [
  { id: 'valider', label: 'À valider', icon: Inbox },
  { id: 'inscriptions', label: 'Inscriptions', icon: UserPlus },
  { id: 'photos', label: 'Ajouter des photos', icon: ImagePlus },
  { id: 'espaces', label: 'Espaces mémoire', icon: Flame },
  { id: 'albums', label: 'Albums', icon: FolderPlus },
  { id: 'evenements', label: 'Actualités', icon: CalendarPlus },
  { id: 'sauvegardes', label: 'Sauvegardes', icon: DatabaseBackup },
  { id: 'equipe', label: 'Administrateurs', icon: ShieldCheck },
]

function useForm(initial) {
  const [form, setForm] = useState(initial)
  const bind = (key) => (event) =>
    setForm((f) => ({ ...f, [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }))
  return [form, setForm, bind]
}

function VisibilitySelect({ id, value, onChange, label = 'Visibilité' }) {
  return (
    <label className="inline-select" htmlFor={id}>
      <span className="sr-only">{label}</span>
      <select id={id} className="select select--sm" value={value} onChange={(e) => onChange(e.target.value)}>
        {Object.entries(VISIBILITY).map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
    </label>
  )
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
            Cinq administrateurs, chacun avec son propre accès et des droits adaptés. Un code à usage unique arrive par email : aucun
            mot de passe n’est partagé.
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

function ValidatePanel({ pendingMessages, pendingContributions }) {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const memorialName = (slug) => state.memorials.find((m) => m.slug === slug)?.name ?? slug
  const albumTitle = (id) => state.albums.find((a) => a.id === id)?.title ?? id
  const targetName = (c) => (c.target.kind === 'memorial' ? memorialName(c.target.id) : albumTitle(c.target.id))

  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Contenus à valider</h2>
        <p className="muted">Rien n’est publié sans l’accord d’un administrateur. Un contenu refusé n’apparaît pas sur la plateforme.</p>
      </div>

      <h3 className="form-title">Contributions des membres</h3>
      {pendingContributions.length ? (
        <ul className="queue">
          {pendingContributions.map((c) => (
            <li key={c.id}>
              <p className="queue__meta">
                <span className="chip chip--encre">{contributionLabel(c.type)}</span>
                <span>
                  {c.author} · pour « {targetName(c)} » · {relDate(c.date)}
                </span>
                {c.example && <span className="chip">Exemple</span>}
              </p>
              {c.text && <p className="queue__text">« {c.text} »</p>}
              {c.type === 'photos' && (
                <p className="queue__text">
                  {plural(c.count ?? c.items?.length ?? 1, 'photo proposée', 'photos proposées')}
                  {c.items?.some((i) => i.src) && (
                    <span className="thumbs thumbs--inline">
                      {c.items.slice(0, 6).map((i) => (
                        <img key={i.id} src={i.src} alt="" />
                      ))}
                    </span>
                  )}
                </p>
              )}
              {c.type === 'video' && (
                <p className="queue__text">
                  Vidéo « {c.caption} » · {c.size ? fileSize(c.size) : ''}
                  {c.duration ? ` · ${c.duration}` : ''}
                </p>
              )}
              <div className="queue__actions">
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => {
                    dispatch({ type: 'contribution/approve', id: c.id })
                    toast(`Publié dans « ${targetName(c)} »`)
                  }}
                >
                  <Check aria-hidden="true" /> Publier
                </button>
                <button
                  type="button"
                  className="btn btn--sm btn--danger"
                  onClick={() => {
                    dispatch({ type: 'contribution/reject', id: c.id })
                    toast('Contribution refusée')
                  }}
                >
                  <Trash2 aria-hidden="true" /> Refuser
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">Aucune contribution en attente. Proposez-en une depuis « Mon espace » pour voir le parcours.</p>
      )}

      <hr className="divider" />

      <h3 className="form-title">Messages de condoléances</h3>
      {pendingMessages.length ? (
        <ul className="queue">
          {pendingMessages.map((m) => (
            <li key={m.id}>
              <p className="queue__meta">
                <span className="chip chip--bougie">{memorialName(m.memorial)}</span>
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
                    toast(`Message publié dans l’espace de ${memorialName(m.memorial)}`)
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
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">Aucun message en attente.</p>
      )}
    </div>
  )
}

function SignupsPanel() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const link = `${SITE.url}/invitation/12G2-2026`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      toast('Lien d’invitation copié')
    } catch {
      toast(link)
    }
  }

  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Inscriptions</h2>
        <p className="muted">
          Les camarades s’inscrivent avec le lien d’invitation. Vous validez chaque inscription avant l’accès aux contenus réservés.
        </p>
      </div>
      <div className="invite">
        <code>{link}</code>
        <button type="button" className="btn btn--sm" onClick={copy}>
          <LinkIcon aria-hidden="true" /> Copier le lien
        </button>
      </div>
      {state.signups.length ? (
        <ul className="queue">
          {state.signups.map((s) => (
            <li key={s.id}>
              <p className="queue__meta">
                <strong>{s.nom}</strong>
                <span>
                  {s.email} · {relDate(s.date)}
                </span>
                {s.example && <span className="chip">Exemple</span>}
              </p>
              <p className="queue__text">« {s.message} »</p>
              <div className="queue__actions">
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => {
                    dispatch({ type: 'signup/approve', id: s.id })
                    toast(`${s.nom} rejoint l’annuaire du 12G2`)
                  }}
                >
                  <Check aria-hidden="true" /> Accepter
                </button>
                <button
                  type="button"
                  className="btn btn--sm btn--danger"
                  onClick={() => {
                    dispatch({ type: 'signup/reject', id: s.id })
                    toast('Inscription refusée')
                  }}
                >
                  <Trash2 aria-hidden="true" /> Refuser
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">Aucune inscription en attente.</p>
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
    const items = ready.map((u) => ({ id: u.id, kind: 'photo', caption: u.caption.trim() || `Photo ajoutée par ${state.admin.nom}`, src: u.url }))
    dispatch({ type: 'album/addItems', albumId: album.id, items, bytes: ready.reduce((sum, u) => sum + u.after, 0) })
    toast(`${plural(items.length, 'photo publiée', 'photos publiées')} dans « ${album.title} »`)
    setDone(album.id)
    setUploads([])
  }

  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Ajouter des photos</h2>
        <p className="muted">Les administrateurs publient directement, sans passer par la validation. Les photos sont réduites avant l’envoi.</p>
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
      <div className="dropzone">
        <Upload aria-hidden="true" />
        <button type="button" className="btn" onClick={() => inputRef.current?.click()}>
          <ImagePlus aria-hidden="true" /> Choisir des photos
        </button>
        <input
          ref={inputRef}
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
                    placeholder="Légende de la photo"
                    value={u.caption}
                    disabled={!u.url}
                    onChange={(e) => setUploads((list) => list.map((x) => (x.id === u.id ? { ...x, caption: e.target.value } : x)))}
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
  const [form, , bind] = useForm({ name: '', dates: '', texte: '', visibility: 'public', albumVisibility: 'membres' })
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
      dates: form.dates.trim() || 'Dates communiquées par la famille',
      visibility: form.visibility,
      accroche: `Cet espace rassemble les messages, les photos, les vidéos et les souvenirs du 12G2 en hommage à ${firstName}.`,
      bio: form.texte.trim() ? [form.texte.trim()] : [],
      bioNote: 'Biographie à compléter avec la famille.',
      programme: defaultProgramme(),
      infos: defaultInfos(),
      candles: 0,
      rappel: `À la date anniversaire, les membres reçoivent un rappel pour se souvenir de ${firstName} ensemble.`,
    }
    const albums = [
      {
        id: `obseques-${slug}`,
        title: `Obsèques de ${name}`,
        category: 'hommages',
        year: null,
        period: 'Espace mémoire',
        memorial: slug,
        visibility: form.albumVisibility,
        description: 'Photos et vidéos des obsèques.',
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
        <p className="muted">Chaque espace peut être public ou réservé aux membres, selon le souhait de la famille.</p>
      </div>
      <ul className="rows">
        {state.memorials.map((m) => (
          <li key={m.slug}>
            <div className="rows__main">
              <span className="rows__title">{m.name}</span>
              <span className="rows__sub">
                {num(m.candles)} bougies · {plural(state.anecdotes.filter((a) => a.memorial === m.slug).length, 'anecdote', 'anecdotes')}
              </span>
            </div>
            <div className="rows__actions">
              <VisibilitySelect
                id={`vis-${m.slug}`}
                label={`Visibilité de l’espace de ${m.name}`}
                value={m.visibility}
                onChange={(visibility) => {
                  dispatch({ type: 'memorial/visibility', slug: m.slug, visibility })
                  toast(`Espace de ${m.name} : ${VISIBILITY[visibility].toLowerCase()}`)
                }}
              />
              <Link className="btn btn--sm" to={`/memoire/${m.slug}`}>
                Ouvrir
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <hr className="divider" />
      <form className="form" onSubmit={submit} noValidate>
        <div className="panel__head">
          <h3 className="form-title">Créer un nouvel espace</h3>
          <p className="small muted">Sans intervention du développeur : l’onglet apparaît aussitôt dans le menu In memoriam.</p>
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
        <div className="form-row form-row--2">
          <div className="field">
            <label htmlFor="espace-visibilite">Visibilité de l’espace</label>
            <select id="espace-visibilite" className="select" value={form.visibility} onChange={bind('visibility')}>
              {Object.entries(VISIBILITY).map(([key, text]) => (
                <option key={key} value={key}>
                  {text}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="espace-album-visibilite">Album des obsèques</label>
            <select id="espace-album-visibilite" className="select" value={form.albumVisibility} onChange={bind('albumVisibility')}>
              {Object.entries(VISIBILITY).map(([key, text]) => (
                <option key={key} value={key}>
                  {text}
                </option>
              ))}
            </select>
          </div>
        </div>
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
  const [form, setForm, bind] = useForm({ title: '', category: 'retrouvailles', year: String(new Date().getFullYear()), visibility: 'public' })
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
        visibility: form.visibility,
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
        <p className="muted">Nombre d’albums illimité. Réglez la visibilité de chacun en un clic.</p>
      </div>
      <ul className="rows">
        {state.albums.map((a) => (
          <li key={a.id}>
            <div className="rows__main">
              <span className="rows__title">{a.title}</span>
              <span className="rows__sub">
                {categoryLabel(a.category)} · {a.year ?? a.period ?? 'Sans date'} · {plural(a.items.length, 'élément', 'éléments')}
              </span>
            </div>
            <div className="rows__actions">
              <VisibilitySelect
                id={`vis-${a.id}`}
                label={`Visibilité de l’album ${a.title}`}
                value={a.visibility}
                onChange={(visibility) => {
                  dispatch({ type: 'album/visibility', id: a.id, visibility })
                  toast(`« ${a.title} » : ${VISIBILITY[visibility].toLowerCase()}`)
                }}
              />
              <Link className="btn btn--sm" to={`/album/${a.id}`}>
                Ouvrir
              </Link>
            </div>
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
          </div>
          <div className="field">
            <label htmlFor="album-visibilite">Visibilité</label>
            <select id="album-visibilite" className="select" value={form.visibility} onChange={bind('visibility')}>
              {Object.entries(VISIBILITY).map(([key, text]) => (
                <option key={key} value={key}>
                  {text}
                </option>
              ))}
            </select>
          </div>
        </div>
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

function EventsPanel() {
  const { dispatch } = useStore()
  const toast = useToast()
  const [form, setForm, bind] = useForm({ type: 'rencontre', title: '', date: '', heure: '15:00', lieu: '', text: '', visibility: 'membres' })
  const [error, setError] = useState('')
  const [published, setPublished] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    if (form.title.trim().length < 3) {
      setError('Donnez un titre à la publication.')
      return
    }
    if (form.type === 'rencontre' && !form.date) {
      setError('Indiquez la date de la rencontre.')
      return
    }
    const date = form.type === 'rencontre' ? new Date(`${form.date}T${form.heure || '15:00'}`).toISOString() : new Date().toISOString()
    dispatch({
      type: 'post/create',
      post: {
        id: newId('post'),
        type: form.type,
        title: form.title.trim(),
        date,
        lieu: form.type === 'rencontre' ? form.lieu.trim() || 'Lieu à confirmer' : undefined,
        text: form.text.trim(),
        rsvp: form.type === 'rencontre' ? 0 : undefined,
        reactions: form.type === 'joie' ? 0 : undefined,
        visibility: form.visibility,
      },
    })
    toast('Publication ajoutée aux actualités')
    setPublished(true)
    setError('')
    setForm((f) => ({ ...f, title: '', text: '' }))
  }

  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Actualités et événements</h2>
        <p className="muted">Annoncez une rencontre, publiez un compte rendu, un moment de solidarité ou un heureux événement.</p>
      </div>
      <form className="form" onSubmit={submit} noValidate>
        <div className="form-row form-row--2">
          <div className="field">
            <label htmlFor="post-type">Type</label>
            <select id="post-type" className="select" value={form.type} onChange={bind('type')}>
              {POST_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="post-visibilite">Visibilité</label>
            <select id="post-visibilite" className="select" value={form.visibility} onChange={bind('visibility')}>
              {Object.entries(VISIBILITY).map(([key, text]) => (
                <option key={key} value={key}>
                  {text}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="post-titre">Titre</label>
          <input id="post-titre" className="input" value={form.title} onChange={bind('title')} aria-invalid={Boolean(error)} />
        </div>
        {form.type === 'rencontre' && (
          <div className="form-row form-row--3">
            <div className="field">
              <label htmlFor="post-date">Date</label>
              <input id="post-date" className="input" type="date" value={form.date} onChange={bind('date')} />
            </div>
            <div className="field">
              <label htmlFor="post-heure">Heure</label>
              <input id="post-heure" className="input" type="time" value={form.heure} onChange={bind('heure')} />
            </div>
            <div className="field">
              <label htmlFor="post-lieu">Lieu</label>
              <input id="post-lieu" className="input" value={form.lieu} onChange={bind('lieu')} />
            </div>
          </div>
        )}
        <div className="field">
          <label htmlFor="post-texte">Texte</label>
          <textarea id="post-texte" className="textarea" value={form.text} onChange={bind('text')} />
        </div>
        {error && (
          <p className="field__error" role="alert">
            {error}
          </p>
        )}
        <div className="form-actions">
          <button type="submit" className="btn btn--primary">
            <CalendarPlus aria-hidden="true" /> Publier
          </button>
          {published && (
            <Link className="text-link" to="/actualites">
              Voir les actualités <ArrowRight aria-hidden="true" />
            </Link>
          )}
        </div>
      </form>
    </div>
  )
}

function BackupsPanel() {
  const { state } = useStore()
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    d.setHours(3, 0, 0, 0)
    return d
  })
  const format = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const photoUsage = Math.min(100, (state.storageUsed / SITE.stockageTotal) * 100)
  const videoUsage = Math.min(100, (state.videoMinutesUsed / SITE.videoMinutesTotal) * 100)

  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Sauvegardes et capacité</h2>
        <p className="muted">Une sauvegarde complète chaque nuit à 3 h, gardée 30 jours. Les fichiers supprimés restent récupérables pendant 30 jours.</p>
      </div>
      <div className="stats">
        <div className="stat">
          <span className="stat__value">{fileSize(state.storageUsed)}</span>
          <span className="stat__label">de photos sur {fileSize(SITE.stockageTotal)}</span>
          <span className="meter" aria-hidden="true">
            <span style={{ width: `${photoUsage}%` }} />
          </span>
        </div>
        <div className="stat">
          <span className="stat__value">{num(Math.round(state.videoMinutesUsed))} min</span>
          <span className="stat__label">de vidéo sur {num(SITE.videoMinutesTotal)} min</span>
          <span className="meter" aria-hidden="true">
            <span style={{ width: `${videoUsage}%` }} />
          </span>
        </div>
      </div>
      <ul className="rows">
        {days.map((d, i) => (
          <li key={d.toISOString()}>
            <div className="rows__main">
              <span className="rows__title">Sauvegarde automatique · {format.format(d)}</span>
              <span className="rows__sub">Base de données, textes et liste des fichiers · 3 h 00</span>
            </div>
            <span className="chip chip--ok">
              <CircleCheck aria-hidden="true" /> {i === 0 ? 'Dernière' : 'Réussie'}
            </span>
          </li>
        ))}
      </ul>
      <p className="small muted">23 sauvegardes plus anciennes sont aussi conservées. La restauration se fait par l’administration principale.</p>
    </div>
  )
}

function TeamPanel() {
  const { state } = useStore()
  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Administrateurs</h2>
        <p className="muted">Cinq comptes personnels, chacun avec les droits de son rôle. Aucun mot de passe n’est partagé.</p>
      </div>
      <ul className="rows">
        {SITE.admins.map((a) => (
          <li key={a.email}>
            <div className="rows__main">
              <span className="rows__title">
                {a.nom} · {a.role}
              </span>
              <span className="rows__sub">
                {a.droits} · {a.email}
              </span>
            </div>
            {state.admin?.nom === a.nom ? <span className="chip chip--ok">Connecté</span> : <span className="chip">Actif</span>}
          </li>
        ))}
      </ul>
      <p className="notice">
        <KeyRound aria-hidden="true" />
        <span>
          Le nom de domaine, l’hébergement et le code source sont enregistrés au nom de l’association ou de son représentant désigné.
          Les accès et la documentation sont remis au 12G2.
        </span>
      </p>
    </div>
  )
}

function AdminDashboard() {
  const { state, dispatch } = useStore()
  const [tab, setTab] = useState('valider')
  const pendingMessages = state.messages.filter((m) => m.status === 'en attente')
  const pendingContributions = state.contributions.filter((c) => c.status === 'en attente')
  const toValidate = pendingMessages.length + pendingContributions.length
  const items = state.albums.flatMap((a) => a.items)
  const counts = { valider: toValidate, inscriptions: state.signups.length }

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
            <span className="stat__value">{toValidate}</span>
            <span className="stat__label">contenus à valider</span>
          </div>
          <div className="stat">
            <span className="stat__value">{state.members.length + 1}</span>
            <span className="stat__label">membres inscrits</span>
          </div>
          <div className="stat">
            <span className="stat__value">{items.length}</span>
            <span className="stat__label">photos et vidéos</span>
          </div>
          <div className="stat">
            <span className="stat__value">{state.memorials.length}</span>
            <span className="stat__label">espaces mémoire</span>
          </div>
        </div>

        <div className="admin-layout">
          <nav className="admin-nav" aria-label="Rubriques de gestion">
            {TABS.map((t) => (
              <button key={t.id} type="button" aria-current={tab === t.id} onClick={() => setTab(t.id)}>
                <t.icon aria-hidden="true" /> {t.label}
                {counts[t.id] > 0 && <span className="count">{counts[t.id]}</span>}
              </button>
            ))}
          </nav>
          <div>
            {tab === 'valider' && <ValidatePanel pendingMessages={pendingMessages} pendingContributions={pendingContributions} />}
            {tab === 'inscriptions' && <SignupsPanel />}
            {tab === 'photos' && <PhotosPanel />}
            {tab === 'espaces' && <SpacesPanel />}
            {tab === 'albums' && <AlbumsPanel />}
            {tab === 'evenements' && <EventsPanel />}
            {tab === 'sauvegardes' && <BackupsPanel />}
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
