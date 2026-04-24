import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from '@contexts/AuthContext'
import Navbar from '@components/Navbar'
import HubPage from '@pages/HubPage'
import Quiz from '@pages/Quiz'
import Profile from '@pages/Profile'
import SharePage from '@pages/SharePage'
import NotFound from '@pages/NotFound'

/**
 * Helper: ScrollToTop
 * Ensures every navigation starts at the top of the page.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/**
 * Helper: ProtectedRoute
 * Redirects unauthenticated users away from private pages.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <HubPage />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />

        <div className="flex flex-col min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* Public Entry Point */}
              <Route path="/" element={<HubPage />} />

              {/* Identity */}
              <Route path="/quiz" element={<Quiz />} />
              <Route
                path="/me"
                element={
                  <ProtectedRoute>
                    <Profile self />
                  </ProtectedRoute>
                }
              />
              <Route path="/u/:username" element={<Profile />} />
              <Route path="/card/:username" element={<SharePage />} />

              {/* 404 — real fallback page (replaces silent redirect to Hub) */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
