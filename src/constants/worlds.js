/**
 * World Configuration & Metadata
 * This serves as the style guide and structural definition for the 4 Worlds.
 */

export const WORLD_TYPES = {
  HAVEN: 'Home Haven',
  TOOLS: 'Tools Realm',
  OASIS: 'Lifestyle Oasis',
  NEXUS: 'Creative Nexus',
}

export const WORLD_CONFIG = {
  [WORLD_TYPES.HAVEN]: {
    name: 'Home Haven',
    slug: 'home-haven',
    tagline: 'Craft your sanctuary.',
    vibe: 'Calm, cozy, organized',
    themeClass: 'world-haven',
    fontFamily: 'font-playfair', // Serif for elegance
    colors: {
      primary: '#9CCAA0',
      secondary: '#D4ADCF',
      base: '#F5EFE6',
      text: '#2F2F2F',
      surface: '#FFFFFF',
      border: '#E8E2D9',
      gradient: 'from-[#F5EFE6] to-[#E8E2D9]',
    },
    description: 'Your sanctuary for home organization, decor inspiration, and cozy living essentials.',
    icon: '🏠',
    categories: ['Organization', 'Decor', 'Essentials', 'Guides'],
  },
  
  [WORLD_TYPES.TOOLS]: {
    name: 'Tools Realm',
    slug: 'tools-realm',
    tagline: 'Engineered for precision.',
    vibe: 'Precision, power, technical',
    themeClass: 'world-tools',
    fontFamily: 'font-jetbrains', // Monospace for technical feel
    colors: {
      primary: '#22D3EE',
      secondary: '#818CF8',
      base: '#F8FAFC',
      text: '#0F172A',
      surface: '#FFFFFF',
      border: '#CBD5E1',
      gradient: 'from-[#F8FAFC] to-[#F1F5F9]',
    },
    description: 'Professional-grade tools, productivity software, and technical resources for creators.',
    icon: '🛠️',
    categories: ['Software', 'Plugins', 'Templates', 'Documentation'],
  },
  
  [WORLD_TYPES.OASIS]: {
    name: 'Lifestyle Oasis',
    slug: 'lifestyle-oasis',
    tagline: 'Balance in motion.',
    vibe: 'Balanced, fresh, mindful',
    themeClass: 'world-oasis',
    fontFamily: 'font-poppins', // Clean sans-serif for wellness
    colors: {
      primary: '#A8E6CF',
      secondary: '#FFD3B6',
      base: '#FAF7F0',
      text: '#2F2F2F',
      surface: '#FFFFFF',
      border: '#EBE8E0',
      gradient: 'from-[#FAF7F0] to-[#F2EFE7]',
    },
    description: 'Wellness, fitness, mindfulness, and lifestyle products for balanced living.',
    icon: '🌿',
    categories: ['Wellness', 'Fitness', 'Mindfulness', 'Nutrition'],
  },
  
  [WORLD_TYPES.NEXUS]: {
    name: 'Creative Nexus',
    slug: 'creative-nexus',
    tagline: 'Where ideas collide.',
    vibe: 'Expressive, bold, inventive',
    themeClass: 'world-nexus',
    fontFamily: 'font-spaceGrotesk', // Bold, quirky for creativity
    colors: {
      primary: '#9B5DE5',
      secondary: '#F15BB5',
      base: '#F9F9F9',
      text: '#0D0221',
      surface: '#FFFFFF',
      border: '#E5E5E5',
      gradient: 'from-[#F9F9F9] to-[#F3F3F3]',
    },
    description: 'Digital art, creative assets, design resources, and inspiration for artists.',
    icon: '🎨',
    categories: ['Digital Art', 'Design Assets', 'Tutorials', 'Inspiration'],
  },
}

/**
 * HELPER FUNCTIONS
 * Abstracting data retrieval to keep components clean.
 */

// Get world config by the URL slug (e.g., 'home-haven')
export const getWorldBySlug = (slug) => {
  return Object.values(WORLD_CONFIG).find(world => world.slug === slug)
}

// Get world config by the display name (e.g., 'Home Haven')
export const getWorldByName = (name) => {
  return WORLD_CONFIG[name] || null
}

// Returns an array of all world configurations
export const getAllWorlds = () => Object.values(WORLD_CONFIG)
