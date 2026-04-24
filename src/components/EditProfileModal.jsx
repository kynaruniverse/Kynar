import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, X } from 'lucide-react'
import { userService } from '@services/userService'

const MAX_DISPLAY_NAME = 40
const MAX_BIO = 160

/**
 * EditProfileModal
 * Self-contained modal for editing display_name + bio. Calls the parent
 * back via onSaved() so it can refresh local profile state.
 */
const EditProfileModal = ({ isOpen, onClose, profile, onSaved }) => {
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Keep local state in sync if profile prop changes
  useEffect(() => {
    if (isOpen) {
      setDisplayName(profile?.display_name || '')
      setBio(profile?.bio || '')
      setError(null)
    }
  }, [isOpen, profile])

  // Esc to close
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && !saving && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, saving, onClose])

  const handleSave = async (e) => {
    e?.preventDefault?.()
    if (!profile?.id || saving) return
    setError(null)
    setSaving(true)
    const { error: err } = await userService.updateProfile(profile.id, {
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
    })
    setSaving(false)
    if (err) {
      setError(err.message || 'Could not save changes.')
      return
    }
    onSaved?.()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => !saving && onClose()}
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.form
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
              Edit profile
            </p>
            <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-6">
              Tell the world who you are.
            </h2>

            <label className="block mb-5">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Display name
                </span>
                <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                  {displayName.length}/{MAX_DISPLAY_NAME}
                </span>
              </div>
              <input
                type="text"
                value={displayName}
                onChange={(e) =>
                  setDisplayName(e.target.value.slice(0, MAX_DISPLAY_NAME))
                }
                placeholder="@your handle"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-slate-900 transition-colors"
                autoFocus
              />
            </label>

            <label className="block mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Bio
                </span>
                <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                  {bio.length}/{MAX_BIO}
                </span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, MAX_BIO))}
                rows={4}
                placeholder="A line or two about your taste."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-slate-900 transition-colors resize-none"
              />
            </label>

            {error && (
              <p className="text-sm font-bold text-rose-500 mb-4">{error}</p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-5 py-3 rounded-full text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-black hover:scale-[1.02] active:scale-[0.97] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving…
                  </>
                ) : (
                  'Save changes'
                )}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EditProfileModal
