import { useNavigate } from 'react-router-dom'
import useDocumentMeta from '@lib/useDocumentMeta'

const NotFound = () => {
  const navigate = useNavigate()

  useDocumentMeta({
    title: 'Lost in the multiverse · 4 Worlds',
    description: 'The page you’re looking for has slipped into another world.',
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#06060b] text-white px-6">
      <div className="max-w-md text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-4">
          404
        </p>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-5">
          Wrong world.
        </h1>
        <p className="text-white/55 mb-10 leading-relaxed">
          That page doesn&apos;t exist here. Maybe it lives in a different one
          of the four — or maybe the link is broken.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full bg-white text-[#06060b] text-sm font-black hover:scale-[1.02] transition-transform"
          >
            Back to the Hub
          </button>
          <button
            onClick={() => navigate('/quiz')}
            className="px-6 py-3 rounded-full border border-white/20 text-white/85 text-sm font-bold hover:border-white/50 transition-colors"
          >
            Take the quiz
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
