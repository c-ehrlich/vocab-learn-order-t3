import { useAtom } from 'jotai';
import type { NextPage } from 'next';
import SearchField from '../features/search/search-field';
import SearchStateHandler from '../features/search/search-state-handler';
import { isSearchingAtom } from '../utils/jotai';

const Home: NextPage = () => {
  const [isSearching, __setIsSearching] = useAtom(isSearchingAtom);

  return <>{isSearching ? <SearchStateHandler /> : <SearchField />}</>;
};

export default Home;
