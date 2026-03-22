import {
  MAX_SUBMITTED_WORDS,
  buildSearchResult,
  buildWordMap,
} from "./search-utils";
import { FrequencyListWeights, SearchResult, Word } from "./vocab-types";

let wordMapPromise: Promise<Map<string, Word>> | null = null;

async function loadWordMap(): Promise<Map<string, Word>> {
  if (!wordMapPromise) {
    wordMapPromise = fetch("/data/words-jmdict.json")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load dictionary data");
        }

        return (await response.json()) as Word[];
      })
      .then((words) => buildWordMap(words));
  }

  return wordMapPromise;
}

export async function getLearnOrder(input: {
  words: string[];
  weights: FrequencyListWeights;
}): Promise<SearchResult> {
  if (input.words.length > MAX_SUBMITTED_WORDS) {
    throw new Error("Too many words");
  }

  const wordMap = await loadWordMap();
  const seenWords = new Set<string>();
  const wordsFromData: Word[] = [];

  input.words.forEach((word) => {
    if (seenWords.has(word)) {
      return;
    }

    seenWords.add(word);
    const dataWord = wordMap.get(word);
    if (dataWord) {
      wordsFromData.push(dataWord);
    }
  });

  return buildSearchResult({
    inputWords: input.words,
    wordsFromData,
    weights: input.weights,
  });
}
