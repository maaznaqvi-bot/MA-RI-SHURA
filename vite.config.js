import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // FIX: Code splitting — vendor libs cached separately from app code
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-d3':    ['d3'],
          'vendor-genai': ['@google/genai'],
        }
      }
    },
    // Ensure minification is on
    minify: 'esbuild',
    // Warn when any chunk exceeds 400kb
    chunkSizeWarningLimit: 400,
  }
})
