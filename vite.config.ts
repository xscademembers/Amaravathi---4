import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const metaPixelId = env.VITE_META_PIXEL_ID || '';
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'html-env-replace',
        transformIndexHtml(html) {
          return html.replace(/%VITE_META_PIXEL_ID%/g, metaPixelId);
        },
      },
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('motion') || id.includes('framer-motion')) return 'motion';
              if (id.includes('lucide-react')) return 'icons';
              if (id.includes('react-dom') || id.includes('react-router')) return 'react-vendor';
            }
          },
        },
      },
      cssMinify: true,
      minify: 'esbuild',
      target: 'es2020',
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  };
});
