import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 60000,
    reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : ['verbose'],
    setupFiles: ['./vitest.setup.ts'], // <---- adicione essa linha
    coverage: {
      include: ['src/modules/**/services/*.ts'],
      reporter: ['html', 'lcov', 'text'],
      reportsDirectory: './coverage',
    },
    alias: [
      { find: '@config', replacement: path.resolve(__dirname, './src/config') },
      { find: '@constants', replacement: path.resolve(__dirname, './src/constants') },
      { find: '@modules', replacement: path.resolve(__dirname, './src/modules') },
      { find: '@shared', replacement: path.resolve(__dirname, './src/shared') },
    ],
  },
});
