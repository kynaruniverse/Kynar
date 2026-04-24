import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { getProfileByUsername } from '@services/alignmentService'
import { WORLD_CONFIG } from '@constants/worlds'
import IdentityCard from '@components/IdentityCard'
import ShareActions from '@components/ShareActions'
import useDocumentMeta from '@lib/useDocumentMeta'

/**
 * SharePage — /card/:username
 * A minimal, distraction-free page designed for sharing. The Navbar is hidden
 * (see App.jsx layout logic) so the card is the only thing on screen.
 *
 * Background is tinted by the user's primary world to make every share link
 * feel personalized when previewed.
 */
const SharePage = () => {
  const { username } = useParams()
  const navigate = useNavigate()
  const cardRef = useRef(null)

  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      const data = await getProfileByUsername(username)
      if (cancelled) return
      if (!data) setNotFound(true)
      else setProfileData(data)
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [username])

  // Compute meta values eagerly so the hook can be called unconditionally
  // (rules of hooks). Falls back to safe placeholders during loading / 404.
  const alignment = profileData?.alignment ?? null
  const primaryWorld = profileData?.primaryWorld ?? null
  const displayName = profileData?.displayName ?? null
  const hasAlignment = !!alignment && !!primaryWorld
  const primary = primaryWorld ? WORLD_CONFIG[primaryWorld] : null

  const shareTitle = hasAlignment
    ? `${displayName || `@${username}`} belongs to ${primary?.name} · 4 Worlds`
    : `@${username} · 4 Worlds`
  const shareDesc = hasAlignment
    ? `${primary?.tagline} See @${username}'s alignment across all four worlds and find yours.`
    : `View ${displayName || `@${username}`}'s identity card on 4 Worlds.`
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/card/${username}`
      : undefined
  const shareImage =
    typeof window !== 'undefined'
      ? `${window.location.origin}/og-default.svg`
      : undefined

  // Per-page meta + Open Graph. Crawlers that execute JS (Twitter, Discord)
  // will read these; others fall back to the index.html defaults.
  useDocumentMeta({
    title: shareTitle,
    description: shareDesc,
    url: shareUrl,
    image: shareImage,
    themeColor: '#06060b',
    type: 'profile',
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06060b] text-white/60 text-sm font-bold">
        Loading card…
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#06060b] text-white text-center px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3">
          404
        </p>
        <h1 className="text-3xl font-black mb-3">No card here.</h1>
        <p className="text-white/50 mb-8 max-w-sm">
          We couldn&apos;t find an identity card for{' '}
          <span className="font-bold text-white/80">@{username}</span>.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-full bg-white text-[#06060b] text-sm font-black"
        >
          Find your world
        </button>
      </div>
    )
  }

  if (!hasAlignment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#06060b] text-white text-center px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3">
          Not aligned yet
        </p>
        <h1 className="text-3xl font-black mb-3">
          @{username} hasn&apos;t taken the quiz.
        </h1>
        <button
          onClick={() => navigate('/quiz')}
          className="mt-4 px-6 py-3 rounded-full bg-white text-[#06060b] text-sm font-black"
        >
          Find your own world
        </button>
      </div>
    )
  }

  // Atmospheric tinted background — cooler, darker than the card so the card pops.
  const bg = `
    radial-gradient(60% 50% at 20% 10%, ${primary.colors.primary}33 0%, transparent 60%),
    radial-gradient(60% 50% at 90% 90%, ${primary.colors.secondary}28 0%, transparent 60%),
    linear-gradient(180deg, #050509 0%, #0a0a13 100%)
  `

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: bg }}>
      {/* Tiny top-left exit chip — only nav element on the page */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-white/45 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> 4 Worlds
        </Link>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16">
        {/* Tagline above card */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/65 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Sparkles size={12} /> World Identity
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white max-w-xl">
            {displayName || `@${username}`}{' '}
            <span className="text-white/40">belongs to</span>{' '}
            <span style={{ color: primary.colors.primary }}>{primary.name}</span>.
          </h1>
        </motion.div>

        {/* Card */}
        <div className="w-full max-w-[420px]">
          <IdentityCard
            ref={cardRef}
            username={username}
            alignment={alignment}
            primaryWorld={primaryWorld}
            size="share"
          />
        </div>

        {/* Share controls */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 w-full max-w-[420px]"
        >
          <ShareActions
            cardRef={cardRef}
            username={username}
            variant="dark"
          />
        </motion.div>

        {/* CTA for visitors */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/35 mb-3">
            What world are you?
          </p>
          <button
            onClick={() => navigate('/quiz')}
            className="text-sm font-black text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
          >
            Take the 90-second alignment quiz →
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default SharePage
