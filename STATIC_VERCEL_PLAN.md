# Static Vercel Deployment Plan

## Goal

Convert this repo from:

- Next.js pages app
- tRPC API route
- Prisma + MongoDB
- Vercel server deployment

into:

- static Next.js deployment on Vercel
- no database
- no server runtime
- no tRPC / Prisma dependency at runtime
- dictionary data served as static assets

This keeps the current UI, but removes the backend entirely.

## Why This Fits

The current runtime behavior is simple:

- take a submitted word list
- look up exact matches by `word`
- compute counts for duplicates
- compute weighted rankings
- return `{ words, notFound }`

That logic is currently split across:

- `src/server/resource/vocab/vocab.router.ts`
- `src/server/resource/vocab/vocab.service.ts`
- `src/server/resource/vocab/vocab.util.ts`
- `src/features/search/search-state-handler.tsx`

None of that requires a database if the dictionary is available locally as a static JSON asset.

## Recommended End State

Keep:

- `Next.js`
- `MUI`
- `Jotai`
- current page/component structure

Remove:

- `tRPC`
- `Prisma`
- `MongoDB`
- `/api/trpc`
- all server-only env handling
- React Query if it ends up unused after tRPC removal

This is the lowest-risk path because it preserves most of the current app structure.

## Data Strategy

Use the generated dataset from the old repo as a static asset.

Recommended source:

- `../vocab-learn-order/backend/src/data/words-jmdict.json`

Copy it into this repo as:

- `public/data/words-jmdict.json`

Notes:

- current file size is about 27.4 MiB raw
- this is acceptable for Vercel static hosting
- the app should fetch it once and reuse it in memory

Optional later optimization:

- split into smaller shard files
- or precompute an alternate data structure for faster loading

Do not block the migration on sharding. One static JSON file is fine for the first pass.

## Confirmed Gaps In The Current Repo

The migration is straightforward, but a code inspection shows a few things the
first draft of this plan understated:

- `public/data/words-jmdict.json` does not exist in this repo yet, so the
  static dataset must be copied in before the migration can work end-to-end.
- `tRPC` is currently doing two jobs:
  - fetching learn-order results
  - acting as shared result state via the React Query cache
- removing `trpc.vocab.learnOrder.useQuery(...)` from
  `src/features/search/search-state-handler.tsx` is not enough on its own,
  because other components also read or mutate the cached result:
  - `src/features/app-shell/header.tsx`
  - `src/features/search/word-card.tsx`
  - `src/features/search/word-card-mini.tsx`
- `src/features/search/search-results-layout.tsx` currently gets its types from
  `RouterOutput` in `src/utils/trpc.ts`, so local replacement types are needed
  before `trpc.ts` can be deleted.
- `next.config.mjs` still imports `./src/server/env.mjs`, and
  `package.json` still runs `prisma generate` in `postinstall`. Both must be
  removed before the project is actually static-safe.
- there are no existing tests around lookup/ranking behavior, so the migration
  should add at least a small unit test for normalization and ranking logic to
  reduce regression risk.

## Implementation Plan

### Phase 1: Remove Server Coupling

1. Delete server/runtime-specific code:
   - `src/pages/api/trpc/[trpc].ts`
   - `src/server/**`
   - `prisma/**`

2. Remove server-only imports from config:
   - `next.config.mjs` currently imports `./src/server/env.mjs`
   - remove that import
   - replace config with a pure static-safe Next config

3. Remove env requirements tied to the database:
   - `.env-example`
   - README deployment instructions
   - any `DATABASE_URL` references

### Phase 2: Replace tRPC With Client-Side Lookup

Create a small client-side vocab module, for example:

- `src/features/search/vocab-client.ts`

Responsibilities:

- fetch `/data/words-jmdict.json`
- cache parsed data in module scope
- build a `Map<string, Word>` indexed by `word`
- expose a function like `getLearnOrder({ words, weights })`

Suggested API:

```ts
export async function getLearnOrder(input: {
  words: string[];
  weights: FrequencyListWeights;
}): Promise<{ words: ProcessedWord[]; notFound: string[] }>
```

Suggested internal helpers:

- `loadWordMap()`
- `getWeightedWordRanking()`
- `normalizeSubmittedWords()`
- `buildProcessedWords()`

Reuse logic from:

- `src/server/resource/vocab/vocab.util.ts`
- `src/server/resource/vocab/vocab.router.ts`

Keep the algorithm identical on the first pass.

