# Vocab Learn Order

[Live Demo](https://vocab.c-ehrlich.dev)

Vocab Learn Order is a static Next.js app for Japanese learners. Paste in a
list of words, weight the included frequency lists, and the app suggests a
learning order based on the combined ranking.

## Stack

- Next.js
- React
- Jotai
- Material UI
- Static JSON dictionary data

## Dataset

This version does not use a database. It expects the generated dictionary file
to exist at:

- `public/data/words-jmdict.json`

Recommended source:

- `../vocab-learn-order/backend/src/data/words-jmdict.json`

The checked-in app code assumes the file is present before you run the app or
build for deployment.

## Development

1. Copy or generate `public/data/words-jmdict.json`.
2. Run `pnpm install`.
3. Run `pnpm dev`.

## Deployment

This repo is intended for static deployment on Vercel.

1. Copy or generate `public/data/words-jmdict.json`.
2. Run `pnpm install`.
3. Run `pnpm build`.
4. Deploy the repo to Vercel with the default Next.js preset.

No database is required. No environment variables are required for deployment.

## Notes

- The dictionary JSON is about 27 MiB raw, so the first lookup includes a
  noticeable fetch and parse cost.
- After the first load, the app keeps the parsed lookup map in memory.
