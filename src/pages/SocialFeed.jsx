import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { socialService } from '@services/socialService'
import { supabase } from '@lib/supabase'
import PostCard from '@components/PostCard'
import CreatePostModal from '@components/CreatePostModal'
import { WORLD_CONFIG } from '@constants/worlds'
import { MessageSquarePlus, Globe, Sparkles, Loader2, Zap } from 'lucide-react'

const SocialFeed = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedWorld, setSelectedWorld] = useState('all')

  const fetchPosts = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true)
    const { data } = await socialService.getPosts(selectedWorld)
    setPosts(data)
    setLoading(false)
  }, [selectedWorld])

  useEffect(() => {
    fetchPosts()

    // Real-time subscription for live community updates
    const channel = supabase
      .channel('feed-live-sync')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' }, 
        () => {
          // Soft-refresh (don't trigger full loading spinner for real-time updates)
          fetchPosts(false) 
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchPosts])

  const filters = [
    { id: 'all', label: 'Global', icon: Globe },
    { id: 'general', label: 'Lounge', icon: Sparkles },
    ...Object.values(WORLD_CONFIG).map(w => ({ 
      id: w.name, 
      label: w.name, 
      icon: () => <span className="text-base leading-none">{w.icon}</span> 
    }))
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      <div className="max-w-2xl mx-auto px-6 pt-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
              <Zap size={12} fill="currentColor" /> Live Multiverse
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Community Feed</h1>
            <p className="text-slate-500 font-medium">Join the conversation across all worlds.</p>
          </div>
          
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="interactive-scale flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200"
            >
              <MessageSquarePlus size={20} /> Create Post
            </button>
          )}
        </header>

        {/* Filter Navigation */}
        <nav className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedWorld(f.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-tight transition-all border-2 whitespace-nowrap active:scale-95 ${
                selectedWorld === f.id 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                  : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600'
              }`}
            >
              {typeof f.icon === 'function' ? <f.icon /> : <f.icon size={16} />} 
              {f.label}
            </button>
          ))}
        </nav>

        {/* Feed Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-300">
            <Loader2 className="animate-spin mb-4" size={32} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing</span>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {posts.length > 0 ? (
              posts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onUpdate={() => fetchPosts(false)} 
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold">No transmissions found in this world.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <CreatePostModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onPostCreated={() => fetchPosts(false)} 
      />
    </div>
  )
}

export default SocialFeed
