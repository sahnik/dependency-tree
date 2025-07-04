import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for assets
  build: {
    // Inline all assets to avoid CORS issues
    assetsInlineLimit: 100000000, // 100MB - effectively inline everything
    chunkSizeWarningLimit: 2000, // 2MB limit - ELK is a large library
    rollupOptions: {
      output: {
        // Single file output
        inlineDynamicImports: true,
        manualChunks: undefined,
      }
    }
  }
})