import { createContext, useContext, useMemo, useReducer } from 'react'
import { initialAlbums } from '../data/albums.js'
import { initialAnecdotes, initialContributions } from '../data/contributions.js'
import { initialMembers, initialSignups } from '../data/members.js'
import { initialMemorials } from '../data/memorials.js'
import { initialMessages } from '../data/messages.js'
import { initialPosts } from '../data/posts.js'

// État de la simulation, gardé en mémoire : tout revient à l'exemple au rechargement de la page.
const StoreContext = createContext(null)

let counter = 0
export const newId = (prefix) => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`

const initialState = {
  memorials: initialMemorials,
  albums: initialAlbums,
  messages: initialMessages,
  posts: initialPosts,
  members: initialMembers,
  signups: initialSignups,
  contributions: initialContributions,
  anecdotes: initialAnecdotes,
  admin: null,
  member: null,
  loginOpen: false,
  candlesLit: {},
  rsvp: {},
  reacted: {},
  storageUsed: 6.8 * 1024 ** 3,
  videoMinutesUsed: 142,
}

const minutesOf = (duration) => {
  const [m, s] = String(duration || '0:00').split(':').map(Number)
  return (m || 0) + (s || 0) / 60
}

function addToAlbum(albums, albumId, items) {
  return albums.map((a) => (a.id === albumId ? { ...a, items: [...items, ...a.items] } : a))
}

function applyContribution(state, c) {
  if (c.type === 'souvenir') {
    return {
      ...state,
      anecdotes: [
        { id: c.id, memorial: c.target.id, author: c.author, text: c.text, date: new Date().toISOString(), withPhoto: Boolean(c.items?.length), src: c.items?.[0]?.src },
        ...state.anecdotes,
      ],
    }
  }
  if (c.type === 'hommage') {
    return {
      ...state,
      messages: [
        { id: c.id, memorial: c.target.id, author: c.author, relation: 'Camarade de classe', text: c.text, date: new Date().toISOString(), status: 'publié' },
        ...state.messages,
      ],
    }
  }
  if (c.type === 'photos') {
    const items =
      c.items?.length > 0
        ? c.items
        : Array.from({ length: c.count || 1 }, (_, i) => ({ id: `${c.id}-${i}`, kind: 'photo', caption: `Photo proposée par ${c.author}`, seed: `${c.id}-${i}` }))
    return { ...state, albums: addToAlbum(state.albums, c.target.id, items) }
  }
  if (c.type === 'video') {
    const item = c.items?.[0] ?? { id: `${c.id}-v`, kind: 'video', caption: c.caption || `Vidéo proposée par ${c.author}`, duration: c.duration, seed: c.id }
    return {
      ...state,
      albums: addToAlbum(state.albums, c.target.id, [item]),
      videoMinutesUsed: state.videoMinutesUsed + minutesOf(item.duration || c.duration || '2:00'),
    }
  }
  return state
}

function reducer(state, action) {
  switch (action.type) {
    case 'message/add':
      return { ...state, messages: [action.message, ...state.messages] }
    case 'message/approve':
      return { ...state, messages: state.messages.map((m) => (m.id === action.id ? { ...m, status: 'publié' } : m)) }
    case 'message/reject':
      return { ...state, messages: state.messages.filter((m) => m.id !== action.id) }

    case 'album/create':
      return { ...state, albums: [action.album, ...state.albums] }
    case 'album/addItems':
      return {
        ...state,
        albums: addToAlbum(state.albums, action.albumId, action.items),
        storageUsed: state.storageUsed + (action.bytes || 0),
      }
    case 'album/visibility':
      return { ...state, albums: state.albums.map((a) => (a.id === action.id ? { ...a, visibility: action.visibility } : a)) }

    case 'memorial/create':
      return { ...state, memorials: [...state.memorials, action.memorial], albums: [...(action.albums || []), ...state.albums] }
    case 'memorial/visibility':
      return {
        ...state,
        memorials: state.memorials.map((m) => (m.slug === action.slug ? { ...m, visibility: action.visibility } : m)),
      }
    case 'candle/light':
      if (state.candlesLit[action.slug]) return state
      return {
        ...state,
        candlesLit: { ...state.candlesLit, [action.slug]: true },
        memorials: state.memorials.map((m) => (m.slug === action.slug ? { ...m, candles: m.candles + 1 } : m)),
      }

    case 'contribution/add':
      return { ...state, contributions: [action.contribution, ...state.contributions] }
    case 'contribution/draft':
      return { ...state, draft: action.draft }
    case 'contribution/approve': {
      const c = state.contributions.find((x) => x.id === action.id)
      if (!c || c.status !== 'en attente') return state
      const next = applyContribution(state, c)
      return { ...next, contributions: next.contributions.map((x) => (x.id === c.id ? { ...x, status: 'publié' } : x)) }
    }
    case 'contribution/reject':
      return {
        ...state,
        contributions: state.contributions.map((x) => (x.id === action.id ? { ...x, status: 'refusé' } : x)),
      }

    case 'post/create':
      return { ...state, posts: [action.post, ...state.posts] }
    case 'rsvp/toggle':
      return { ...state, rsvp: { ...state.rsvp, [action.id]: !state.rsvp[action.id] } }
    case 'reaction/toggle':
      return { ...state, reacted: { ...state.reacted, [action.id]: !state.reacted[action.id] } }

    case 'signup/approve': {
      const s = state.signups.find((x) => x.id === action.id)
      if (!s) return state
      return {
        ...state,
        signups: state.signups.filter((x) => x.id !== action.id),
        members: [...state.members, { id: s.id, nom: s.nom, ville: 'Ville à compléter', metier: 'Profession à compléter', nouveau: true }],
      }
    }
    case 'signup/reject':
      return { ...state, signups: state.signups.filter((x) => x.id !== action.id) }

    case 'admin/login':
      return { ...state, admin: action.admin }
    case 'admin/logout':
      return { ...state, admin: null }
    case 'member/login':
      return { ...state, member: action.member, loginOpen: false }
    case 'member/logout':
      return { ...state, member: null }
    case 'login/open':
      return { ...state, loginOpen: true }
    case 'login/close':
      return { ...state, loginOpen: false }
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)

// Un contenu « membres » s'affiche aux membres connectés et aux administrateurs.
export const canSeeMembersContent = (state) => Boolean(state.member || state.admin)

export function isHidden(state, item) {
  return item?.visibility === 'membres' && !canSeeMembersContent(state)
}
