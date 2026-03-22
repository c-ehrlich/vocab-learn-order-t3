export type FrequencyListWeights = {
  animeJDrama: number;
  bccwj: number;
  innocent: number;
  kokugojiten: number;
  narou: number;
  netflix: number;
  novels: number;
  vn: number;
  wikipedia: number;
};

export type Word = {
  word: string;
  jmdict: string[];
  multiplier?: number | null;
  jlpt: [number, string][] | null;
  animeJDrama: number | null;
  bccwj: number | null;
  innocent: number | null;
  kokugojiten: number | null;
  narou: number | null;
  netflix: number | null;
  novels: number | null;
  vn: number | null;
  wikipedia: number | null;
};

export type ProcessedWord = Word & { count: number; weight: number };

export type SearchResult = {
  words: ProcessedWord[];
  notFound: string[];
};
