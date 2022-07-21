import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { frequencyListWeightsAtom } from '../../utils/jotai';
import { trpc } from '../../utils/trpc';

function SearchStateHandler(state: { input: string }) {
  const words = useMemo(() => {
    return state.input
      .replace(/(\(|（)(.[^()（）]*)(\)|）)/gm, ' ') // remove anything inside () or （）
      .replace(/(\s|\n|,|、|・|·)+/gm, ' ') // remove delineation chars and consolidate whitespace
      .trim()
      .split(' '); // turn into aray
  }, [state.input]);
  const [frequencyListWeights, _] = useAtom(frequencyListWeightsAtom);

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

  return <div>SearchStateHandler</div>;
}

export default SearchStateHandler;
