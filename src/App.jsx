import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from '@contexts/AuthContext'
import Navbar from '@components/Navbar'
import HubPage from '@pages/HubPage'
import WorldPage from '@pages/WorldPage'
import ProductDetails from '@pages/ProductDetails'
import GuideDetails from '@pages/GuideDetails'
import UserLibrary from '@pages/UserLibrary'
import SocialFeed from '@pages/SocialFeed'

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
  if (loading) return null // Or a loading spinner
  return user ? children : <HubPage /> 
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Utilities */}
        <ScrollToTop />
        
        {/* Global Layout Wrapper */}
        <div className="flex flex-col min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Entry Point */}
              <Route path="/" element={<HubPage />} />
              
              {/* Community Feed */}
              <Route path="/social" element={<SocialFeed />} />
              
              {/* Dynamic World Routing */}
              <Route path="/worlds/:worldName" element={<WorldPage />} />
              
              {/* Content Deep-Links */}
              <Route 
                path="/worlds/:worldName/products/:productId" 
                element={<ProductDetails />} 
              />
              <Route 
                path="/worlds/:worldName/guides/:guideId" 
                element={<GuideDetails />} 
              />
              
              {/* Private User Space */}
              <Route 
                path="/library" 
                element={
                  <ProtectedRoute>
                    <UserLibrary />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Fallback */}
              <Route path="*" element={<HubPage />} />
            </Routes>
          </main>

          {/* Optional: Footer can go here */}
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
