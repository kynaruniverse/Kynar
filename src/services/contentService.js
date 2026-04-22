import { supabase } from '@lib/supabase'

/**
 * contentService manages all public-facing data fetching for 
 * worlds, products, and guides, as well as social interactions like bookmarks.
 */
export const contentService = {
  
  /**
   * Fetches all products and guides for a specific world.
   * Utilizes Promise.all for parallel fetching to reduce loading times.
   */
  async getWorldContent(worldName) {
    try {
      const [productsReq, guidesReq] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('world', worldName)
          .order('created_at', { ascending: false }),
        supabase
          .from('guides')
          .select('*')
          .eq('world', worldName)
          .order('created_at', { ascending: false })
      ])

      if (productsReq.error) throw productsReq.error
      if (guidesReq.error) throw guidesReq.error

      return {
        products: productsReq.data || [],
        guides: guidesReq.data || [],
        error: null
      }
    } catch (err) {
      console.error('Content Fetch Error:', err.message)
      return { products: [], guides: [], error: err.message }
    }
  },

  /**
   * Toggles a user's bookmark on a specific guide.
   * Expert Tip: This uses an array-based approach in Supabase to track IDs.
   * * @param {string} guideId - The ID of the guide to bookmark
   * @param {string} userId - The ID of the current user
   * @param {Array} currentBookmarks - The existing list of user IDs who bookmarked it
   */
  async toggleBookmark(guideId, userId, currentBookmarks = []) {
    try {
      const isBookmarked = currentBookmarks.includes(userId)
      
      // Simplify Conditionals: Determine the new array state
      const updatedBookmarks = isBookmarked
        ? currentBookmarks.filter(id => id !== userId)
        : [...new Set([...currentBookmarks, userId])]

      const { error } = await supabase
        .from('guides')
        .update({ bookmarked_by: updatedBookmarks })
        .eq('id', guideId)

      if (error) throw error

      return { success: true, isBookmarked: !isBookmarked }
    } catch (err) {
      console.error('Bookmark Error:', err.message)
      return { success: false, error: err.message }
    }
  },

  /**
   * Fetches a single product by ID (Useful for ProductDetails page).
   */
  async getProductById(productId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()
        
      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }
}
