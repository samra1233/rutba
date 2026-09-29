import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import express from 'express';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'serve-uploads',
        configureServer(server) {
          const uploadsDir = path.resolve(__dirname, '..', 'uploads');
          server.middlewares.use('/uploads', express.static(uploadsDir));
          const legacyDir = path.resolve(__dirname, '..', 'dist/uploads');
          if (fs.existsSync(legacyDir)) {
            server.middlewares.use('/uploads', express.static(legacyDir));
          }
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        }
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/zariha_db.json']
      },
    },
  };
});
