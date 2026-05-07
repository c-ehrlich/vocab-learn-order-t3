import {
  FrequencyListWeights,
  ProcessedWord,
  SearchResult,
  Word,
} from "./vocab-types";

export const MAX_SUBMITTED_WORDS = 5000;

export function normalizeSubmittedWords(input: string): string[] {
  return input
    .replace(/(\(|（)(.[^()（）]*)(\)|）)/gm, " ")
    .replace(/(\s|\n|,|、|・|·)+/gm, " ")
    .trim()
    .split(" ");
}

export function removeWordFromSubmittedInput(
  input: string,
  wordToRemove: string
): string {
  return normalizeSubmittedWords(input)
    .filter((word) => word !== wordToRemove)
    .join(", ");
}

export function buildWordMap(words: Word[]): Map<string, Word> {
  const wordMap = new Map<string, Word>();

  words.forEach((word) => {
    if (!wordMap.has(word.word)) {
      wordMap.set(word.word, word);
    }
  });

  return wordMap;
}

export function buildSearchResult(input: {
  inputWords: string[];
  wordsFromData: Word[];
  weights: FrequencyListWeights;
}): SearchResult {
  const wordsMap = new Map<string, ProcessedWord>();

  input.wordsFromData.forEach((word) => {
    if (!wordsMap.has(word.word)) {
      wordsMap.set(word.word, { ...word, count: 0, weight: 0 });
    }
  });

  input.inputWords.forEach((word) => {
    const currentWord = wordsMap.get(word);
    if (currentWord) {
      currentWord.count += 1;
    }
  });

  wordsMap.forEach((word) => {
    word.weight = getWeightedWordRanking(word, input.weights);
  });

  const words = Array.from(wordsMap.values()).sort((a, b) =>
    a.weight < b.weight ? 1 : -1
  );
  const notFound = input.inputWords.filter((word) => !wordsMap.has(word));

  return { words, notFound };
}

export function getWeightedWordRanking(
  word: ProcessedWord,
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

  return baseValue * (word.count || 1);
}

function frequencyListValueCalc(
  flValue: number | null,
  flWeight: number
): number {
  if (!flValue) return 0;
  return Math.max(flWeight, 0) / flValue;
}
