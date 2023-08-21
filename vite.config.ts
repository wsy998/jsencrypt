/// <reference types="vitest" />
import {defineConfig} from "vitest/config";
import {resolve} from "path"

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'jsencrypt',
            fileName: (format) => `jsencrypt.${format}.js`,
        },
        outDir: "dist"
    },
    test: {}
})