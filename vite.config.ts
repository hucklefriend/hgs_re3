import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import type { UserConfig } from 'vite';
import tailwindcss from "tailwindcss";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.scss'
            ],
            refresh: true,
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",
            }
        }
    },
    postcss: {
        plugins: [tailwindcss()],
    },
    server: {
        hmr: {
            host: 'localhost'
        }
    },
    build: {
        rollupOptions: {
            output: {
                format: 'es'
            }
        }
    }
} as UserConfig); 