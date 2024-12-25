import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.js',
        'src/main.jsx',
        'src/App.jsx',
        'vitest.config.js',
        'vite.config.js',
        'eslint.config.js',
        '**/*.test.*',
        '**/__tests__/**'
      ],
      all: true,
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}) 