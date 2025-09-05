import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    { enforce: 'pre', ...mdx() },
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Memoria de Bajo Nivel',
        short_name: 'Memoria',
        start_url: '/',
        display: 'standalone',
        theme_color: '#0ea5e9',
        background_color: '#ffffff'
      }
    }),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br', deleteOriginFile: false })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          state: ['xstate', 'zustand']
        }
      }
    }
  }
})
