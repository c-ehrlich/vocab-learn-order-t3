import { createRouter, publicProcedure } from "../../trpc/utils";
import { FrequencyListWeights, Word, wordLearnOrderInputSchema } from "./vocab.schema";
import { getWeightedWordRanking } from "./vocab.util";
import { findManyWords } from "./vocab.service";

export const vocabRouter = createRouter({
  learnOrder: publicProcedure
    .input(wordLearnOrderInputSchema)
    .query(async ({ input, ctx }) => {
      if (input.words.length > 5000) {
        throw new Error("Too many words");
      }

      const wordsFromDb = await findManyWords({
        prisma: ctx.prisma,
        words: input.words,
      });

      const { sortedWords, wordsNotFound } = doWordLogic({
        wordsFromDb,
        input: input.words,
        weights: input.weights
      });

      return { words: sortedWords, notFound: wordsNotFound };
    }),
});

function doWordLogic({ wordsFromDb, input, weights }: {
  wordsFromDb: Word[],
  input: string[],
  weights: FrequencyListWeights
}) {
  const wordsMap = new Map<string, Word & { count: number, weight: number }>();

  wordsFromDb.forEach((word) => {
    if (!wordsMap.has(word.word)) {
      wordsMap.set(word.word, { ...word, count: 1, weight: 0 });
    } else {
      const existingWord = wordsMap.get(word.word);
      wordsMap.set(word.word, {
        ...existingWord!,
        count: existingWord!.count + 1,
      });
    }

    for (let value of wordsMap.values()) {
      value.weight = getWeightedWordRanking(value, weights)
    }
  });

  const sortedWords = Array.from(wordsMap.values()).sort((a, b) => {
    return a.weight < b.weight ? 1 : -1;
  });

  const wordsNotFound = input.filter((word) => !wordsMap.has(word));

  return { sortedWords, wordsNotFound }
}