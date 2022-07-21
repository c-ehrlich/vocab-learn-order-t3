// src/server/router/index.ts
import { t } from '../utils';
import { vocabRouter } from '../../resource/vocab/vocab.router';

export const appRouter = t.router({
  vocab: vocabRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
