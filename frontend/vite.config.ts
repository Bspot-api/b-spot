import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Optimisation des assets statiques
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Garder les noms originaux pour les icônes
          if (assetInfo.name && assetInfo.name.match(/\.(ico|png|svg)$/)) {
            return assetInfo.name;
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  // Configuration des assets publics
  publicDir: 'public',
})
