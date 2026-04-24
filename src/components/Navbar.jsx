import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { getWorldBySlug } from '@constants/worlds'
import { User, LogOut, Library, LayoutGrid, ChevronDown, Sparkles, Compass } from 'lucide-react'
import AuthModal from '@components/AuthModal'
import { clsx } from 'clsx'

const Navbar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { worldName } = useParams() // Check if we are inside a world
  const { user, profile, signOut } = useAuth()
  
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Derived state for world-specific styling
  const world = worldName ? getWorldBySlug(worldName) : null

  // Hide Navbar on HubPage for that immersive 4-world landing feel,
  // and on the full-screen onboarding quiz.
  if (pathname === '/' || pathname === '/quiz') return null

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
    navigate('/')
  }

  const toggleAuth = (mode) => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  return (
    <>
      <nav className={clsx(
        "sticky top-0 z-[80] border-b transition-colors duration-500 bg-white/70 backdrop-blur-xl",
        world ? "border-black/5" : "border-slate-100"
      )}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            
            {/* Logo Group */}
            <div className="flex items-center gap-8">
              <button
                onClick={() => navigate('/')}
                className="text-2xl font-black text-slate-900 tracking-tighter hover:scale-105 transition-transform flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-sm">4</div>
                <span className="hidden sm:inline-block">Worlds</span>
              </button>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-1">
                <NavButton onClick={() => navigate('/social')} active={pathname === '/social'}>
                  <LayoutGrid size={18} /> Community
                </NavButton>
                <NavButton onClick={() => navigate('/library')} active={pathname === '/library'}>
                  <Library size={18} /> My Vault
                </NavButton>
                {user && (
                  <NavButton onClick={() => navigate('/me')} active={pathname === '/me'}>
                    <Compass size={18} /> Identity
                  </NavButton>
                )}
              </div>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 p-1 pr-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all active:scale-95"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-slate-200">
                      {profile?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                    </div>
                    <ChevronDown size={14} className={clsx("transition-transform duration-300 text-slate-400", showUserMenu && "rotate-180")} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 py-3 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-6 py-4 mb-2">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Account</p>
                        <p className="text-sm font-black text-slate-900 truncate">{profile?.username || 'Explorer'}</p>
                      </div>
                      
                      <MenuLink onClick={() => { navigate('/me'); setShowUserMenu(false); }} icon={Compass}>
                        My Identity
                      </MenuLink>
                      <MenuLink onClick={() => { navigate('/library'); setShowUserMenu(false); }} icon={Library}>
                        My Library
                      </MenuLink>
                      <MenuLink onClick={() => { navigate('/social'); setShowUserMenu(false); }} icon={LayoutGrid}>
                        Community Feed
                      </MenuLink>
                      
                      <div className="mt-2 pt-2 border-t border-slate-50">
                        <MenuLink onClick={handleSignOut} icon={LogOut} variant="danger">
                          Sign Out
                        </MenuLink>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleAuth('signin')} className="text-sm font-bold text-slate-500 hover:text-slate-900 px-4 py-2 transition-colors">
                    Login
                  </button>
                  <button 
                    onClick={() => toggleAuth('signup')} 
                    className="px-6 py-3 text-sm font-black bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 hover:shadow-indigo-100 transition-all active:scale-95"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />
    </>
  )
}

const NavButton = ({ onClick, children, active }) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
      active ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
    )}
  >
    {children}
  </button>
)

const MenuLink = ({ onClick, children, icon: Icon, variant = 'default' }) => (
  <button
    onClick={onClick}
    className={clsx(
      "w-full flex items-center gap-4 px-6 py-3 text-sm font-bold transition-colors text-left",
      variant === 'danger' ? "text-rose-500 hover:bg-rose-50" : "text-slate-600 hover:bg-slate-50"
    )}
  >
    <Icon size={18} />
    {children}
  </button>
)

export default Navbar
