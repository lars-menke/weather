import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      base: '/weather/',
      includeAssets: ['apple-touch-icon.png', 'favicon-32.png', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'FrogWeather',
        short_name: 'FrogWeather',
        description: 'FrogWeather – Der Wetterfrosch fürs iPhone',
        start_url: '/weather/',
        scope: '/weather/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#d4e3ff',
        theme_color: '#0060ac',
        icons: [
          {
            src: '/weather/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/weather/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'gstatic-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'weather-api-cache', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 30 } },
          },
          {
            urlPattern: /^https:\/\/geocoding-api\.open-meteo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'geocoding-api-cache', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 } },
          },
        ],
      },
    }),
  ],
  base: '/weather/',
})
