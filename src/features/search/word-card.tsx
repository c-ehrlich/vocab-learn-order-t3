// MUI imports
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Other imports
import { SearchResultsLayoutProps } from "./search-results-layout";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { useAtom } from "jotai";
import { frequencyListWeightsAtom, searchWordsAtom } from "../../utils/jotai";
import { CardActionButtons, CardHeaderComponent } from "./word-card-shared";

type FoundWord = SearchResultsLayoutProps["words"][number];

type Props = {
  word: FoundWord;
};

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
}));

const WordCard = (props: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [frequencyListWeights, __setFrequencyListWeights] = useAtom(
    frequencyListWeightsAtom
  );
  const [searchWords, __setSearchWords] = useAtom(searchWordsAtom);

  const queryClient = trpc.useContext();

  function deleteWord() {
    const currentData = queryClient.vocab.learnOrder.getData({
      words: searchWords,
      weights: frequencyListWeights,
    });
    if (!currentData) return;

    const index = currentData.words.findIndex((w) => w === props.word);
    if (index && index >= 0) {
      const newData = {
        ...currentData,
        words: ([] as FoundWord[]).concat(
          currentData.words.slice(0, index),
          currentData.words.slice(index + 1)
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
    <Card aria-label="word-card" sx={{ maxWidth: "100%" }}>
      <CardHeaderComponent word={props.word.word} delete={deleteWord} />
      <CardContent>
        <Typography variant="body1" color="text.secondary">
          {
            props.word.jmdict.join(
              ", "
            ) /* this works because the DB only has words that are in JMDict */
          }
        </Typography>
      </CardContent>
      <CardActions sx={{ paddingX: 2, paddingBottom: 2 }}>
        <CardActionButtons word={props.word.word} />
        <BottomAlignedExpandMore
          expand={expanded}
          onClick={() => setExpanded((expanded) => !expanded)}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </BottomAlignedExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <CardChips word={props.word} />
        </CardContent>
      </Collapse>
    </Card>
  );
};

const BottomAlignedExpandMore = styled(ExpandMore)`
  align-self: flex-end;
  justify-self: end;
`;

function CardChips(props: { word: FoundWord }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "8px",
      }}
    >
      <Chip
        label={
          props.word.jlpt && props.word.jlpt.length !== 0
            ? `JLPT: ${props.word.jlpt.map((item) => item[1]).join(", ")}`
            : "Not in JLPT List"
        }
        color="default"
        variant="outlined"
      />
      {props.word.animeJDrama && (
        <Chip
          label={`Anime & J-Drama: ${props.word.animeJDrama}`}
          color="default"
          variant="outlined"
        />
      )}
      {props.word.bccwj && (
        <Chip
          label={`BCCWJ: ${props.word.bccwj}`}
          color="default"
          variant="outlined"
        />
      )}
      {props.word.innocent && (
        <Chip
          label={`Innocent: ${props.word.innocent}`}
          color="default"
          variant="outlined"
        />
      )}
      {props.word.kokugojiten && (
        <Chip
          lang="ja"
          label={`国語辞典: ${props.word.kokugojiten}`}
          color="default"
          variant="outlined"
        />
      )}
      {props.word.narou && (
        <Chip
          label={`Narou: ${props.word.narou}`}
          color="default"
          variant="outlined"
        />
      )}
      {props.word.netflix && (
        <Chip
          label={`Netflix: ${props.word.netflix}`}
          color="default"
          variant="outlined"
        />
      )}
      {props.word.novels && (
        <Chip
          label={`Novels: ${props.word.novels}`}
          color="default"
          variant="outlined"
        />
      )}
      {props.word.vn && (
        <Chip
          label={`Visual Novels: ${props.word.vn}`}
          color="default"
          variant="outlined"
        />
      )}
      {props.word.wikipedia && (
        <Chip
          label={`Wikipedia: ${props.word.wikipedia}`}
          color="default"
          variant="outlined"
        />
      )}
    </div>
  );
}

export default WordCard;
