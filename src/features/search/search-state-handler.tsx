// MUI imports
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

// other imports
import { useAtom } from "jotai";
import { useMemo } from "react";
import {
  frequencyListWeightsAtom,
  searchFieldInputAtom,
  searchWordsAtom,
} from "../../utils/jotai";
import { trpc } from "../../utils/trpc";
import SearchResultsLayout from "./search-results-layout";

function SearchStateHandler() {
  const [searchFieldInput, __setSearchFieldInput] =
    useAtom(searchFieldInputAtom);
  const [__searchWords, setSearchWords] = useAtom(searchWordsAtom);

  const words = useMemo(() => {
    return searchFieldInput
      .replace(/(\(|（)(.[^()（）]*)(\)|）)/gm, " ") // remove anything inside () or （）
      .replace(/(\s|\n|,|、|・|·)+/gm, " ") // remove delineation chars and consolidate whitespace
      .trim()
      .split(" "); // turn into aray
  }, [searchFieldInput]);
  setSearchWords(words);

  const [frequencyListWeights, __setFrequencyListWeights] = useAtom(
    frequencyListWeightsAtom
  );

  const vocabQuery = trpc.vocab.learnOrder.useQuery(
    {
      words,
      weights: frequencyListWeights,
    },
    {
      staleTime: Infinity,
    }
  );

  if (vocabQuery.isLoading) {
    return (
      <Stack spacing={2} marginTop={2} marginBottom={4}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          marginTop="32px"
        >
          <CircularProgress color="success" />
        </Box>
      </Stack>
    );
  }

  if (vocabQuery.isError) {
    return <div>Error: {JSON.stringify(vocabQuery.error)}</div>;
  }

  if (!vocabQuery.data) {
    return (
      <div>
        something went wrong... not loading, not error, but don&apos;t have data
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
