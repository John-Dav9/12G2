import { useEffect, useState } from 'react'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import LoginModal from './components/LoginModal.jsx'
import OfferSheet from './components/OfferSheet.jsx'
import SimBanner from './components/SimBanner.jsx'
import { ToastProvider } from './components/Toast.jsx'
import { RouterProvider, useRouter } from './lib/router.jsx'
import { StoreProvider, useStore } from './lib/store.jsx'
import AdminPage from './pages/AdminPage.jsx'
import AlbumPage from './pages/AlbumPage.jsx'
import Gallery from './pages/Gallery.jsx'
import Home from './pages/Home.jsx'
import MembersPage from './pages/MembersPage.jsx'
import MemorialPage from './pages/MemorialPage.jsx'
import MySpacePage from './pages/MySpacePage.jsx'
import NewsPage from './pages/NewsPage.jsx'

function Page() {
  const { path } = useRouter()
  const [, section = '', param] = path.split('/')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [path])

  switch (section) {
    case '':
      return <Home />
    case 'archives':
    case 'galerie':
      return <Gallery />
    case 'album':
      return <AlbumPage key={param} id={param} />
    case 'memoire':
      return <MemorialPage key={param} slug={param} />
    case 'actualites':
      return <NewsPage />
    case 'membres':
      return <MembersPage />
    case 'mon-espace':
      return <MySpacePage />
    case 'gestion':
      return <AdminPage />
    default:
      // Lien court vers un espace : #simon-nanfa
      return <MemorialPage key={section} slug={section} />
  }
}

function LoginLayer() {
  const { state } = useStore()
  return state.loginOpen ? <LoginModal /> : null
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
          <LoginLayer />
          {offerOpen && <OfferSheet onClose={() => setOfferOpen(false)} />}
        </ToastProvider>
      </StoreProvider>
    </RouterProvider>
  )
}
