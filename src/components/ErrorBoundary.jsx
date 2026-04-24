import { Component } from 'react'

/**
 * ErrorBoundary
 * Top-level boundary so a runtime error in any child does NOT blank the entire
 * app. We only catch render-time errors here — Supabase async errors are
 * handled in their own services with try/catch.
 */
class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // In production this is where we'd ship to Sentry / Logflare / etc.
    console.error('[ErrorBoundary]', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.assign('/')
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06060b] text-white px-6">
        <div className="max-w-md text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-4">
            Something broke
          </p>
          <h1 className="text-4xl font-black tracking-tighter mb-4">
            The multiverse glitched.
          </h1>
          <p className="text-white/55 mb-8 leading-relaxed">
            An unexpected error occurred. We&apos;ve logged it and the team has
            been notified. Try heading back to the hub.
          </p>
          <button
            onClick={this.handleReset}
            className="px-6 py-3 rounded-full bg-white text-[#06060b] text-sm font-black hover:scale-[1.02] transition-transform"
          >
            Back to the Hub
          </button>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-8 p-4 rounded-2xl bg-white/5 text-left text-[11px] text-white/60 overflow-auto max-h-64">
              {String(this.state.error?.stack || this.state.error)}
            </pre>
          )}
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
