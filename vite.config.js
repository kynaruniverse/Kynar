import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
    },
  },
  server: {
    port: 3000,
    host: true,
    strictPort: true, // Fails if port 3000 is taken, preventing accidental dev on wrong port
  },
  build: {
    rollupOptions: {
      output: {
        // Manual chunking: Splits vendor libraries (React, Supabase) into separate files
        // for better caching and faster initial page loads.
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
})
