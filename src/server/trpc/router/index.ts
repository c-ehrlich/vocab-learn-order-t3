import { vocabRouter } from "../../resource/vocab/vocab.router";
import { createRouter } from "../utils";

export const appRouter = createRouter({
  vocab: vocabRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
