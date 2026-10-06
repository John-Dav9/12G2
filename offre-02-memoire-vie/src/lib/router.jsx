import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Routage minimal par ancre (#/galerie, #/memoire/simon-nanfa…) : aucun serveur nécessaire.
const RouterContext = createContext({ path: '/', navigate: () => {} })

function readHash() {
  try {
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''))
    if (hash.startsWith('/')) return hash
    // Ancre courte (#galerie, #simon-nanfa) : utile pour partager un lien direct.
    return /^[\w.~-]+$/.test(hash) ? `/${hash}` : '/'
  } catch {
    return '/'
  }
}

export function RouterProvider({ children }) {
  const [path, setPath] = useState(readHash)

  useEffect(() => {
    const onChange = () => setPath(readHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback((to) => {
    setPath(to)
    try {
      if (window.location.hash !== `#${to}`) window.location.hash = to
    } catch {
      // Ancre non modifiable (aperçu intégré) : l'état React suffit.
    }
  }, [])

  const value = useMemo(() => ({ path, navigate }), [path, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export const useRouter = () => useContext(RouterContext)

export function Link({ to, onClick, ...props }) {
  const { navigate } = useRouter()
  const handleClick = (event) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(to)
  }
  return <a href={`#${to}`} {...props} onClick={handleClick} />
}
