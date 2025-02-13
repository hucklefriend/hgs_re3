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
                //'resources/js/editor/network-editor.js',
                //'resources/js/editor/main-network-editor.js',
                'resources/js/viewer/sub-network-worker.js' // ワーカースクリプトを追加
            ],
            refresh: true,
        }),
    
      {
        name: 'add-custom-headers',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
            res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            next();
          });
        }
      }
    ], 
    server: {
        host: true,
        hmr: {
            host: 'localhost'
        },
        headers: {
            'Cross-Origin-Embedder-Policy': 'require-corp',
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Resource-Policy': 'cross-origin',
            'Cross-Origin-Isolation': 'same-origin'
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
