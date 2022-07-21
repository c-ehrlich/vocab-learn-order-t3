import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const frequencyListWeightsAtom = atomWithStorage('frequencyLists', {
  animeJDrama: 40,
  bccwj: 30,
  innocent: 30,
  kokugojiten: 10,
  narou: 30,
  netflix: 90,
  novels: 40,
  vn: 20,
  wikipedia: 30,
});
const isSearchingAtom = atom(false);
const searchFieldInputAtom = atom('');

export { frequencyListWeightsAtom, isSearchingAtom, searchFieldInputAtom };
