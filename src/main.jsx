import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from '@components/ErrorBoundary'
import './index.css'

/**
 * 4 Worlds — App Entry Point
 * Wraps the entire tree in a top-level ErrorBoundary so render-time errors
 * never blank the screen on production.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
