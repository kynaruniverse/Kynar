import { supabase } from '@lib/supabase'

/**
 * socialService handles all community interactions including 
 * posts, likes, and comments.
 */
export const socialService = {
  /**
   * Fetches posts with user profile information.
   * Supports filtering by specific worlds or 'general' (null world).
   */
  async getPosts(filter = 'all') {
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          users!posts_user_id_fkey (username, email)
        `)
        .order('created_at', { ascending: false })

      if (filter === 'general') {
        query = query.is('world', null)
      } else if (filter !== 'all') {
        query = query.eq('world', filter)
      }

      const { data, error } = await query
      if (error) throw error
      return { data: data || [], error: null }
    } catch (err) {
      console.error('Fetch Posts Error:', err.message)
      return { data: [], error: err.message }
    }
  },

  /**
   * Creates a new post and links it to the user's profile.
   * * @param {string} userId - ID of the creator
   * @param {string} content - Post text content
   * @param {string|null} world - The world the post belongs to
   * @param {Array} currentPostIds - Existing list of post IDs from the user profile
   */
  async createPost(userId, content, world, currentPostIds = []) {
    try {
      // 1. Create the post record
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert([{ 
          user_id: userId, 
          content, 
          world, 
          likes: [], 
          comments: [] 
        }])
        .select()
        .single()

      if (postError) throw postError

      // 2. Update the User's tracking array to maintain the relationship
      const { error: userError } = await supabase
        .from('users')
        .update({ posts: [...currentPostIds, post.id] })
        .eq('id', userId)

      if (userError) throw userError

      return { data: post, error: null }
    } catch (err) {
      console.error('Create Post Error:', err.message)
      return { data: null, error: err.message }
    }
  },

  /**
   * Toggles a like on a post.
   * Prevents duplicates using a Set for the updated array.
   */
  async toggleLike(postId, userId, currentLikes = []) {
    try {
      const isLiked = currentLikes.includes(userId)
      const updatedLikes = isLiked 
        ? currentLikes.filter(id => id !== userId)
        : [...new Set([...currentLikes, userId])]

      const { error } = await supabase
        .from('posts')
        .update({ likes: updatedLikes })
        .eq('id', postId)

      if (error) throw error
      return { error: null, isLiked: !isLiked }
    } catch (err) {
      return { error: err.message, isLiked: currentLikes.includes(userId) }
    }
  },

  /**
   * Adds a comment to a post and updates the post's comment reference list.
   */
  async addComment(postId, userId, content, currentCommentIds = []) {
    try {
      // 1. Create the comment record
      const { data: comment, error: cErr } = await supabase
        .from('comments')
        .insert([{ post_id: postId, user_id: userId, content }])
        .select()
        .single()

      if (cErr) throw cErr

      // 2. Update the post's internal comments reference array
      const { error: pErr } = await supabase
        .from('posts')
        .update({ comments: [...currentCommentIds, comment.id] })
        .eq('id', postId)

      if (pErr) throw pErr
      return { data: comment, error: null }
    } catch (err) {
      console.error('Add Comment Error:', err.message)
      return { data: null, error: err.message }
    }
  }
}
