import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    // Ensure assets are inlined
    assetsInlineLimit: 100000000,
    // Configure rollup options without manualChunks
    rollupOptions: {
      output: {
        // Remove manualChunks as it conflicts with inlineDynamicImports
        inlineDynamicImports: true
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  plugins: [viteSingleFile()],
});