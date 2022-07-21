import { z } from 'zod';

/**
 * Frequency list weights
 * used by vocab.learnOrder
 * and some utility functions
 */
const frequencyListWeightsSchema = z
  .object(
    {
      animeJDrama: z.number({
        required_error:
          'Frequency List weighting for Anime & J-Drama is required',
        invalid_type_error: 'Frequency List weightings must be strings',
      }),
      bccwj: z.number({
        required_error: 'Frequency List weighting for BCCWJ is required',
        invalid_type_error: 'Frequency List weightings must be strings',
      }),
      innocent: z.number({
        required_error:
          'Frequency List weighting for Innocent Corpus is required',
        invalid_type_error: 'Frequency List weightings must be strings',
      }),
      kokugojiten: z.number({
        required_error: 'Frequency List weighting for 国語辞典 is required',
        invalid_type_error: 'Frequency List weightings must be strings',
      }),
      narou: z.number({
        required_error: 'Frequency List weighting for Narou is required',
        invalid_type_error: 'Frequency List weightings must be strings',
      }),
      netflix: z.number({
        required_error: 'Frequency List weighting for Netflix is required',
        invalid_type_error: 'Frequency List weightings must be strings',
      }),
      novels: z.number({
        required_error: 'Frequency List weighting for Novels is required',
        invalid_type_error: 'Frequency List weightings must be strings',
      }),
      vn: z.number({
        required_error:
          'Frequency List weighting for Visual Novels is required',
        invalid_type_error: 'Frequency List weightings must be strings',
      }),
      wikipedia: z.number({
        required_error: 'Frequency List weighting for Wikipedia is required',
        invalid_type_error: 'Frequency List weightings must be strings',
      }),
    },
    { required_error: 'Frequency List weightings are required' }
  )
  .strict('Frequency list includes unknown key(s)');

export type FrequencyListWeights = z.infer<typeof frequencyListWeightsSchema>;

/**
 * Input for vocab.learnOrder
 */
export const wordLearnOrderInputSchema = z
  .object({
    words: z
      .array(z.string({ invalid_type_error: 'Words must be strings' }), {
        required_error: 'List of words is required',
      })
      .min(1, 'Submitted word list is empty'),
    weights: frequencyListWeightsSchema,
  })
  .strict('Request includes unknown key(s)');

export type WordLearnOrderInput = z.infer<typeof wordLearnOrderInputSchema>;

/**
 * Word
 */
export const wordSchema = z.object({
  word: z.string({
    required_error: 'Word is required',
  }),
  jmdict: z
    .array(
      z.string({
        required_error: 'JMDict definition is required',
      })
    )
    .min(1, 'At least one JMDict definition required'),
  multiplier: z.number().optional(),
  jlpt: z.tuple([z.number(), z.string()]).array().optional(),
  animeJDrama: z.number().optional(),
  bccwj: z.number().optional(),
  innocent: z.number().optional(),
  kokugojiten: z.number().optional(),
  narou: z.number().optional(),
  netflix: z.number().optional(),
  novels: z.number().optional(),
  vn: z.number().optional(),
  wikipedia: z.number().optional(),
});

export type Word = z.infer<typeof wordSchema>;

/**
 * Duplicates list
 * used in utils
 */
export type DuplicateWordList = {
  word: string;
  count: number;
}[];
