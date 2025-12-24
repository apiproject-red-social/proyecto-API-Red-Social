import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Apunta al archivo que acabamos de crear
    setupFiles: ['./src/__tests__/setup.ts'],
    // Desactiva el paralelismo de archivos para evitar que dos archivos
    // hagan TRUNCATE al mismo tiempo en la misma DB de Docker
    fileParallelism: false,
    pool: 'forks',
    poolOptions: {
      forks: {
        isolate: false,
      },
    },
  },
});
