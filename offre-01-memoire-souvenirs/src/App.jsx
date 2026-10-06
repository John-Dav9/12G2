import { useEffect, useState } from 'react'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import OfferSheet from './components/OfferSheet.jsx'
import SimBanner from './components/SimBanner.jsx'
import { ToastProvider } from './components/Toast.jsx'
import { RouterProvider, useRouter } from './lib/router.jsx'
import { StoreProvider } from './lib/store.jsx'
import AdminPage from './pages/AdminPage.jsx'
import AlbumPage from './pages/AlbumPage.jsx'
import Gallery from './pages/Gallery.jsx'
import Home from './pages/Home.jsx'
import MemorialPage from './pages/MemorialPage.jsx'

function Page() {
  const { path } = useRouter()
  const [, section = '', param] = path.split('/')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [path])

  switch (section) {
    case '':
      return <Home />
    case 'galerie':
      return <Gallery />
    case 'album':
      return <AlbumPage key={param} id={param} />
    case 'memoire':
      return <MemorialPage key={param} slug={param} />
    case 'gestion':
      return <AdminPage />
    default:
      // Lien court vers un espace : #simon-nanfa
      return <MemorialPage key={section} slug={section} />
  }
}

export default function App() {
  const [offerOpen, setOfferOpen] = useState(false)
  const openOffer = () => setOfferOpen(true)

  return (
    <RouterProvider>
      <StoreProvider>
        <ToastProvider>
          <SimBanner onOpenOffer={openOffer} />
          <Header />
          <main id="contenu">
            <Page />
          </main>
          <Footer onOpenOffer={openOffer} />
          {offerOpen && <OfferSheet onClose={() => setOfferOpen(false)} />}
        </ToastProvider>
      </StoreProvider>
    </RouterProvider>
  )
}
