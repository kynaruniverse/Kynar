import { useState } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { socialService } from '@services/socialService'
import { WORLD_CONFIG, WORLD_TYPES } from '@constants/worlds'
import { X, Send, Globe, Sparkles, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const { user, profile } = useAuth()
  const [content, setContent] = useState('')
  const [selectedWorld, setSelectedWorld] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() || submitting) return

    setSubmitting(true)
    const result = await socialService.createPost(
      user.id, 
      content.trim(), 
      selectedWorld, 
      profile?.posts || []
    )

    if (!result.error) {
      setContent('')
      setSelectedWorld(null)
      if (onPostCreated) onPostCreated()
      onClose()
    } else {
      alert('Failed to post. Check your connection.')
    }
    setSubmitting(false)
  }

  const worlds = [
    { name: null, label: 'Lounge', icon: <Sparkles size={18} /> },
    ...Object.values(WORLD_CONFIG).map(w => ({ 
      name: w.name, 
      label: w.name, 
      icon: <span>{w.icon}</span> 
    }))
  ]

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-xl w-full overflow-hidden border border-white/20">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Create Post</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Share with the multiverse</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* TextArea Area */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening in your world?"
              rows={5}
              className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-indigo-500 transition-all resize-none font-medium text-slate-700 placeholder:text-slate-300"
              disabled={submitting}
            />
            <div className="absolute bottom-4 right-6 text-[10px] font-black text-slate-300 uppercase">
              {content.length} / 500
            </div>
          </div>

          {/* World Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Select Destination
            </label>
            <div className="flex flex-wrap gap-2">
              {worlds.map((world) => (
                <button
                  key={world.label}
                  type="button"
                  onClick={() => setSelectedWorld(world.name)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border-2 active:scale-95",
                    selectedWorld === world.name
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  )}
                >
                  {world.icon} {world.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Send size={18} /> Publish to Feed
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePostModal
