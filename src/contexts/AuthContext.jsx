import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { supabase } from '@lib/supabase'
import { userService } from '@services/userService'
import { flushPendingAlignment } from '@services/alignmentService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  /**
   * Orchestrates profile fetching and local state sync
   */
  const syncUserProfile = async (userId) => {
    if (!userId) {
      setProfile(null)
      return
    }
    const { data } = await userService.getUserProfile(userId)
    setProfile(data)
  }

  useEffect(() => {
    // 1. Initialize Session
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) await syncUserProfile(currentUser.id)
      setLoading(false)
    }

    initSession()

    // 2. Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (event === 'SIGNED_IN') {
        // Flush any anonymous quiz attempt taken before sign-in so the user
        // walks away with their identity already saved on first login.
        if (currentUser?.id) await flushPendingAlignment(currentUser.id)
        await syncUserProfile(currentUser?.id)
      } else if (event === 'SIGNED_OUT') {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const authActions = {
    signUp: async (email, password, username) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      })

      if (!error && data.user) {
        // Use our service layer instead of direct DB calls here
        await userService.createProfile(data.user.id, email, username)
      }
      return { data, error }
    },

    signIn: async (email, password) => {
      return await supabase.auth.signInWithPassword({ email, password })
    },

    signOut: async () => {
      return await supabase.auth.signOut()
    },

    // Refresh the local profile state (e.g., after a purchase)
    refreshProfile: () => syncUserProfile(user?.id)
  }

  // Memoize value to prevent unnecessary re-renders of children
  const value = useMemo(() => ({
    user,
    profile,
    loading,
    ...authActions
  }), [user, profile, loading])

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
