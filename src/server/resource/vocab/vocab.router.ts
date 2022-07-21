import { t } from '../../trpc/utils';
import { wordLearnOrderInputSchema } from './vocab.schema';
import findDuplicates, {
  createCounts,
  findMissingWords,
  sortWords,
} from './vocab.util';
import { findManyWords } from './vocab.service';

export const vocabRouter = t.router({
  learnOrder: t.procedure
    .input(wordLearnOrderInputSchema)
    .query(async ({ input }) => {
      if (input.words.length > 5000) {
        throw new Error('Too many words');
      }

      const duplicates = findDuplicates(input.words);
      const wordsDBRes = await findManyWords(input.words);
      // TODO make sure we have a response
      const responseWithCounts = createCounts(wordsDBRes, duplicates);
      const words = sortWords(responseWithCounts, input.weights);
      const notFound = findMissingWords(input.words, words);

      return { words, notFound };
    }),
});
