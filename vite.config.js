import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

const basePath = process.env.VITE_BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  base: basePath,
  logLevel: 'info',
  plugins: [
    react()
  ],
  server: {
    host: true,
    allowedHosts: [
      '.trycloudflare.com',
    ],
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },
  preview: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});