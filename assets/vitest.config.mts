import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['__tests__/**/*.test.ts'],
    exclude: ['node_modules', 'public']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.')
    }
  }
});
