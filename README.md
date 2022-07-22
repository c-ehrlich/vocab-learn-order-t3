# Vocab Learn Order (v2)

[Live Demo](https://vocab.c-ehrlich.dev)

![Vocab Learn Order Screenshot](https://user-images.githubusercontent.com/8353666/155544745-745b1201-b071-426d-aac8-60875831d57e.png)

## Table of Contents
  - [What is this?](#what-is-this)
  - [Technologies](#technologies)
  - [Installation and Setup](#installation-and-setup)
    - [Development](#development)
    - [Deployment](#deployment)
  - [Reflection](#reflection)
  - [Acknowledgements](#acknowledgements)

## What is this?
This is a rebuild of [an older app of mine](https://github.com/c-ehrlich/vocab-learn-order), recreated in the [T3 Stack](https://init.tips/) including tRPC v10 alpha. It's missing the functionality to seed an initial database, you will need to use the script in the old app for that if you want to deploy your own instance.

---

Vocab Learn Order is a web app for Japanese learners. Many immersion learners know the experience of listening to podcasts or other audio material in their target language, looking up unknown words, and then saving those words in a Notes file with the intent to learn them later with a tool such as Anki. But suddenly the file is several hundred words long and it's difficult to know which words to learn first to get the greatest benefit.

Frequency lists help with this somewhat, but as each frequency list is computed from a type of media, no single frequency list can give a realistic representation of how useful a given word is. Additionally, different learners have different goals - for some the highest priority is reading, for some it's business conversation, for some it's casual conversation, and so on.

By letting users decide how highly to weigh each frequency list, this app is able to create a much more accurate learn order than other methods. Additionally it makes Anki card creation much easier by giving access to sample sentences for each word through YouGlish and ImmersionKit. It's suitable for learners of all skill levels as the database is built on a dataset created specifically for this app, which contains frequency information for about 200,000 words, significantly more than most individual frequency lists.

## Technologies
* __Backend__: tRPC, Prisma, MongoDB, Zod
* __Frontend__: Next.js, React Query, Jotai, Material UI
* __Sample Deployment__: MongoDB Atlas (Database), Vercel (App)

## Installation and Setup
### Development
1. Use [the old project](https://github.com/c-ehrlich/vocab-learn-order) to populate a MongoDB database (local or online)
2. `pnpm i`
3. Create a .env based on .env-example
4. `pnpm dev`

### Deployment
1. Make sure you have an online MongoDB database that has been seeded with the dictionary data
2. Push to a git repo
3. Import the repo in Vercel
4. Add the `DATABASE_URL` variable in Vercel

If you would like to deploy separate backend and frontend services or use containers, you can use [the old project](https://github.com/c-ehrlich/vocab-learn-order).

## Reflection
* tRPC is great, and v10 is even better!
* Prisma's introspection is incredible - the schema were created by typing one line in the console
* This was very easy and fast to develop
* There are a few hacky things regarding state management. It's better than the old version, which was just a single Zustand store (the new version uses React Query and Jotai), but I took some shortcuts to get it up and running without too much refactoring.

## Acknowledgements
* JLPT Vocab List from [stephenmk/yomichan-jkpt-vocab](https://github.com/stephenmk/yomichan-jlpt-vocab)
