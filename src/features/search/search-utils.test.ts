import { describe, expect, it } from "vitest";
import { getLearnOrder } from "./vocab-client";
import {
  buildSearchResult,
  getWeightedWordRanking,
  normalizeSubmittedWords,
} from "./search-utils";
import { FrequencyListWeights, ProcessedWord, Word } from "./vocab-types";

const weights: FrequencyListWeights = {
  animeJDrama: 40,
  bccwj: 30,
  innocent: 30,
  kokugojiten: 10,
  narou: 30,
  netflix: 90,
  novels: 40,
  vn: 20,
  wikipedia: 30,
};

function makeWord(word: string, values: Partial<Word> = {}): Word {
  return {
    word,
    jmdict: [`definition for ${word}`],
    jlpt: null,
    animeJDrama: null,
    bccwj: null,
    innocent: null,
    kokugojiten: null,
    narou: null,
    netflix: null,
    novels: null,
    vn: null,
    wikipedia: null,
    ...values,
  };
}

describe("normalizeSubmittedWords", () => {
  it("removes parenthetical notes and normalizes separators", () => {
    expect(normalizeSubmittedWords("猫 (note)\n犬、鳥・魚")).toEqual([
      "猫",
      "犬",
      "鳥",
      "魚",
    ]);
  });
});

describe("lookup logic", () => {
  it("preserves duplicate counts, missing words, and weighted ordering", () => {
    const commonWord = makeWord("猫", { netflix: 20 });
    const rareWord = makeWord("犬", { netflix: 25 });

    const result = buildSearchResult({
      inputWords: ["猫", "犬", "猫", "鳥"],
      wordsFromData: [commonWord, rareWord],
      weights,
    });

    expect(result.notFound).toEqual(["鳥"]);
    expect(result.words.map((word) => word.word)).toEqual(["猫", "犬"]);
    expect(result.words.map((word) => word.count)).toEqual([2, 1]);
  });

  it("multiplies the weighted score by duplicate count", () => {
    const processedWord: ProcessedWord = {
      ...makeWord("猫", { netflix: 30 }),
      count: 3,
      weight: 0,
    };

    expect(getWeightedWordRanking(processedWord, weights)).toBe(9);
  });

  it("rejects oversized input before attempting lookup", async () => {
    const words = Array.from({ length: 5001 }, (_, index) => `word-${index}`);

    await expect(getLearnOrder({ words, weights })).rejects.toThrow(
      "Too many words"
    );
  });
});
