import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: [
            './e2e/**/*.spec.ts'
        ],
        coverage: {
            clean: true,
            provider: 'istanbul'
        },
        environment: 'node'
    }
});
