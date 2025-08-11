import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: [
      '78415fc0-b3fa-4076-b948-3887bcdff3d5-00-17jypgvwvajgq.pike.replit.dev'
    ]
  }
})
