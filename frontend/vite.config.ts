import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'NAMMA VOTE — நம்ம வோட்',
        short_name: 'NAMMA VOTE',
        description: "India's Complete Election Intelligence Platform",
        theme_color: '#FF6B35',
        background_color: '#0D1117',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /\/api\/voter\/.*/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'voter-data-cache', expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 } },
          },
          {
            urlPattern: /\/api\/candidates\/.*/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'candidates-cache', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 6 } },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true },
    },
  },
})
