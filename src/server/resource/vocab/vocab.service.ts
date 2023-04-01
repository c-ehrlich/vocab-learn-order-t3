import { PrismaClient } from "@prisma/client";
import { Word } from "./vocab.schema";

/**
 * TO IMPLEMENT IF WE WANT THE ADMIN STUFF TO WORK FROM TRPC
 * - createManyWords
 * - createOneWord (maybe not necessary? just use createManyWords)
 * - deleteAllWords
 */

export async function findManyWords({
  prisma,
  words,
}: {
  prisma: PrismaClient;
  words: string[];
}) {
  const wordsDBRes = await prisma.words.findMany({
    where: {
      word: {
        in: words,
      },
    },
  });
  // dumb hack to fix mongo json fields
  const fixedWords = wordsDBRes.map((word) => {
    return {
      ...word,
      jlpt: typeof word.jlpt === "object" ? Object(word.jlpt) : null,
    };
  });
  return fixedWords;
}
