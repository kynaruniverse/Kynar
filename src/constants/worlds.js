// World Configuration & Metadata
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
    vibe: 'Calm, cozy, organized',
    themeClass: 'world-haven',
    fontFamily: 'font-playfair',
    colors: {
      base: '#F5EFE6',
      accent: '#9CCAA0',
      text: '#2F2F2F',
      dark: '#1A1612',
    },
    description: 'Your sanctuary for home organization, decor inspiration, and cozy living essentials.',
    icon: '🏠',
    categories: ['Organization', 'Decor', 'Essentials', 'Guides'],
  },
  
  [WORLD_TYPES.TOOLS]: {
    name: 'Tools Realm',
    slug: 'tools-realm',
    vibe: 'Precision, power, technical',
    themeClass: 'world-tools',
    fontFamily: 'font-jetbrains',
    colors: {
      base: '#F8FAFC',
      accent: '#22D3EE',
      text: '#0F172A',
      dark: '#020617',
      border: '#CBD5E1',
    },
    description: 'Professional-grade tools, productivity software, and technical resources for creators.',
    icon: '🛠️',
    categories: ['Software', 'Plugins', 'Templates', 'Documentation'],
  },
  
  [WORLD_TYPES.OASIS]: {
    name: 'Lifestyle Oasis',
    slug: 'lifestyle-oasis',
    vibe: 'Balanced, fresh, mindful',
    themeClass: 'world-oasis',
    fontFamily: 'font-poppins',
    colors: {
      mint: '#A8E6CF',
      sky: '#70CFFF',
      clay: '#D9966C',
      base: '#FAF7F0',
      text: '#2F2F2F',
      dark: '#0F170A',
    },
    description: 'Wellness, fitness, mindfulness, and lifestyle products for balanced living.',
    icon: '🌿',
    categories: ['Wellness', 'Fitness', 'Mindfulness', 'Nutrition'],
  },
  
  [WORLD_TYPES.NEXUS]: {
    name: 'Creative Nexus',
    slug: 'creative-nexus',
    vibe: 'Expressive, bold, inventive',
    themeClass: 'world-nexus',
    fontFamily: 'font-spaceGrotesk',
    colors: {
      purple: '#9B5DE5',
      magenta: '#F15BB5',
      teal: '#00BBF9',
      base: '#F9F9F9',
      text: '#0D0221',
      dark: '#0D0221',
    },
    description: 'Digital art, creative assets, design resources, and inspiration for artists.',
    icon: '🎨',
    categories: ['Digital Art', 'Design Assets', 'Tutorials', 'Inspiration'],
  },
}

// Helper function to get world config by slug
export const getWorldBySlug = (slug) => {
  return Object.values(WORLD_CONFIG).find(world => world.slug === slug)
}

// Helper function to get world config by name
export const getWorldByName = (name) => {
  return WORLD_CONFIG[name]
}
