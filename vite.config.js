import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/css/head.css',
                'resources/css/node.css',
                'resources/js/app.js',
                'resources/js/editor/network-editor.js',
                'resources/js/editor/main-network-editor.js',
                'resources/js/viewer/sub-network-worker.js' // ワーカースクリプトを追加
            ],
            refresh: true,
        }),
    ], 
    server: {
        host: true,
        hmr: {
            host: 'localhost'
        },
        origin: 'http://localhost:5173' // ここを追加
    },
    build: {
        rollupOptions: {
            output: {
                format: 'es'
            }
        }
    }
});
