import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'abba39edb982a4cfebf55f1163ae2083-575612856.ap-south-1.elb.amazonaws.com'
    ],
    hmr: {
      overlay: false
    }
  }
})
