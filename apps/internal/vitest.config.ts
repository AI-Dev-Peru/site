import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        server: {
            deps: {
                inline: ['@testing-library/react', '@testing-library/dom'],
            },
        },
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
            "react": resolve(__dirname, "node_modules/react"),
            "react-dom": resolve(__dirname, "node_modules/react-dom"),
        },
        conditions: ['browser', 'development', 'default'],
    },
})
