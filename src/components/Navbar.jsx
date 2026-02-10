import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
    navigate('/')
  }

  const openAuthModal = (mode) => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  // Don't show navbar on hub page
  if (location.pathname === '/') {
    return null
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo / Home */}
            <button
              onClick={() => navigate('/')}
              className="text-xl font-bold text-gray-900 hover:text-gray-700 active:scale-95 transition-all"
            >
              4 Worlds
            </button>

            {/* Nav Links */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {/* Social Feed Link */}
                  <button
                    onClick={() => navigate('/social')}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 active:scale-95 transition-all"
                  >
                    Social
                  </button>

                  {/* Library Link */}
                  <button
                    onClick={() => navigate('/library')}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 active:scale-95 transition-all"
                  >
                    My Library
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                        {user.email?.[0]?.toUpperCase()}
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.email}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            navigate('/library')
                            setShowUserMenu(false)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                        >
                          My Library
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 active:bg-red-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 active:scale-95 transition-all px-4 py-2"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 active:scale-95 transition-all"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />
    </>
  )
}

export default Navbar
