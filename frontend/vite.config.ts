import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import path from 'path'
import { defineConfig } from 'vite'

// Read package.json to get version
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
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
