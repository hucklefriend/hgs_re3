import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/ts/app.ts'
                // 'resources/css/head.css',
                // 'resources/css/node.css',
                // 'resources/js/app.js',
                // 'resources/js/editor/network-editor.js',
                // 'resources/js/editor/main-network-editor.js',
                // 'resources/js/viewer/sub-network-worker.js' // ワーカースクリプトを追加
            ],
            refresh: true,
        }),
    ], 
    build: {
        rollupOptions: {
            output: {
                format: 'es'
            }
        }
    }
});