import { useNavigate } from 'react-router-dom'

const UserLibrary = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="base-button bg-gray-900 text-white mb-6"
        >
          ← Back to Hub
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4">My Library</h1>
          <p className="text-gray-500 mb-6">
            This page will display your saved products and bookmarked guides.
            To be implemented in Phase 4.
          </p>
          
          <div className="space-y-4">
            <section>
              <h2 className="text-xl font-semibold mb-3">Purchased Products</h2>
              <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-400">
                No products yet
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Bookmarked Guides</h2>
              <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-400">
                No bookmarks yet
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLibrary
