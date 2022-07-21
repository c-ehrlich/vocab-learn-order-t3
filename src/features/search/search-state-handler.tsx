// MUI imports
import CircularProgress from '@mui/material/CircularProgress';

// other imports
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import {
  frequencyListWeightsAtom,
  searchFieldInputAtom,
} from '../../utils/jotai';
import { trpc } from '../../utils/trpc';
import SearchResultsLayout from './search-results-layout';

function SearchStateHandler() {
  const [searchFieldInput, __setSearchFieldInput] =
    useAtom(searchFieldInputAtom);
  const words = useMemo(() => {
    return searchFieldInput
      .replace(/(\(|（)(.[^()（）]*)(\)|）)/gm, ' ') // remove anything inside () or （）
      .replace(/(\s|\n|,|、|・|·)+/gm, ' ') // remove delineation chars and consolidate whitespace
      .trim()
      .split(' '); // turn into aray
  }, [searchFieldInput]);
  const [frequencyListWeights, __setFrequencyListWeights] = useAtom(
    frequencyListWeightsAtom
  );

  const vocabQuery = trpc.proxy.vocab.learnOrder.useQuery({
    words,
    weights: frequencyListWeights,
  });

  // const handleSearchButtonClick = async () => {
  // parse input

  //   // guard clause for no input
  //   if (words.length === 0) {
  //     setSnackbarText('Please input something');
  //     setBadResponseSnackbarOpen(true);
  //     return;
  //   }

  //   // make request
  //   const Response = await fetch(
  //     `${process.env.REACT_APP_SERVER}/api/learnorder`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         words,
  //         weights: frequencyListWeights,
  //       }),
  //     }
  //   );

  //   const data: TServerResponse = await Response.json();
  //   if (data.words.length > 0) {
  //     setServerResponse(data);
  //     setLocalStorage('vocablist', JSON.stringify(data));
  //     navigate('/results');
  //   } else {
  //     setSnackbarText('Bad input - check the help menu for sample input.');
  //     setBadResponseSnackbarOpen(true);
  //   }
  // };

  if (vocabQuery.isError) {
    return <div>Error: {JSON.stringify(vocabQuery.error)}</div>;
  }

  if (vocabQuery.isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  if (!vocabQuery.data) {
    return (
      <div>
        something went wrong... not loading, not error, but don't have data
      </div>
    );
  }

  return (
    <SearchResultsLayout
      words={vocabQuery.data.words}
      notFound={vocabQuery.data.notFound}
    />
  );
}

export default SearchStateHandler;
