import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
    const config = {
        plugins: [
            react(),
            // Add visualizer when analyze flag is present
            //   debug && visualizer({
            //     open: true,
            //     filename: 'dist/stats.html',
            //     gzipSize: true,
            //     brotliSize: true,
            //   })
        ].filter(Boolean),
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
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'index.html')
                }
            }
        },
        base: '/panel/'
    };

    return config;
}); 