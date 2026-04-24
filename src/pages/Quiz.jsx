import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { QUIZ_QUESTIONS } from '@constants/quiz'
import { WORLD_CONFIG } from '@constants/worlds'
import { useAuth } from '@contexts/AuthContext'
import {
  calculateAlignment,
  submitQuiz,
  stashPendingAlignment,
} from '@services/alignmentService'
import IdentityCard from '@components/IdentityCard'
import ShareActions from '@components/ShareActions'
import AuthModal from '@components/AuthModal'
import useDocumentMeta from '@lib/useDocumentMeta'

const uuid = () =>
  (crypto?.randomUUID && crypto.randomUUID()) ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`

const Quiz = () => {
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  useDocumentMeta({
    title: 'Find your world · 4 Worlds',
    description: 'A 90-second alignment quiz reveals which world your taste belongs to.',
    themeColor: '#08080c',
  })

  const [step, setStep] = useState(0) // 0..N-1 = questions, N = result
  const [answers, setAnswers] = useState({}) // { [questionId]: optionId }
  const [direction, setDirection] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [savedAlignment, setSavedAlignment] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)

  const total = QUIZ_QUESTIONS.length
  const isResult = step >= total
  const currentQ = QUIZ_QUESTIONS[step]
  const selectedOptionId = currentQ ? answers[currentQ.id] : null

  const responses = useMemo(
    () =>
      Object.entries(answers).map(([questionId, optionId]) => {
        const q = QUIZ_QUESTIONS.find((x) => x.id === questionId)
        const opt = q.options.find((o) => o.id === optionId)
        return { questionId, optionId, weights: opt.weights }
      }),
    [answers]
  )

  const liveAlignment = useMemo(
    () => (responses.length === total ? calculateAlignment(responses) : null),
    [responses, total]
  )

  // Persist + advance to result.
  const finalize = async () => {
    if (!liveAlignment) return
    setServerError(null)

    if (user) {
      try {
        setSubmitting(true)
        await submitQuiz(user.id, uuid(), responses)
        setSavedAlignment(liveAlignment)
      } catch (err) {
        setServerError(
          err?.message ||
            "We couldn't save your alignment. Your result is shown — try again in a moment."
        )
        setSavedAlignment(liveAlignment)
      } finally {
        setSubmitting(false)
      }
    } else {
      // Anonymous: stash so AuthContext can flush after sign-in.
      stashPendingAlignment({
        attemptId: uuid(),
        responses,
        alignment: liveAlignment,
        savedAt: new Date().toISOString(),
      })
      setSavedAlignment(liveAlignment)
    }
  }

  const handleSelect = (optionId) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }))
  }

  const handleNext = async () => {
    if (!selectedOptionId) return
    if (step === total - 1) {
      setDirection(1)
      setStep(total)
      await finalize()
    } else {
      setDirection(1)
      setStep((s) => s + 1)
    }
  }

  const handleBack = () => {
    if (step === 0) return navigate('/')
    setDirection(-1)
    setStep((s) => s - 1)
  }

  // After auth completes from the result screen, the AuthContext will flush
  // pending alignment to Supabase. Once a profile shows up, we can route home.
  useEffect(() => {
    if (authOpen && user) setAuthOpen(false)
  }, [user, authOpen])

  return (
    <div className="fixed inset-0 z-[100] bg-[#08080c] text-white overflow-hidden">
      {/* Ambient backdrop */}
      <BackgroundOrbs step={step} total={total} liveAlignment={liveAlignment} />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-10 pt-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          {step === 0 ? 'Exit' : 'Back'}
        </button>
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
          {isResult ? 'Result' : `${step + 1} / ${total}`}
        </div>
      </div>

      {/* Progress */}
      {!isResult && (
        <div className="relative z-10 mx-6 md:mx-10 mt-4 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white"
            initial={false}
            animate={{ width: `${((step + 1) / total) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-[calc(100%-72px)] flex items-center justify-center px-6 md:px-10">
        <AnimatePresence mode="wait" custom={direction}>
          {!isResult ? (
            <QuestionView
              key={currentQ.id}
              direction={direction}
              question={currentQ}
              selected={selectedOptionId}
              onSelect={handleSelect}
              onNext={handleNext}
            />
          ) : (
            <ResultView
              key="result"
              alignment={savedAlignment || liveAlignment}
              username={profile?.username}
              user={user}
              submitting={submitting}
              serverError={serverError}
              onClaim={() => setAuthOpen(true)}
              onViewProfile={() => navigate('/me')}
              onExplore={() => navigate('/')}
            />
          )}
        </AnimatePresence>
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultMode="signup"
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */

const QuestionView = ({ direction, question, selected, onSelect, onNext }) => (
  <motion.div
    custom={direction}
    initial={{ opacity: 0, x: direction * 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -direction * 40 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="w-full max-w-2xl"
  >
    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-5">
      Question
    </p>
    <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-10">
      {question.prompt}
    </h1>

    <div className="space-y-3">
      {question.options.map((opt, i) => {
        const isActive = selected === opt.id
        return (
          <motion.button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.4 }}
            whileTap={{ scale: 0.985 }}
            className={clsx(
              'group w-full text-left px-5 py-5 rounded-2xl border transition-all',
              'flex items-start gap-4',
              isActive
                ? 'bg-white text-[#08080c] border-white shadow-2xl'
                : 'bg-white/[0.04] text-white border-white/10 hover:border-white/30 hover:bg-white/[0.07]'
            )}
          >
            <div
              className={clsx(
                'mt-0.5 h-5 w-5 rounded-full border-2 shrink-0 transition-all flex items-center justify-center',
                isActive ? 'border-[#08080c] bg-[#08080c]' : 'border-white/30'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="dot"
                  className="h-2 w-2 rounded-full bg-white"
                />
              )}
            </div>
            <span className="text-base md:text-lg font-medium leading-snug">
              {opt.label}
            </span>
          </motion.button>
        )
      })}
    </div>

    <div className="mt-10 flex justify-end">
      <motion.button
        onClick={onNext}
        disabled={!selected}
        whileTap={{ scale: 0.96 }}
        className={clsx(
          'inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm font-black tracking-wide transition-all',
          selected
            ? 'bg-white text-[#08080c] shadow-2xl hover:scale-[1.02]'
            : 'bg-white/10 text-white/30 cursor-not-allowed'
        )}
      >
        Continue <ArrowRight size={16} />
      </motion.button>
    </div>
  </motion.div>
)

/* -------------------------------------------------------------------------- */

const ResultView = ({
  alignment,
  username,
  user,
  submitting,
  serverError,
  onClaim,
  onViewProfile,
  onExplore,
}) => {
  const cardRef = useRef(null)
  if (!alignment) return null
  const primary = WORLD_CONFIG[alignment.primary_world]
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-5xl grid md:grid-cols-2 gap-10 md:gap-16 items-center py-16"
    >
      {/* Copy */}
      <div className="order-2 md:order-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/70 text-[10px] font-black uppercase tracking-[0.25em] mb-6">
          <Sparkles size={12} /> Your Alignment
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-5">
          You belong to{' '}
          <span style={{ color: primary?.colors.primary }}>{primary?.name}</span>.
        </h1>
        <p className="text-base md:text-lg text-white/60 leading-relaxed mb-8 max-w-md">
          {primary?.description} Your card evolves as your taste does — return
          tomorrow for your next ritual.
        </p>

        {serverError && (
          <p className="text-sm text-rose-300 mb-4">{serverError}</p>
        )}

        <div className="flex flex-wrap gap-3">
          {user ? (
            <button
              onClick={onViewProfile}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-[#08080c] text-sm font-black hover:scale-[1.02] transition-transform shadow-2xl"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving…
                </>
              ) : (
                <>
                  View my profile <ArrowRight size={16} />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onClaim}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-[#08080c] text-sm font-black hover:scale-[1.02] transition-transform shadow-2xl"
            >
              Claim my identity <ArrowRight size={16} />
            </button>
          )}
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/20 text-white/80 text-sm font-bold hover:border-white/50 transition-colors"
          >
            Explore the Worlds
          </button>
        </div>

        {/* Share is gated on having a username (i.e. the user has signed up
            and the alignment has been flushed). For anonymous users we lead
            with "Claim my identity" first. */}
        {user && username && (
          <div className="mt-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3">
              Share your card
            </p>
            <ShareActions
              cardRef={cardRef}
              username={username}
              variant="dark"
            />
          </div>
        )}
      </div>

      {/* Card */}
      <div className="order-1 md:order-2">
        <IdentityCard
          ref={cardRef}
          username={username || 'you'}
          alignment={alignment}
          primaryWorld={alignment.primary_world}
          size="md"
        />
      </div>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */

const BackgroundOrbs = ({ step, total, liveAlignment }) => {
  // Tint the ambient orbs by the leading world as the quiz progresses.
  const leadingWorld = liveAlignment?.primary_world
  const tint = leadingWorld
    ? WORLD_CONFIG[leadingWorld].colors.primary
    : '#6366f1'
  const tintB = leadingWorld
    ? WORLD_CONFIG[leadingWorld].colors.secondary
    : '#a855f7'

  return (
    <>
      <motion.div
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-[140px]"
        animate={{ backgroundColor: tint, opacity: 0.18 }}
        transition={{ duration: 1.6 }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full blur-[140px]"
        animate={{ backgroundColor: tintB, opacity: 0.16 }}
        transition={{ duration: 1.6 }}
      />
    </>
  )
}

export default Quiz
