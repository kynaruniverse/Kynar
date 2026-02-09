/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        jetbrains: ['JetBrains Mono', 'monospace'],
        poppins: ['Poppins', 'sans-serif'],
        spaceGrotesk: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        // Home Haven
        haven: {
          base: '#F5EFE6',
          accent: '#9CCAA0',
          text: '#2F2F2F',
          dark: '#1A1612',
        },
        // Tools Realm
        tools: {
          base: '#F8FAFC',
          accent: '#22D3EE',
          text: '#0F172A',
          dark: '#020617',
          border: '#CBD5E1',
        },
        // Lifestyle Oasis
        oasis: {
          base: '#FAF7F0',
          mint: '#A8E6CF',
          sky: '#70CFFF',
          clay: '#D9966C',
          text: '#2F2F2F',
          dark: '#0F170A',
        },
        // Creative Nexus
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
        'haven': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        'tools': 'none',
        'oasis': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'nexus': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'tap': 'tap 75ms ease-in-out',
      },
      keyframes: {
        tap: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
        },
      },
    },
  },
  plugins: [],
}
