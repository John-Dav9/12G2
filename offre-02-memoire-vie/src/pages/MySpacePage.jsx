import { useEffect, useRef, useState } from 'react'
import { BookOpen, CircleCheck, Film, Heart, ImageOff, ImagePlus, LogIn, LogOut, Send, Upload } from 'lucide-react'
import Photo from '../components/Photo.jsx'
import { useToast } from '../components/Toast.jsx'
import { CONTRIBUTION_TYPES, contributionLabel } from '../data/contributions.js'
import { SITE } from '../data/site.js'
import { fileSize, initials, plural, relDate } from '../lib/format.js'
import { compressImage } from '../lib/images.js'
import { placeholderStyle } from '../lib/placeholder.js'
import { newId, useStore } from '../lib/store.jsx'

const TYPE_ICONS = { hommage: Heart, souvenir: BookOpen, photos: ImagePlus, video: Film }
const STATUS = {
  'en attente': ['chip--warn', 'En attente de validation'],
  publié: ['chip--ok', 'Publié'],
  refusé: ['', 'Non retenu'],
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return ''
  const s = Math.round(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function readDuration(url) {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => resolve(formatDuration(video.duration))
    video.onerror = () => resolve('')
    video.src = url
  })
}

function ContributeForm() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const draft = state.draft
  const [type, setType] = useState(draft?.type ?? 'souvenir')
  const [memorial, setMemorial] = useState(draft?.memorial ?? state.memorials[0]?.slug ?? '')
  const [albumId, setAlbumId] = useState(draft?.albumId ?? state.albums[0]?.id ?? '')
  const [text, setText] = useState('')
  const [caption, setCaption] = useState('')
  const [files, setFiles] = useState([])
  const [video, setVideo] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const photoInput = useRef(null)
  const videoInput = useRef(null)
  const maxBytes = SITE.videoMaxMo * 1024 * 1024

  useEffect(() => {
    if (draft) dispatch({ type: 'contribution/draft', draft: null })
  }, [draft, dispatch])

  const needsText = type === 'hommage' || type === 'souvenir'

  const pickPhotos = async (fileList) => {
    const picked = Array.from(fileList || [])
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, type === 'souvenir' ? 1 : 20)
    if (!picked.length) return
    setBusy(true)
    const results = []
    for (const file of picked) {
      try {
        const { blob } = await compressImage(file)
        results.push({ id: newId('ph'), name: file.name, before: file.size, after: blob.size, url: URL.createObjectURL(blob) })
      } catch {
        results.push({ id: newId('ph'), name: file.name, before: file.size, after: 0, url: null })
      }
    }
    setFiles((list) => (type === 'souvenir' ? results : [...list, ...results]))
    setBusy(false)
  }

  const pickVideo = async (file) => {
    setError('')
    if (!file) return
    if (file.size > maxBytes) {
      setVideo(null)
      setError(
        `Cette vidéo pèse ${fileSize(file.size)}. La limite est de ${SITE.videoMaxMo} Mo par fichier : raccourcissez-la, ou publiez-la sur YouTube puis envoyez le lien à un administrateur.`,
      )
      return
    }
    const url = URL.createObjectURL(file)
    const duration = await readDuration(url)
    setVideo({ name: file.name, size: file.size, url, duration })
  }

  const reset = () => {
    setText('')
    setCaption('')
    setFiles([])
    setVideo(null)
    setError('')
  }

  const submit = (event) => {
    event.preventDefault()
    setError('')
    const ready = files.filter((f) => f.url)
    if (needsText && text.trim().length < 5) {
      setError('Écrivez votre texte (quelques mots au moins).')
      return
    }
    if (type === 'photos' && !ready.length) {
      setError('Choisissez au moins une photo.')
      return
    }
    if (type === 'video' && !video) {
      setError('Choisissez une vidéo de 200 Mo au maximum.')
      return
    }
    const id = newId('contrib')
    const author = state.member.nom
    const base = { id, type, author, mine: true, date: new Date().toISOString(), status: 'en attente' }
    let contribution
    if (type === 'hommage' || type === 'souvenir') {
      contribution = {
        ...base,
        target: { kind: 'memorial', id: memorial },
        text: text.trim(),
        items: ready.map((f) => ({ id: f.id, kind: 'photo', caption: `Photo de ${author}`, src: f.url })),
      }
    } else if (type === 'photos') {
      contribution = {
        ...base,
        target: { kind: 'album', id: albumId },
        count: ready.length,
        items: ready.map((f) => ({ id: f.id, kind: 'photo', caption: caption.trim() || `Photo proposée par ${author}`, src: f.url })),
      }
    } else {
      contribution = {
        ...base,
        target: { kind: 'album', id: albumId },
        caption: caption.trim() || `Vidéo proposée par ${author}`,
        size: video.size,
        duration: video.duration,
        items: [{ id: `${id}-v`, kind: 'video', caption: caption.trim() || `Vidéo proposée par ${author}`, duration: video.duration, src: video.url }],
      }
    }
    dispatch({ type: 'contribution/add', contribution })
    toast('Merci. Votre contribution sera publiée après validation.')
    reset()
  }

  return (
    <form className="panel form" onSubmit={submit} noValidate id="contribuer">
      <div className="panel__head">
        <h2>Contribuer</h2>
        <p className="muted">Hommage, souvenir, photos ou vidéo : un administrateur valide chaque contribution avant publication.</p>
      </div>

      <fieldset className="type-picker">
        <legend className="field__label">Je propose</legend>
        {CONTRIBUTION_TYPES.map((t) => {
          const Icon = TYPE_ICONS[t.id]
          return (
            <label key={t.id} className={`type-option${type === t.id ? ' is-selected' : ''}`}>
              <input
                type="radio"
                name="type-contribution"
                value={t.id}
                checked={type === t.id}
                onChange={() => {
                  setType(t.id)
                  reset()
                }}
              />
              <Icon aria-hidden="true" />
              <span>{t.label}</span>
            </label>
          )
        })}
      </fieldset>

      {needsText ? (
        <div className="field">
          <label htmlFor="contrib-espace">Pour l’espace de</label>
          <select id="contrib-espace" className="select" value={memorial} onChange={(e) => setMemorial(e.target.value)}>
            {state.memorials.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="field">
          <label htmlFor="contrib-album">Dans l’album</label>
          <select id="contrib-album" className="select" value={albumId} onChange={(e) => setAlbumId(e.target.value)}>
            {state.albums.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {needsText && (
        <div className="field">
          <label htmlFor="contrib-texte">{type === 'hommage' ? 'Votre hommage' : 'Votre souvenir'}</label>
          <textarea id="contrib-texte" className="textarea" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
      )}

      {(type === 'photos' || type === 'souvenir') && (
        <div className="field">
          <span className="field__label">{type === 'souvenir' ? 'Une photo (facultatif)' : 'Vos photos'}</span>
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => photoInput.current?.click()}>
              <ImagePlus aria-hidden="true" /> {type === 'souvenir' ? 'Joindre une photo' : 'Choisir des photos'}
            </button>
            <span className="small muted">Réduites automatiquement pour les téléphones.</span>
          </div>
          <input
            ref={photoInput}
            type="file"
            accept="image/*"
            multiple={type === 'photos'}
            hidden
            onChange={(e) => {
              pickPhotos(e.target.files)
              e.target.value = ''
            }}
          />
          {busy && <p className="small muted">Réduction des photos en cours…</p>}
          {files.length > 0 && (
            <ul className="thumbs">
              {files.map((f) => (
                <li key={f.id}>
                  {f.url ? (
                    <img src={f.url} alt={f.name} />
                  ) : (
                    <span className="upload-missing">
                      <ImageOff aria-hidden="true" />
                    </span>
                  )}
                  <span className="size">{f.url ? `${fileSize(f.before)} → ${fileSize(f.after)}` : 'format non lu'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {type === 'video' && (
        <div className="field">
          <span className="field__label">Votre vidéo</span>
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => videoInput.current?.click()}>
              <Upload aria-hidden="true" /> Choisir une vidéo
            </button>
            <span className="small muted">{SITE.videoMaxMo} Mo maximum par fichier.</span>
          </div>
          <input
            ref={videoInput}
            type="file"
            accept="video/*"
            hidden
            onChange={(e) => {
              pickVideo(e.target.files?.[0])
              e.target.value = ''
            }}
          />
          {video && (
            <div className="video-preview">
              <video src={video.url} controls playsInline preload="metadata" />
              <span className="size">
                {video.name} · {fileSize(video.size)}
                {video.duration ? ` · ${video.duration}` : ''}
              </span>
            </div>
          )}
        </div>
      )}

      {(type === 'photos' || type === 'video') && (
        <div className="field">
          <label htmlFor="contrib-legende">Légende</label>
          <input
            id="contrib-legende"
            className="input"
            placeholder="Par exemple : la délégation du 12G2 à la veillée"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
      )}

      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={busy}>
          <Send aria-hidden="true" /> Envoyer pour validation
        </button>
        <span className="small muted">Simulation : les fichiers restent sur votre appareil.</span>
      </div>
    </form>
  )
}

function MyContributions() {
  const { state } = useStore()
  const mine = state.contributions.filter((c) => c.mine)
  const targetName = (c) =>
    c.target.kind === 'memorial'
      ? state.memorials.find((m) => m.slug === c.target.id)?.name
      : state.albums.find((a) => a.id === c.target.id)?.title

  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Mes contributions</h2>
        <p className="muted">{plural(mine.length, 'contribution', 'contributions')}, avec leur état de validation.</p>
      </div>
      {mine.length ? (
        <ul className="rows">
          {mine.map((c) => {
            const [tone, label] = STATUS[c.status] ?? STATUS['en attente']
            return (
              <li key={c.id}>
                <div className="rows__main">
                  <span className="rows__title">
                    {contributionLabel(c.type)}
                    {c.count ? ` (${c.count})` : ''} · {targetName(c)}
                  </span>
                  <span className="rows__sub">
                    {relDate(c.date)}
                    {c.example ? ' · exemple' : ''}
                  </span>
                </div>
                <span className={`chip ${tone}`}>
                  {c.status === 'publié' && <CircleCheck aria-hidden="true" />}
                  {label}
                </span>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="empty">Vos contributions apparaîtront ici.</p>
      )}
    </div>
  )
}

function Profile() {
  const { state } = useStore()
  const [showPhone, setShowPhone] = useState(false)
  const m = state.member
  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Mon profil</h2>
        <p className="muted">Visible uniquement par les membres connectés.</p>
      </div>
      <div className="then-now">
        <figure>
          <Photo seed="profil-ecole" label="Photo d’école" className="then-now__photo" />
          <figcaption className="caption">Au temps du 12G2</figcaption>
        </figure>
        <figure>
          <Photo seed="profil-aujourdhui" label="Photo actuelle" className="then-now__photo" />
          <figcaption className="caption">Aujourd’hui</figcaption>
        </figure>
      </div>
      <dl className="infos">
        <div>
          <dt>Nom</dt>
          <dd>{m.nom}</dd>
        </div>
        <div>
          <dt>Ville</dt>
          <dd>{m.ville}</dd>
        </div>
        <div>
          <dt>Métier</dt>
          <dd>{m.metier}</dd>
        </div>
      </dl>
      <label className="check" htmlFor="profil-telephone">
        <input id="profil-telephone" type="checkbox" checked={showPhone} onChange={(e) => setShowPhone(e.target.checked)} />
        Afficher mon numéro de téléphone aux membres
      </label>
    </div>
  )
}

export default function MySpacePage() {
  const { state, dispatch } = useStore()

  if (!state.member) {
    return (
      <section className="section">
        <div className="wrap">
          <div className="auth">
            <div>
              <p className="eyebrow">Espace membre</p>
              <h1>Votre espace dans le 12G2</h1>
            </div>
            <p className="muted">
              Proposez des photos et des vidéos, racontez un souvenir, rendez hommage et suivez la validation de vos contributions.
            </p>
            <div className="form-actions">
              <button type="button" className="btn btn--primary" onClick={() => dispatch({ type: 'login/open' })}>
                <LogIn aria-hidden="true" /> Se connecter
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="wrap admin">
        <div className="admin-top">
          <div className="me">
            <span className="avatar avatar--lg" style={placeholderStyle('moi')} aria-hidden="true">
              {initials(state.member.nom)}
            </span>
            <div>
              <p className="eyebrow">Mon espace · {state.member.email}</p>
              <h1>Bonjour, {state.member.nom}</h1>
            </div>
          </div>
          <button type="button" className="btn" onClick={() => dispatch({ type: 'member/logout' })}>
            <LogOut aria-hidden="true" /> Se déconnecter
          </button>
        </div>
        <div className="space-layout">
          <ContributeForm />
          <div className="space-side">
            <MyContributions />
            <Profile />
          </div>
        </div>
      </div>
    </section>
  )
}
