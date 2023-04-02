import { styled } from "@mui/material";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import DoneIcon from "@mui/icons-material/Done";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";

export function CardActionButtons(props: { word: string }) {
  return (
    <CardActionButtonGroup>
      <LinkWithoutMargin
        href={`https://jpdb.io/search?q=${props.word}&lang=japanese`}
        target="_blank"
        rel="noopener"
        underline="none"
      >
        <Button size="medium" variant="outlined">
          JPDB
        </Button>
      </LinkWithoutMargin>
      <LinkWithoutMargin
        href={`https://youglish.com/pronounce/${props.word}/japanese`}
        target="_blank"
        rel="noopener"
        color="inherit"
        underline="none"
      >
        <Button size="medium" variant="contained">
          YouGlish
        </Button>
      </LinkWithoutMargin>
      <LinkWithoutMargin
        href={`https://www.immersionkit.com/dictionary?keyword=${props.word}`}
        target="_blank"
        rel="noopener"
        color="inherit"
        underline="none"
      >
        <Button size="medium" variant="contained">
          ImmersionKit
        </Button>
      </LinkWithoutMargin>
    </CardActionButtonGroup>
  );
}

export function CardHeaderComponent(props: {
  word: string;
  delete: () => void;
}) {
  return (
    <CardHeader
      lang="ja"
      titleTypographyProps={{
        fontFamily: "Hiragino Kaku Pro, Meiryo",
        fontWeight: 400,
        fontSize: "24pt",
      }}
      title={props.word}
      action={
        <CheckIconButton aria-label="completed" onClick={props.delete}>
          <DoneIcon />
        </CheckIconButton>
      }
    />
  );
}

const CardActionButtonGroup = styled(CardActions)`
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0 8px;
  @media (max-width: 460px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px 0;
  }
`;

const CheckIconButton = styled(IconButton)`
  margin-right: 8px;
  margin-top: 4px;
`;

const LinkWithoutMargin = styled(Link)`
  margin: 0px !important;
`;
