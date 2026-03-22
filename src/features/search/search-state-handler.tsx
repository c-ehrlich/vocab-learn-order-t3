// MUI imports
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

// other imports
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  frequencyListWeightsAtom,
  searchFieldInputAtom,
  searchResultAtom,
} from "../../utils/jotai";
import { SearchResultsLayout } from "./search-results-layout";
import { getLearnOrder } from "./vocab-client";
import { normalizeSubmittedWords } from "./search-utils";
import { SearchResult } from "./vocab-types";

type SearchStatus =
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "ready" };

function SearchStateHandler() {
  const [searchFieldInput, __setSearchFieldInput] =
    useAtom(searchFieldInputAtom);
  const [frequencyListWeights, __setFrequencyListWeights] = useAtom(
    frequencyListWeightsAtom
  );
  const [searchResult, setSearchResult] = useAtom(searchResultAtom);
  const [status, setStatus] = useState<SearchStatus>({ state: "loading" });

  useEffect(() => {
    let isCancelled = false;
    const words = normalizeSubmittedWords(searchFieldInput);

    setStatus({ state: "loading" });
    setSearchResult(null);

    void getLearnOrder({
      words,
      weights: frequencyListWeights,
    })
      .then((data: SearchResult) => {
        if (isCancelled) {
          return;
        }

        setSearchResult(data);
        setStatus({ state: "ready" });
      })
      .catch((error: unknown) => {
        if (isCancelled) {
          return;
        }

        setStatus({
          state: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      });

    return () => {
      isCancelled = true;
    };
  }, [frequencyListWeights, searchFieldInput, setSearchResult]);

  if (status.state === "loading") {
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

  if (status.state === "error") {
    return <div>Error: {status.message}</div>;
  }

  if (!searchResult) {
    return (
      <div>
        something went wrong... not loading, not error, but don&apos;t have data
      </div>
    );
  }

  return (
    <SearchResultsLayout
      words={searchResult.words}
      notFound={searchResult.notFound}
    />
  );
}

export { SearchStateHandler };
