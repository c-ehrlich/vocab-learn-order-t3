import { describe, expect, it } from "vitest";
import {
  allWordsFixture,
  foundWordsFixture,
  missingWordsFixture,
} from "./vocab.fixture";
import { findDuplicates, findMissingWords } from "./vocab.util";

describe("findMissingWords", () => {
  it("should correctly identify missing words", () => {
    // @ts-ignore
    const missingWords = findMissingWords(allWordsFixture, foundWordsFixture);
    expect(missingWords).toStrictEqual(missingWordsFixture);
  });
});

describe("findDuplicates", () => {
  it("should correctly identify duplicate words", () => {
    const duplicatesWordsFixture = ["食べる", "食べる", "食べる", "飲む"];
    const duplicatesOutcome = [{ word: "食べる", count: 3 }];
    const duplicates = findDuplicates(duplicatesWordsFixture);
    expect(duplicates).toStrictEqual(duplicatesOutcome);
  });
});
