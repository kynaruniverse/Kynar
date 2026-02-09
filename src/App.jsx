import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HubPage from './pages/HubPage'
import WorldPage from './pages/WorldPage'
import ProductDetails from './pages/ProductDetails'
import GuideDetails from './pages/GuideDetails'
import UserLibrary from './pages/UserLibrary'
import SocialFeed from './pages/SocialFeed'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Hub - Main landing with 4 WorldCards */}
        <Route path="/" element={<HubPage />} />
        
        {/* World Pages - Dynamic route for all 4 worlds */}
        <Route path="/worlds/:worldName" element={<WorldPage />} />
        
        {/* Product Details */}
        <Route path="/worlds/:worldName/products/:productId" element={<ProductDetails />} />
        
        {/* Guide Details */}
        <Route path="/worlds/:worldName/guides/:guideId" element={<GuideDetails />} />
        
        {/* User Library */}
        <Route path="/library" element={<UserLibrary />} />
        
        {/* Social Feed */}
        <Route path="/social" element={<SocialFeed />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
