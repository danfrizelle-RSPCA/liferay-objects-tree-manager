import { defineConfig } from 'vite';
import path from 'path';

const local = process.env.LOCAL_DEV === 'true';

export default defineConfig({
    plugins: [],
    build: {
        rollupOptions: {
            input: {
				editor: path.resolve(__dirname, 'src/graph-editor-index.jsx'),
				navigator: path.resolve(__dirname, 'src/graph-navigator-index.jsx'),
            },
            external: local
                ? []  
                : [
                    '@clayui/*',
                    'react',
                    'react-dom'
                ],
            output: {
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/chunk-[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    const name = assetInfo.name ?? 'asset';
                    const ext = path.extname(name);
                    const base = path.basename(name, ext);
                    return `assets/${base}-[hash][extname]`;
                },
            },
        },
        outDir: path.resolve(__dirname, 'build/static'),
        emptyOutDir: true,
        assetsDir: 'assets',
    }
});