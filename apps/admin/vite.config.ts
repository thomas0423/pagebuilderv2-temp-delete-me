import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiTarget = 'http://127.0.0.1:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        // AI generation can take a while; default proxy timeout is too short / flaky.
        timeout: 180_000,
        proxyTimeout: 180_000,
      },
      '/storage': {
        target: apiTarget,
        changeOrigin: true,
        timeout: 60_000,
        proxyTimeout: 60_000,
      },
      '/preview': {
        target: apiTarget,
        changeOrigin: true,
      },
      // IMPORTANT: use '/p/' (trailing slash). Plain '/p' also matches SPA /pages/*
      '/p/': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
})
