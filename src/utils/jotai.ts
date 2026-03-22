import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
  FrequencyListWeights,
  SearchResult,
} from "../features/search/vocab-types";

const defaultFrequencyListWeights: FrequencyListWeights = {
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

const frequencyListWeightsAtom = atomWithStorage<FrequencyListWeights>(
  "frequencyLists",
  defaultFrequencyListWeights
);
const isSearchingAtom = atom(false);
const searchFieldInputAtom = atomWithStorage("searchFieldInput", "");
const searchResultAtom = atom<SearchResult | null>(null);

export {
  defaultFrequencyListWeights,
  frequencyListWeightsAtom,
  isSearchingAtom,
  searchFieldInputAtom,
  searchResultAtom,
};
