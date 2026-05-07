// MUI imports
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";

// other imports
import { SearchResultsLayoutProps } from "./search-results-layout";
import { useAtom } from "jotai";
import { searchFieldInputAtom, searchResultAtom } from "../../utils/jotai";
import { CardActionButtons, CardHeaderComponent } from "./word-card-shared";
import { removeWordFromSubmittedInput } from "./search-utils";

type NotFoundWord = SearchResultsLayoutProps["notFound"][number];

function WordCardMini(props: { word: NotFoundWord }) {
  const [searchFieldInput, setSearchFieldInput] = useAtom(searchFieldInputAtom);
  const [__searchResult, setSearchResult] = useAtom(searchResultAtom);

  function deleteNotFoundWord() {
    setSearchFieldInput(removeWordFromSubmittedInput(searchFieldInput, props.word));
    setSearchResult((currentData) =>
      currentData
        ? {
            ...currentData,
            notFound: currentData.notFound.filter((word) => word !== props.word),
          }
        : currentData
    );
  }

  return (
    <Card aria-label="word-card-mini" sx={{ maxWidth: "100%" }}>
      <CardHeaderComponent word={props.word} delete={deleteNotFoundWord} />
      <CardActions sx={{ paddingLeft: 2, paddingBottom: 2 }}>
        <CardActionButtons word={props.word} />
      </CardActions>
    </Card>
  );
}

export { WordCardMini };
