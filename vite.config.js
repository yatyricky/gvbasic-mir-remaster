import { defineConfig } from 'vite';
import VitePluginRestart from 'vite-plugin-restart';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { execSync } from "child_process";

export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        // Ensure assets are inlined
        assetsInlineLimit: 100000000,
        // Configure rollup options without manualChunks
        rollupOptions: {
            output: {
                // Remove manualChunks as it conflicts with inlineDynamicImports
                inlineDynamicImports: true
            },
        },
    },
    server: {
        port: 3000,
        open: true,
        host: true,
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    plugins: [
        viteSingleFile(),
        VitePluginRestart({
            restart: [
                "../configs/*.xlsx",
            ]
        }),
        {
            name: "gen-config-iden",
            config: () => {
                execSync("node gen_config.js");
            }
        }
    ],
});