### Phase 3: Replace Query State With Shared Client State

Update:

- `src/features/search/search-state-handler.tsx`

Replace:

- `trpc.vocab.learnOrder.useQuery(...)`

With:

- local async lookup logic
- async call to `getLearnOrder(...)`

This cannot be implemented as `search-state-handler.tsx` local state alone,
because the current result is also used by:

- `src/features/app-shell/header.tsx` for "save remaining words"
- `src/features/search/word-card.tsx` for deleting found words from the result
- `src/features/search/word-card-mini.tsx` for deleting not-found words from the result

Recommended approach:

- keep async loading/error state in `search-state-handler.tsx`
- store the resolved search result in Jotai so other components can access and
  mutate it without reintroducing React Query

Suggested state shape:

```ts
type SearchStatus =
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "ready"; data: { words: ProcessedWord[]; notFound: string[] } };
```

Implementation notes:

- derive `words` from `searchFieldInput` as you do now
- run the local async lookup when entering the searching state
- keep the current loading and error UI
- add a shared result atom, for example:

```ts
type SearchResult = { words: ProcessedWord[]; notFound: string[] };
```

- update the header and word-card components to read/write that shared result
  instead of the tRPC query cache

### Phase 4: Remove tRPC and React Query Wiring

Delete:

- `src/utils/trpc.ts`

Update:

- `src/pages/_app.tsx`

Remove:

- `trpc.withTRPC(MyApp)`
- `ReactQueryDevtools`

After that, `_app.tsx` should export `MyApp` directly.

If `@tanstack/react-query*` is no longer used anywhere else, remove it from `package.json`.

### Phase 5: Static Export Configuration

Update `next.config.mjs` for static deployment.

Recommended config:

```js
export default {
  reactStrictMode: true,
  output: "export",
};
```

If needed later for asset paths or images, add those explicitly, but keep the first pass minimal.

Why:

- ensures build output is static
- prevents accidental reliance on server features

### Phase 6: Dependency Cleanup

Remove from `package.json` if unused:

- `@prisma/client`
- `prisma`
- `@trpc/client`
- `@trpc/next`
- `@trpc/react-query`
- `@trpc/server`
- `superjson`
- `@tanstack/react-query`
- `@tanstack/react-query-devtools`

Keep `zod` only if still used in client-side types/validation.

Run:

- `pnpm install`

Then clean up any resulting TypeScript errors.

### Phase 7: Documentation Cleanup

Update `README.md` to describe:

- no database required
- no environment variables required for deployment
- static deployment on Vercel
- dataset comes from the old repo's generated JSON

The deployment instructions should become:

1. copy or generate `public/data/words-jmdict.json`
2. `pnpm install`
3. `pnpm build`
4. deploy to Vercel

## Suggested File Changes

### New files

- `public/data/words-jmdict.json`
- `src/features/search/vocab-client.ts`

Optional:

- `src/features/search/vocab-types.ts`
- `src/features/search/search-utils.ts`

### Files to rewrite

- `next.config.mjs`
- `src/pages/_app.tsx`
- `src/features/search/search-state-handler.tsx`
- `src/features/app-shell/header.tsx`
- `src/features/search/word-card.tsx`
- `src/features/search/word-card-mini.tsx`
- `src/features/search/search-results-layout.tsx`
- `src/utils/jotai.ts`
- `README.md`
- `package.json`
- `.env-example`

### Files to delete

- `src/pages/api/trpc/[trpc].ts`
- `src/utils/trpc.ts`
- `src/server/`
- `prisma/`

## Caching Strategy

Start simple:

- keep parsed JSON in module scope after first fetch

Pseudo-flow:

1. first search triggers fetch of `/data/words-jmdict.json`
2. JSON is parsed once
3. `Map<string, Word>` is built once
4. subsequent searches reuse in-memory cache

Optional later:

- cache in IndexedDB for faster repeat visits across reloads
- preload data after initial page render
- split data into shards if first-load cost feels too high

## Performance Notes

The main tradeoff vs the server version is first-load/search startup:

- initial fetch is larger
- parsing ~27 MiB JSON in the browser is non-trivial

This is still acceptable for the first pass because:

- the app is read-only
- ranking is already done in memory
- removing the DB and server reduces overall complexity

If performance becomes an issue, the next step should be data packaging, not reintroducing a database.

Best follow-up optimizations, in order:

1. preload the dataset after first paint
2. store parsed/processed data in IndexedDB
3. split data into shards
4. generate a more lookup-friendly static format

