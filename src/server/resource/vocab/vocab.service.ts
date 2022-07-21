import { Word } from './vocab.schema';

/**
 * TO IMPLEMENT IF WE WANT THE ADMIN STUFF TO WORK FROM TRPC
 * - createManyWords
 * - createOneWord (maybe not necessary? just use createManyWords)
 * - deleteAllWords
 */

export async function findManyWords(words: string[]): Promise<Word[]> {
  return [] as Word[];
}
