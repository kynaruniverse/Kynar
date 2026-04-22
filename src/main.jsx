import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/**
 * 2026 Multiverse App Entry Point
 * * NOTE: To ensure the World Themes look correct, ensure the following 
 * fonts are imported in your index.html or via @import in index.css:
 * - Playfair Display (Haven)
 * - JetBrains Mono (Tools)
 * - Poppins (Oasis)
 * - Space Grotesk (Nexus)
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
