import { useState } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { X, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'

const AuthModal = ({ isOpen, onClose, defaultMode = 'signin' }) => {
  const [mode, setMode] = useState(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signUp } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        if (!username) throw new Error('Username is required')
        
        const { error: signUpError } = await signUp(email, password, username)
        if (signUpError) throw signUpError
        
        alert('Verification email sent! Please check your inbox.')
        onClose()
      } else {
        const { error: signInError } = await signIn(email, password)
        if (signInError) throw signInError
        onClose()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setError('')
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-[200] animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 md:p-10 relative border border-white/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">
            {mode === 'signin' ? 'Welcome Back' : 'Join the Multiverse'}
          </h2>
          <p className="text-slate-500 font-medium">
            {mode === 'signin' 
              ? 'Access your library and saved guides.' 
              : 'Create an account to start your collection.'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold uppercase tracking-tight">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  placeholder="explorer_2026"
                  required={mode === 'signup'}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                placeholder="you@nexus.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                {mode === 'signin' ? 'Sign In' : 'Get Started'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="mt-8 text-center">
          <button
            onClick={switchMode}
            className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
          >
            {mode === 'signin' 
              ? "Don't have an account? Create one" 
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
