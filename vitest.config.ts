/// <reference types="vitest" />
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    exclude: ['tests/e2e/**', 'tests/visual/**', 'node_modules/**', '.next/**'],
    fileParallelism: false,
    globals: true,
    maxWorkers: 1,
    pool: 'threads',
    setupFiles: ['./config/setupTests.ts'],
  },
});
