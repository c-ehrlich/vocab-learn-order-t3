import { t } from '../../trpc/utils';
import { Word, wordLearnOrderInputSchema } from './vocab.schema';
import {
  createCounts,
  findDuplicates,
  findMissingWords,
  sortWords,
} from './vocab.util';
import { findManyWords } from './vocab.service';

export const vocabRouter = t.router({
  learnOrder: t.procedure
    .input(wordLearnOrderInputSchema)
    .query(async ({ input, ctx }) => {
      if (input.words.length > 5000) {
        throw new Error('Too many words');
      }

      const duplicates = findDuplicates(input.words);
      const wordsDBRes = await findManyWords({
        prisma: ctx.prisma,
        words: input.words,
      });

      // temp hack to fix mongo json fields
      // TODO don't have this in the middle of the handler, do in service?
      const myWords = wordsDBRes.map((word) => {
        return {
          ...word,
          jlpt: typeof word.jlpt === 'object' ? Object(word.jlpt) : null,
        };
      });

      // TODO make sure we have a response
      const responseWithCounts = createCounts(myWords, duplicates);
      const words = sortWords(responseWithCounts, input.weights);
      const notFound = findMissingWords(input.words, words);

      console.log(input.words);

      return { words, notFound };
    }),
});
