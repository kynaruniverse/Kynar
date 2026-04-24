import { supabase } from '@lib/supabase'

/**
 * userService — read/write helpers for the `users` (profile) table.
 *
 * Phase 2 scope: identity only. Library / transactions / ownership helpers
 * have been removed because their underlying tables (products, guides,
 * transactions) are not part of the schema yet. They will return when those
 * subsystems are designed and migrated.
 */
export const userService = {
  /**
   * Fetches a user profile from the `users` table.
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

  // NOTE: profile creation is handled in Postgres by the
  // `on_auth_user_created` trigger (see supabase_phase1_identity.sql).
  // No client-side createProfile is needed.

  /**
   * Update mutable profile fields. RLS guarantees a user can only update
   * their own row. Returns { data, error }.
   */
  async updateProfile(userId, fields) {
    try {
      const allowed = ['display_name', 'bio']
      const payload = Object.fromEntries(
        Object.entries(fields).filter(([k]) => allowed.includes(k))
      )
      const { data, error } = await supabase
        .from('users')
        .update(payload)
        .eq('id', userId)
        .select()
        .single()
      if (error) throw error
      return { data, error: null }
    } catch (err) {
      console.error('updateProfile error:', err.message)
      return { data: null, error: err }
    }
  },
}
