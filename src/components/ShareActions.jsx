import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy, Download, Loader2, Share2 } from 'lucide-react'
import { toPng } from 'html-to-image'
import { clsx } from 'clsx'

/**
 * ShareActions
 * Sharing primitives for an Identity Card. Renders two buttons:
 *   1. Copy public share link (/card/:username)
 *   2. Download the rendered card as a PNG (client-side capture)
 *
 * Designed to be dropped under any IdentityCard. Pass `cardRef` (a ref pointing
 * at the card DOM node) and `username`. `variant` controls the color scheme so
 * we can drop this on either light (profile) or dark (quiz, share page) backgrounds.
 */
const ShareActions = ({
  cardRef,
  username,
  variant = 'light', // 'light' | 'dark'
  shareUrl, // optional override
  className = '',
}) => {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)

  const url =
    shareUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/card/${username}`
      : `/card/${username}`)

  const handleCopy = async () => {
    setError(null)
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        // Fallback for older browsers / insecure contexts
        const ta = document.createElement('textarea')
        ta.value = url
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch (e) {
      setError('Could not copy. Try again.')
    }
  }

  const handleDownload = async () => {
    if (!cardRef?.current) {
      setError('Card not ready yet.')
      return
    }
    setError(null)
    setDownloading(true)
    try {
      // 2x pixel ratio for crisp social-media-quality output.
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: 'transparent',
      })
      const link = document.createElement('a')
      link.download = `${username || 'identity'}-4worlds-card.png`
      link.href = dataUrl
      link.click()
    } catch (e) {
      console.error('[ShareActions] download failed', e)
      setError('Download failed. Try again.')
    } finally {
      setDownloading(false)
    }
  }

  const isDark = variant === 'dark'

  const baseBtn =
    'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-black transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed'

  const primaryBtn = isDark
    ? 'bg-white text-[#08080c] hover:scale-[1.02] shadow-2xl'
    : 'bg-slate-900 text-white hover:scale-[1.02] shadow-xl shadow-slate-200'

  const secondaryBtn = isDark
    ? 'border border-white/20 text-white/85 hover:border-white/50'
    : 'border border-slate-200 text-slate-700 hover:border-slate-400 bg-white'

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className={clsx(baseBtn, primaryBtn)}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="inline-flex items-center gap-2"
              >
                <Check size={16} /> Link copied
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="inline-flex items-center gap-2"
              >
                <Share2 size={16} /> Share identity
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className={clsx(baseBtn, secondaryBtn)}
        >
          {downloading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Rendering…
            </>
          ) : (
            <>
              <Download size={16} /> Download PNG
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className={clsx(
            'inline-flex items-center gap-2 px-3 py-3 rounded-full text-xs font-bold transition-colors',
            isDark
              ? 'text-white/50 hover:text-white/90'
              : 'text-slate-400 hover:text-slate-700'
          )}
          title="Copy share URL"
        >
          <Copy size={13} />
          <span className="hidden sm:inline truncate max-w-[200px]">{url}</span>
        </button>
      </div>

      {error && (
        <p
          className={clsx(
            'mt-3 text-xs font-bold',
            isDark ? 'text-rose-300' : 'text-rose-500'
          )}
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default ShareActions
