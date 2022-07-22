import { DuplicateWordList, FrequencyListWeights, Word } from './vocab.schema';

// TODO use a map for this
// TODO don't use ! types
export function createCounts(
  words: Word[],
  duplicates: DuplicateWordList
): Word[] {
  const wordsWithMultiplier = words.map((word) => {
    const index = duplicates.findIndex((w) => w.word === word.word);
    if (index !== -1) {
      word.multiplier = duplicates[index]!.count;
      return word;
    } else {
      word.multiplier = 1;
      return word;
    }
  });

  return words;
}

// TODO use a map for this
// TODO don't use ! types
export default function findDuplicates(words: string[]): DuplicateWordList {
  let duplicates: DuplicateWordList = [];

  // create list of how often each word exists
  words.forEach((word) => {
    const index = duplicates.findIndex((dword) => dword.word === word);
    if (index === -1) {
      duplicates.push({ word, count: 1 });
    } else {
      duplicates[index]!.count++;
    }
  });

  // delete all words that only exist once so the array is faster to search
  for (let i = duplicates.length - 1; i >= 0; i--) {
    if (duplicates[i]!.count === 1) {
      duplicates = ([] as DuplicateWordList).concat(
        duplicates.slice(0, i),
        duplicates.slice(i + 1)
      );
    }
  }

  return duplicates;
}

export function sortWords(
  words: Word[],
  weights: FrequencyListWeights
): Word[] {
  return words.sort(compareWordForSorting);

  // TODO refactor so compareWordForSorting doesn't have to live inside sortWords?
  function compareWordForSorting(a: Word, b: Word): number {
    return getWeightedWordRanking(a, weights) <
      getWeightedWordRanking(b, weights)
      ? 1
      : -1;
  }
}

function getWeightedWordRanking(
  word: Word,
  weights: FrequencyListWeights
): number {
  const baseValue =
    frequencyListValueCalc(word.animeJDrama, weights.animeJDrama) +
    frequencyListValueCalc(word.bccwj, weights.bccwj) +
    frequencyListValueCalc(word.innocent, weights.innocent) +
    frequencyListValueCalc(word.kokugojiten, weights.kokugojiten) +
    frequencyListValueCalc(word.narou, weights.narou) +
    frequencyListValueCalc(word.netflix, weights.netflix) +
    frequencyListValueCalc(word.novels, weights.novels) +
    frequencyListValueCalc(word.vn, weights.vn) +
    frequencyListValueCalc(word.wikipedia, weights.wikipedia);

  return baseValue * (word.multiplier || 1);
}

function frequencyListValueCalc(
  flValue: number | null,
  flWeight: number
): number {
  if (!flValue) return 0;
  return Math.max(flWeight, 0) / flValue;
}

export function findMissingWords(
  inputWordList: string[],
  rankedWordResponse: Word[]
) {
  const rankedWordResponseWords = rankedWordResponse.map((item) => item.word);

  const missingWords = inputWordList.filter((word) => {
    return !rankedWordResponseWords.includes(word);
  });

  return missingWords;
}
