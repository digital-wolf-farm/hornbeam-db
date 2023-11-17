import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: [
            './src/index.spec.ts',
            './src/**/*.spec.ts'
        ],
        coverage: {
            clean: true,
            provider: 'istanbul'
        },
        environment: 'node'
    }
});
