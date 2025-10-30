import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
  plugins: [
    laravel({
      input: [
        'resources/css/app.css',
        'resources/ts/app.ts', // TypeScriptのエントリーポイント
      ],
      refresh: true,
    })
  ],
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      '@': '/resources/js', // tsconfig.jsonと合わせる
    },
  },
});