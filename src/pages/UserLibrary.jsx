import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { WORLD_CONFIG } from '../constants/worlds'
import ProductCard from '../components/ProductCard'
import GuideCard from '../components/GuideCard'

const UserLibrary = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [userProfile, setUserProfile] = useState(null)
  const [purchasedProducts, setPurchasedProducts] = useState([])
  const [bookmarkedGuides, setBookmarkedGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('products') // 'products' or 'guides'

  useEffect(() => {
    if (!user) {
      // Redirect to home if not authenticated
      navigate('/')
      return
    }
    
    fetchUserLibrary()
  }, [user])

  const fetchUserLibrary = async () => {
    setLoading(true)
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError
      setUserProfile(profile)

      // Fetch purchased products
      if (profile.saved_products && profile.saved_products.length > 0) {
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', profile.saved_products)

        if (productsError) throw productsError
        setPurchasedProducts(products || [])
      }

      // Fetch bookmarked guides
      const { data: guides, error: guidesError } = await supabase
        .from('guides')
        .select('*')
        .contains('bookmarked_by', [user.id])

      if (guidesError) throw guidesError
      setBookmarkedGuides(guides || [])

    } catch (error) {
      console.error('Error fetching user library:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get world config for a product/guide
  const getWorldConfig = (worldName) => {
    return Object.values(WORLD_CONFIG).find(w => w.name === worldName)
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Library</h1>
          <p className="text-gray-600">
            Your purchased products and bookmarked guides
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'products'
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Purchased Products ({purchasedProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'guides'
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Bookmarked Guides ({bookmarkedGuides.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your library...</p>
          </div>
        ) : (
          <>
            {/* Purchased Products Tab */}
            {activeTab === 'products' && (
              <div>
                {purchasedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchasedProducts.map((product) => {
                      const world = getWorldConfig(product.world)
                      return world ? (
                        <ProductCard 
                          key={product.id} 
                          product={product} 
                          world={world}
                        />
                      ) : null
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Browse the worlds and find products you love!
                    </p>
                    <button
                      onClick={() => navigate('/')}
                      className="base-button bg-gray-900 text-white px-8"
                    >
                      Explore Worlds
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bookmarked Guides Tab */}
            {activeTab === 'guides' && (
              <div>
                {bookmarkedGuides.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookmarkedGuides.map((guide) => {
                      const world = getWorldConfig(guide.world)
                      return world ? (
                        <GuideCard 
                          key={guide.id} 
                          guide={guide} 
                          world={world}
                        />
                      ) : null
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                    <div className="text-6xl mb-4">📑</div>
                    <h3 className="text-xl font-semibold mb-2">No Bookmarks Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Save guides you want to read later!
                    </p>
                    <button
                      onClick={() => navigate('/')}
                      className="base-button bg-gray-900 text-white px-8"
                    >
                      Explore Guides
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Stats Section */}
        {!loading && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {purchasedProducts.length}
              </div>
              <div className="text-sm text-gray-600">Products Owned</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {bookmarkedGuides.length}
              </div>
              <div className="text-sm text-gray-600">Guides Bookmarked</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ${purchasedProducts.reduce((sum, p) => sum + parseFloat(p.price || 0), 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserLibrary
