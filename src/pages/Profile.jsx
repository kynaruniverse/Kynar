import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Compass, Sparkles } from 'lucide-react'
import { useAuth } from '@contexts/AuthContext'
import { getProfileByUsername } from '@services/alignmentService'
import { WORLD_CONFIG } from '@constants/worlds'
import IdentityCard from '@components/IdentityCard'

/**
 * Profile
 * Renders both `/me` (current user) and `/u/:username` (public profile).
 * If the user has not completed the quiz, route them into onboarding.
 */
const Profile = ({ self = false }) => {
  const navigate = useNavigate()
  const { username: routeUsername } = useParams()
  const { user, profile, loading: authLoading } = useAuth()

  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const lookupUsername = self ? profile?.username : routeUsername

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (self && authLoading) return
      if (self && !user) {
        navigate('/')
        return
      }
      if (!lookupUsername) {
        // /me but no username yet — push to quiz so they can claim one
        if (self) navigate('/quiz')
        return
      }
      setLoading(true)
      const data = await getProfileByUsername(lookupUsername)
      if (cancelled) return
      if (!data) {
        setNotFound(true)
      } else {
        setProfileData(data)
      }
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [self, authLoading, user, lookupUsername, navigate])

  if (loading || (self && authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm font-bold">
        Loading…
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">
          404
        </p>
        <h1 className="text-3xl font-black text-slate-900 mb-3">
          We couldn&apos;t find that explorer.
        </h1>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-black"
        >
          Back to the Hub
        </button>
      </div>
    )
  }

  if (!profileData) return null

  const { alignment, primaryWorld, username, displayName, bio } = profileData
  const hasAlignment = !!alignment && !!primaryWorld
  const primary = primaryWorld ? WORLD_CONFIG[primaryWorld] : null

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-10">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-700"
        >
          <ArrowLeft size={16} /> Hub
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-[1fr_auto] gap-12 items-start">
        {/* Left: identity copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.25em] mb-6">
            <Sparkles size={12} /> World Identity
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.95]">
            {displayName || `@${username}`}
          </h1>
          {displayName && (
            <p className="mt-2 text-base font-bold text-slate-400">@{username}</p>
          )}
          {bio && (
            <p className="mt-6 max-w-md text-lg text-slate-500 leading-relaxed">
              {bio}
            </p>
          )}

          {hasAlignment ? (
            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{primary.icon}</span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Primary world
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {primary.name}
                  </p>
                </div>
              </div>
              <p
                className="text-base font-medium max-w-md"
                style={{ color: primary.colors.text }}
              >
                {primary.tagline}
              </p>
            </div>
          ) : (
            <div className="mt-10 p-6 rounded-3xl bg-white border border-slate-100 max-w-md">
              <p className="text-sm font-bold text-slate-500 mb-4">
                {self
                  ? "You haven't taken the alignment quiz yet."
                  : `${username} hasn't taken the alignment quiz yet.`}
              </p>
              {self && (
                <button
                  onClick={() => navigate('/quiz')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-900 text-white text-sm font-black"
                >
                  <Compass size={16} /> Find my world
                </button>
              )}
            </div>
          )}

          {self && hasAlignment && (
            <button
              onClick={() => navigate('/quiz')}
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 underline underline-offset-4"
            >
              Re-take the quiz
            </button>
          )}
        </motion.div>

        {/* Right: identity card */}
        {hasAlignment && (
          <div className="md:sticky md:top-24">
            <IdentityCard
              username={username}
              alignment={alignment}
              primaryWorld={primaryWorld}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
