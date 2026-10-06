import { createContext, useContext, useMemo, useReducer } from 'react'
import { initialAlbums } from '../data/albums.js'
import { initialMemorials } from '../data/memorials.js'
import { initialMessages } from '../data/messages.js'

// État de la simulation, gardé en mémoire : tout revient à l'exemple au rechargement de la page.
const StoreContext = createContext(null)

let counter = 0
export const newId = (prefix) => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`

const initialState = {
  memorials: initialMemorials,
  albums: initialAlbums,
  messages: initialMessages,
  admin: null,
  unlocked: {},
  storageUsed: 1.2 * 1024 ** 3,
}

function reducer(state, action) {
  switch (action.type) {
    case 'message/add':
      return { ...state, messages: [action.message, ...state.messages] }
    case 'message/approve':
      return {
        ...state,
        messages: state.messages.map((m) => (m.id === action.id ? { ...m, status: 'publié' } : m)),
      }
    case 'message/reject':
      return { ...state, messages: state.messages.filter((m) => m.id !== action.id) }
    case 'album/create':
      return { ...state, albums: [action.album, ...state.albums] }
    case 'album/addItems':
      return {
        ...state,
        albums: state.albums.map((a) => (a.id === action.albumId ? { ...a, items: [...action.items, ...a.items] } : a)),
        storageUsed: state.storageUsed + (action.bytes || 0),
      }
    case 'album/unlock':
      return { ...state, unlocked: { ...state.unlocked, [action.id]: true } }
    case 'memorial/create':
      return {
        ...state,
        memorials: [...state.memorials, action.memorial],
        albums: [...(action.albums || []), ...state.albums],
      }
    case 'admin/login':
      return { ...state, admin: action.admin }
    case 'admin/logout':
      return { ...state, admin: null }
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

export function isAlbumLocked(state, album) {
  return Boolean(album.protected) && !state.unlocked[album.id] && !state.admin
}
