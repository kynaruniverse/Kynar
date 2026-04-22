import { useState } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { socialService } from '@services/socialService'
import { Heart, MessageCircle, Share2, Send } from 'lucide-react'
import { clsx } from 'clsx'

const PostCard = ({ post, onUpdate }) => {
  const { user, profile } = useAuth()
  const [comment, setComment] = useState('')
  const [isLiking, setIsLiking] = useState(false)

  const isLiked = user && post.likes?.includes(user.id)
  
  const handleLike = async () => {
    if (!user || isLiking) return
    setIsLiking(true)
    await socialService.toggleLike(post.id, user.id, post.likes || [])
    onUpdate()
    setIsLiking(false)
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!user || !comment.trim()) return
    await socialService.addComment(post.id, user.id, comment, post.comments || [])
    setComment('')
    onUpdate()
  }

  return (
    <article className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition-hover hover:shadow-md">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center font-bold text-slate-500 border border-white">
            {post.users?.username?.[0] || post.users?.email?.[0]?.toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-none">{post.users?.username || 'Explorer'}</h4>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <p className="text-slate-700 leading-relaxed mb-6 font-medium text-lg">
        {post.content}
      </p>

      <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
        <button 
          onClick={handleLike}
          className={clsx(
            "flex items-center gap-2 text-sm font-bold transition-all active:scale-90",
            isLiked ? "text-rose-500" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <Heart size={20} className={isLiked ? "fill-current" : ""} />
          {post.likes?.length || 0}
        </button>

        <button className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600">
          <MessageCircle size={20} />
          {post.comments?.length || 0}
        </button>
      </div>

      {user && (
        <form onSubmit={handleCommentSubmit} className="mt-6 flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
          <input 
            type="text" 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a thought..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium px-2"
          />
          <button className="p-2 bg-white rounded-xl text-indigo-600 shadow-sm hover:bg-indigo-50 transition-colors">
            <Send size={18} />
          </button>
        </form>
      )}
    </article>
  )
}

export default PostCard
