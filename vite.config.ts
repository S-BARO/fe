import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl({
      /** name of certification */
      name: 'localhost',
      /** custom trust domains */
      domains: ['localhost', '127.0.0.1'],
      /** custom certification directory */
      certDir: './.devServer/cert',
    }),
  ],
  server: {
    https: true,
  },
})
