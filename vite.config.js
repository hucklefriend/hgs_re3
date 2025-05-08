"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const laravel_vite_plugin_1 = __importDefault(require("laravel-vite-plugin"));
const tailwindcss_1 = __importDefault(require("tailwindcss"));
exports.default = (0, vite_1.defineConfig)({
    plugins: [
        (0, laravel_vite_plugin_1.default)({
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
        plugins: [(0, tailwindcss_1.default)()],
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
});
