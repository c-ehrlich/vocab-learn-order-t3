// MUI imports
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";

// other imports
import { SearchResultsLayoutProps } from "./search-results-layout";
import { useAtom } from "jotai";
import { frequencyListWeightsAtom, searchWordsAtom } from "../../utils/jotai";
import { trpc } from "../../utils/trpc";
import { CardActionButtons, CardHeaderComponent } from "./word-card-shared";

type NotFoundWord = SearchResultsLayoutProps["notFound"][number];

function WordCardMini(props: { word: NotFoundWord }) {
  const [frequencyListWeights, __setFrequencyListWeights] = useAtom(
    frequencyListWeightsAtom
  );
  const [searchWords, __setSearchWords] = useAtom(searchWordsAtom);

  const queryClient = trpc.useContext();

  function deleteNotFoundWord() {
    const currentData = queryClient.vocab.learnOrder.getData({
      words: searchWords,
      weights: frequencyListWeights,
    });
    if (!currentData) return;

    const index = currentData.notFound.findIndex((w) => w === props.word);
    if (index >= 0) {
      const newData = {
        ...currentData,
        notFound: ([] as string[]).concat(
          currentData.notFound.slice(0, index),
          currentData.notFound.slice(index + 1)
        ),
      };
      queryClient.vocab.learnOrder.setData(
        {
          words: searchWords,
          weights: frequencyListWeights,
        },
        {
          words: newData?.words || [],
          notFound: newData?.notFound || [],
        }
      );
    }
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

const CheckIconButton = styled(IconButton)`
  margin-right: 8px;
  margin-top: 4px;
`;

export default WordCardMini;
