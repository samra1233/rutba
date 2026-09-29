import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import express from 'express';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    root: 'client',
    envDir: '..',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'serve-uploads',
        configureServer(server) {
          const uploadsDir = path.resolve(__dirname, 'uploads');
          server.middlewares.use('/uploads', express.static(uploadsDir));
          const legacyDir = path.resolve(__dirname, 'dist/uploads');
          if (fs.existsSync(legacyDir)) {
            server.middlewares.use('/uploads', express.static(legacyDir));
          }
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'client/src'),
      },
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        }
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/rubta_db.json']
      },
    },
  };
});
