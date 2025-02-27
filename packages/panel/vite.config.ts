import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command, mode }) => {
    return ({
        plugins: [
            react(),
            tailwindcss(),
            // Add visualizer when analyze flag is present
            //   debug && visualizer({
            //     open: true,
            //     filename: 'dist/stats.html',
            //     gzipSize: true,
            //     brotliSize: true,
            //   })
        ],//.filter(Boolean),
        // optimizeDeps: {
        //     include: ['react/jsx-runtime'],
        // },
        server: {
            port: 3008,
            base: '/panel/'
        },
        resolve: {
            alias: {
                '@': resolve(__dirname, './src')
            }
        },
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true
                },
                scss: {
                    // scss options if needed
                }
            }
        },
        build: {
            outDir: 'dist',
            sourcemap: mode === 'development',
            minify: mode === 'production',
            terserOptions: mode === 'production' ? {
                compress: true,
                mangle: true,
            } : {},
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'index.html')
                },
                output: {
                    assetFileNames: 'assets/[name]-[hash][extname]'
                }
            },
            commonjsOptions: {
                include: ['../utils/**', '../api/**', /node_modules/],
                restrictRequires: 'auto',
                maxParallelFileops: 100
            }
        },
        base: '/panel/'
    })
});