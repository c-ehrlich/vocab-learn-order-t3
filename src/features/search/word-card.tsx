// MUI imports
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { IconButtonProps } from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneIcon from '@mui/icons-material/Done';

// Other imports
import { SearchResultsLayoutProps } from './search-results-layout';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { useAtom } from 'jotai';
import { frequencyListWeightsAtom, searchWordsAtom } from '../../utils/jotai';

type FoundWord = SearchResultsLayoutProps['words'][number];

type Props = {
  word: FoundWord;
};

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
}));

const WordCard = (props: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [frequencyListWeights, __setFrequencyListWeights] = useAtom(
    frequencyListWeightsAtom
  );
  const [searchWords, __setSearchWords] = useAtom(searchWordsAtom);

  const queryClient = trpc.useContext();

  function deleteWord() {
    const currentData = queryClient.getQueryData([
      'vocab.learnOrder',
      {
        words: searchWords,
        weights: frequencyListWeights,
      },
    ]);
    if (!currentData) return;
    const index = currentData.words.indexOf(props.word);
    if (index === 0 || (index && index >= 0)) {
      currentData.words = ([] as FoundWord[]).concat(
        currentData.words.slice(0, index),
        currentData.words.slice(index + 1)
      );
    }
    queryClient.setQueryData(
      [
        'vocab.learnOrder',
        {
          words: searchWords,
          weights: frequencyListWeights,
        },
      ],
      {
        words: currentData?.words || [],
        notFound: currentData?.notFound || [],
      }
    );
  }

  return (
    <Card aria-label='word-card' sx={{ maxWidth: '100%' }}>
      <CardHeader
        lang='ja'
        titleTypographyProps={{
          fontFamily: 'Hiragino Kaku Pro, Meiryo',
          fontWeight: 400,
          fontSize: '24pt',
        }}
        title={props.word.word}
        action={
          <CheckIconButton aria-label='settings' onClick={deleteWord}>
            <DoneIcon />
          </CheckIconButton>
        }
      />
      <CardContent>
        <Typography variant='body1' color='text.secondary'>
          {
            props.word.jmdict.join(
              ', '
            ) /* this works because the DB only has words that are in JMDict */
          }
        </Typography>
      </CardContent>
      {/* vvv can add disableSpacing */}
      <CardActions sx={{ paddingX: 2, paddingBottom: 2 }}>
        <CardActionButtons>
          <LinkWithoutMargin
            href={`https://jpdb.io/search?q=${props.word.word}&lang=japanese`}
            target='_blank'
            rel='noopener'
            underline='none'
          >
            <Button size='medium' variant='outlined'>
              JPDB
            </Button>
          </LinkWithoutMargin>
          <LinkWithoutMargin
            href={`https://youglish.com/pronounce/${props.word.word}/japanese`}
            target='_blank'
            rel='noopener'
            color='inherit'
            underline='none'
          >
            <Button size='medium' variant='contained'>
              YouGlish
            </Button>
          </LinkWithoutMargin>
          <LinkWithoutMargin
            href={`https://www.immersionkit.com/dictionary?keyword=${props.word.word}`}
            target='_blank'
            rel='noopener'
            color='inherit'
            underline='none'
          >
            <Button size='medium' variant='contained'>
              ImmersionKit
            </Button>
          </LinkWithoutMargin>
        </CardActionButtons>
        <BottomAlignedExpandMore
          expand={expanded}
          onClick={() => setExpanded((expanded) => !expanded)}
          aria-expanded={expanded}
          aria-label='show more'
        >
          <ExpandMoreIcon />
        </BottomAlignedExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <Chip
              label={
                props.word.jlpt && props.word.jlpt.length !== 0
                  ? `JLPT: ${props.word.jlpt.map((item) => item[1]).join(', ')}`
                  : 'Not in JLPT List'
              }
              color='default'
              variant='outlined'
            />
            {props.word.animeJDrama && (
              <Chip
                label={`Anime & J-Drama: ${props.word.animeJDrama}`}
                color='default'
                variant='outlined'
              />
            )}
            {props.word.bccwj && (
              <Chip
                label={`BCCWJ: ${props.word.bccwj}`}
                color='default'
                variant='outlined'
              />
            )}
            {props.word.innocent && (
              <Chip
                label={`Innocent: ${props.word.innocent}`}
                color='default'
                variant='outlined'
              />
            )}
            {props.word.kokugojiten && (
              <Chip
                lang='ja'
                label={`国語辞典: ${props.word.kokugojiten}`}
                color='default'
                variant='outlined'
              />
            )}
            {props.word.narou && (
              <Chip
                label={`Narou: ${props.word.narou}`}
                color='default'
                variant='outlined'
              />
            )}
            {props.word.netflix && (
              <Chip
                label={`Netflix: ${props.word.netflix}`}
                color='default'
                variant='outlined'
              />
            )}
            {props.word.novels && (
              <Chip
                label={`Novels: ${props.word.novels}`}
                color='default'
                variant='outlined'
              />
            )}
            {props.word.vn && (
              <Chip
                label={`Visual Novels: ${props.word.vn}`}
                color='default'
                variant='outlined'
              />
            )}
            {props.word.wikipedia && (
              <Chip
                label={`Wikipedia: ${props.word.wikipedia}`}
                color='default'
                variant='outlined'
              />
            )}
          </div>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const CheckIconButton = styled(IconButton)`
  margin-right: 8px;
  margin-top: 4px;
`;

const CardActionButtons = styled(CardActions)`
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

const LinkWithoutMargin = styled(Link)`
  margin: 0px !important;
`;

const BottomAlignedExpandMore = styled(ExpandMore)`
  align-self: flex-end;
  justify-self: end;
`;

export default WordCard;
