import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // react-mathquill (MathQuill) expects Node's `global`; map it to the browser globalThis
  define: {
    global: 'globalThis',
  },
})
