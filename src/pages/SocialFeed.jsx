import { useNavigate } from 'react-router-dom'

const SocialFeed = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="base-button bg-gray-900 text-white mb-6"
        >
          ← Back to Hub
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4">Social Feed</h1>
          <p className="text-gray-500 mb-6">
            This page will display posts with world filtering, likes, and comments.
            To be implemented in Phase 5.
          </p>
          
          <div className="bg-gray-100 rounded-lg p-12 text-center text-gray-400">
            No posts yet
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialFeed
