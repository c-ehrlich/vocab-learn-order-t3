import { PrismaClient } from '@prisma/client';
import { Word } from './vocab.schema';

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
  return prisma.words.findMany({
    where: {
      word: {
        in: words,
      },
    },
  });
}
