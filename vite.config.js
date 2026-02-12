import { defineConfig } from 'vite';
import path from 'path';

// Toggle build behavior based on environment.
// - LOCAL_DEV=true  -> bundle everything (useful for local testing)
// - LOCAL_DEV!=true -> keep certain deps external (Liferay provides them via import maps)
const local = process.env.LOCAL_DEV === 'true';

export default defineConfig({
    plugins: [],
    build: {
        rollupOptions: {
            // Multiple entrypoints => produces multiple top-level bundles.
            // These names become the output filenames via entryFileNames below.
            input: {
				'flow-editor': path.resolve(__dirname, 'src/graph-editor-index.jsx'),
				'flow-navigator': path.resolve(__dirname, 'src/graph-navigator-index.jsx'),
            },
            // Dependencies listed here are NOT bundled into the output.
            // The emitted JS will keep imports like `import React from 'react'`.
            // In Liferay, these are expected to be resolved by the page's import map.
            external: local
                ? []  
                : [
                    '@clayui/*',
                    'react',
                    'react-dom',
                    'react-oidc-context',
                    'react-scripts'
                ],
            output: {
                // Entry bundle filenames, e.g. assets/flow-editor-<hash>.js
                entryFileNames: 'assets/[name]-[hash].js',
                // Shared code-split chunks, e.g. assets/chunk-<hash>.js
                chunkFileNames: 'assets/[name]-[hash].js',
                // Non-JS assets emitted by Vite/Rollup (CSS, images, fonts, etc.)
                assetFileNames: (assetInfo) => {
                    const name = assetInfo.name ?? 'asset';
                    const ext = path.extname(name);
                    const base = path.basename(name, ext);
                    return `assets/${base}-[hash][extname]`;
                },
            },
        },
        // Where `vite build` writes its output.
        // This is later packaged by the Liferay client extension build into the `static/` folder.
        outDir: path.resolve(__dirname, 'build/static'),
        // Clean the output folder before each build so old hashed files don't linger.
        emptyOutDir: true,
        // Put emitted assets under build/static/assets/
        assetsDir: 'assets',
    }
});