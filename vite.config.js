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