import { initTRPC } from "@trpc/server";
import type { Context } from "./context";
import superjson from "superjson";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createRouter = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
