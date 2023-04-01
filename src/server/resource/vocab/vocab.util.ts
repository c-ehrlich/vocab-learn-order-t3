import { FrequencyListWeights, Word } from "./vocab.schema";

export function getWeightedWordRanking(
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
