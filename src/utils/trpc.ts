import { createTRPCNext } from "@trpc/next";
import type { inferProcedureInput, inferProcedureOutput, inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../server/trpc/router";
import superjson from "superjson";
import { httpBatchLink } from "@trpc/client";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: superjson,
    };
  },
  ssr: false,
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;