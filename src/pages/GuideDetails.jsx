import { useParams, useNavigate } from 'react-router-dom'

const GuideDetails = () => {
  const { worldName, guideId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(`/worlds/${worldName}`)}
          className="base-button bg-gray-900 text-white mb-6"
        >
          ← Back to {worldName}
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4">Guide Details</h1>
          <p className="text-gray-600 mb-4">Guide ID: {guideId}</p>
          <p className="text-gray-500">
            This page will display full guide content with bookmark functionality.
            To be implemented in Phase 3.
          </p>
        </div>
      </div>
    </div>
  )
}

export default GuideDetails