## Vercel Hosting Recommendation

Host on Vercel as a static Next app.

Why Vercel over GitHub Pages here:

- easier fit for this existing Next repo
- no need to fight base paths
- simpler deploy-preview workflow
- current data file size fits Vercel static hosting comfortably

Expected Vercel setup:

1. import repo into Vercel
2. framework preset: Next.js
3. no environment variables required
4. build command: default
5. output handled by Next static export

## Validation Checklist

Before deployment:

1. `pnpm install`
2. `pnpm build`
3. confirm build succeeds with no server runtime
4. confirm output is static export output
5. run local static preview if desired
6. test searches with:
   - common words
   - duplicates
   - words not found
   - large pasted input

Functional checks:

- results ordering matches old app behavior
- duplicate weighting still works
- not-found list still works
- JLPT and frequency chips still render correctly
- refresh does not break the app

## Nice-to-Have Cleanup

Not required for the migration, but worth doing if time allows:

- remove `useMemo` / render-side state updates in `search-state-handler.tsx`
- move word parsing into a pure utility
- add a small unit test around ranking logic
- add a build-time script later to copy the generated JSON from the old repo

## Tracked Implementation Checklist

- [x] Copy or generate `public/data/words-jmdict.json` from the old repo.
- [x] Add a client-side vocab module at `src/features/search/vocab-client.ts`.
- [x] Move or recreate the current vocab types needed on the client so
  `search-results-layout.tsx` and related components no longer depend on
  `RouterOutput` from `src/utils/trpc.ts`.
- [x] Reuse the existing ranking behavior from
  `src/server/resource/vocab/vocab.router.ts` and
  `src/server/resource/vocab/vocab.util.ts` so output stays behaviorally
  identical on the first pass.
- [x] Add shared client-side result state, likely in `src/utils/jotai.ts`, for
  `{ words, notFound }`.
- [x] Update `src/features/search/search-state-handler.tsx` to:
  - [x] parse submitted words
  - [x] call the client lookup module
  - [x] manage loading/error UI
  - [x] write the resolved result into shared client state
- [x] Update `src/features/app-shell/header.tsx` to read from shared client
  result state instead of the tRPC query cache.
- [x] Update `src/features/search/word-card.tsx` to delete found words from
  shared client result state instead of the tRPC query cache.
- [x] Update `src/features/search/word-card-mini.tsx` to delete not-found words
  from shared client result state instead of the tRPC query cache.
- [x] Update `src/features/search/search-results-layout.tsx` to use local
  result types instead of `RouterOutput`.
- [x] Remove the tRPC wrapper and devtools from `src/pages/_app.tsx`.
- [x] Delete `src/utils/trpc.ts`.
- [x] Delete `src/pages/api/trpc/[trpc].ts`.
- [x] Delete `src/server/`.
- [x] Delete `prisma/`.
- [x] Remove the server env import from `next.config.mjs`.
- [x] Set `output: "export"` in `next.config.mjs`.
- [x] Remove the `postinstall` Prisma generation step from `package.json`.
- [x] Remove unused runtime dependencies from `package.json`:
  - [x] `@prisma/client`
  - [x] `prisma`
  - [x] `@trpc/client`
  - [x] `@trpc/next`
  - [x] `@trpc/react-query`
  - [x] `@trpc/server`
  - [x] `superjson`
  - [x] `@tanstack/react-query`
  - [x] `@tanstack/react-query-devtools`
- [x] Run `pnpm install` and clean up resulting TypeScript or lint errors.
- [x] Remove `.env-example` or rewrite it so it no longer references
  `DATABASE_URL`.
- [x] Rewrite `README.md` for static deployment:
  - [x] no database required
  - [x] no environment variables required
  - [x] dataset file required in `public/data/`
  - [x] Vercel static deployment steps
- [x] Add at least one small unit test for normalization and ranking logic.
- [x] Run build validation:
  - [x] `pnpm build`
  - [x] confirm output is static export output
  - [x] test common words
  - [x] test duplicates
  - [x] test words not found
  - [x] test large pasted input
- [ ] Deploy to Vercel after the static build passes.

## Decision

Do not keep tRPC for this version.

It adds server and deployment complexity without providing much leverage for a read-only dictionary lookup app. If the app later grows into authenticated user data, saved lists, or collaborative features, that would be a reason to reintroduce a backend. For the current product, static deployment is the better fit.
