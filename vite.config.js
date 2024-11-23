import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { resolve } from 'node:path'

console.log(__dirname);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "./src") }]
  },
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173, // Use the desired port
    strictPort: true, // Ensure the specified port is used
  }
})
