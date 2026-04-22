/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Standard UI font
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // World-specific typography
        playfair: ['Playfair Display', 'serif'],
        jetbrains: ['JetBrains Mono', 'monospace'],
        poppins: ['Poppins', 'sans-serif'],
        spaceGrotesk: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        // Home Haven: Earthy and Muted
        haven: {
          base: '#F5EFE6',
          accent: '#9CCAA0',
          text: '#2F2F2F',
          dark: '#1A1612',
        },
        // Tools Realm: Tech and High-Contrast
        tools: {
          base: '#F8FAFC',
          accent: '#22D3EE',
          text: '#0F172A',
          dark: '#020617',
          border: '#CBD5E1',
        },
        // Lifestyle Oasis: Natural and Fresh
        oasis: {
          base: '#FAF7F0',
          mint: '#A8E6CF',
          sky: '#70CFFF',
          clay: '#D9966C',
          text: '#2F2F2F',
          dark: '#0F170A',
        },
        // Creative Nexus: Vibrant and Synthetic
        nexus: {
          base: '#F9F9F9',
          purple: '#9B5DE5',
          magenta: '#F15BB5',
          teal: '#00BBF9',
          text: '#0D0221',
          dark: '#0D0221',
        },
      },
      boxShadow: {
        // Semantic shadows tied to world vibes
        'haven': '0 4px 20px -2px rgba(156, 202, 160, 0.15)',
        'tools': '0 0 0 1px rgba(15, 23, 42, 0.05)',
        'oasis': '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
        'nexus': '0 20px 40px -10px rgba(155, 93, 229, 0.2)',
      },
      borderRadius: {
        'haven': '2.5rem',
        'tools': '0.75rem',
        'oasis': '2rem',
        'nexus': '1.5rem',
      },
      animation: {
        'tap': 'tap 0.1s ease-in-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        tap: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.97)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
  ],
}
