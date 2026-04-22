import { supabase } from '@lib/supabase'

/**
 * userService handles all database interactions for User profiles, 
 * transactions, and product ownership.
 */
export const userService = {
  
  /**
   * Fetches a user profile from the 'users' table.
   */
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (err) {
      console.error('Error fetching profile:', err.message)
      return { data: null, error: err }
    }
  },

  /**
   * Creates a new entry in the 'users' table upon sign-up.
   */
  async createProfile(id, email, username) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ id, email, username, saved_products: [] }])
        .select()
        .single()
        
      if (error) throw error
      return { data, error: null }
    } catch (err) {
      console.error('Error creating profile:', err.message)
      return { data: null, error: err }
    }
  },

  /**
   * Fetches the full content for a user's library (Products + Bookmarks).
   * Uses Promise.all for parallel fetching to optimize performance.
   */
  async getUserLibraryData(userId, savedProductIds = []) {
    try {
      const [productsReq, guidesReq] = await Promise.all([
        // Fetch products only if the user owns some
        savedProductIds.length > 0 
          ? supabase.from('products').select('*').in('id', savedProductIds)
          : Promise.resolve({ data: [], error: null }),
        
        // Fetch guides where the user ID exists in the bookmarked_by array
        supabase.from('guides').select('*').contains('bookmarked_by', [userId])
      ])

      if (productsReq.error) throw productsReq.error
      if (guidesReq.error) throw guidesReq.error

      return {
        products: productsReq.data || [],
        guides: guidesReq.data || [],
        error: null
      }
    } catch (err) {
      console.error('Library Fetch Error:', err.message)
      return { products: [], guides: [], error: err.message }
    }
  },

  /**
   * Checks if a user has already purchased a specific product.
   */
  async checkOwnership(userId, productId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('saved_products')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data?.saved_products?.includes(productId) || false
    } catch (err) {
      console.error('Ownership Check Error:', err.message)
      return false
    }
  },

  /**
   * Fulfils a purchase by recording the transaction and updating 
   * the user's library.
   */
  async fulfillPurchase(userId, productId) {
    try {
      // 1. Record the transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert([{ 
          user_id: userId, 
          product_id: productId, 
          payment_status: 'Completed' 
        }])

      if (txError) throw txError

      // 2. Fetch current library
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('saved_products')
        .eq('id', userId)
        .single()

      if (fetchError) throw fetchError

      // 3. Update library with unique values
      const currentProducts = user?.saved_products || []
      const updatedLibrary = [...new Set([...currentProducts, productId])]

      const { error: updateError } = await supabase
        .from('users')
        .update({ saved_products: updatedLibrary })
        .eq('id', userId)

      if (updateError) throw updateError
      return { success: true }
    } catch (err) {
      console.error('Fulfillment Error:', err.message)
      return { success: false, error: err.message }
    }
  },

  /**
   * Retrieves all transactions for a specific user, including product details.
   */
  async getUserTransactions(userId) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching transactions:', err.message)
      return []
    }
  }
}
