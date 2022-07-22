// MUI imports
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import DoneIcon from '@mui/icons-material/Done';

// other imports
import React from 'react';
import { SearchResultsLayoutProps } from './search-results-layout';
import { useAtom } from 'jotai';
import { frequencyListWeightsAtom, searchWordsAtom } from '../../utils/jotai';
import { trpc } from '../../utils/trpc';

type NotFoundWord = SearchResultsLayoutProps['notFound'][number];

function WordCardMini(props: { word: NotFoundWord }) {
  const [frequencyListWeights, __setFrequencyListWeights] = useAtom(
    frequencyListWeightsAtom
  );
  const [searchWords, __setSearchWords] = useAtom(searchWordsAtom);

  const queryClient = trpc.useContext();

  function deleteNotFoundWord() {
    const currentData = queryClient.getQueryData([
      'vocab.learnOrder',
      {
        words: searchWords,
        weights: frequencyListWeights,
      },
    ]);
    if (!currentData) return;
    const index = currentData.notFound.indexOf(props.word);
    if (index === 0 || (index && index >= 0)) {
      currentData.notFound = ([] as string[]).concat(
        currentData.notFound.slice(0, index),
        currentData.notFound.slice(index + 1)
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
    <Card aria-label='word-card-mini' sx={{ maxWidth: '100%' }}>
      <CardHeader
        lang='ja'
        title={props.word}
        titleTypographyProps={{
          fontFamily: 'Hiragino Kaku Pro, Meiryo',
          fontWeight: 400,
          fontSize: '24pt',
        }}
        action={
          <CheckIconButton aria-label='completed' onClick={deleteNotFoundWord}>
            <DoneIcon />
          </CheckIconButton>
        }
      />
      <CardActions sx={{ paddingLeft: 2, paddingBottom: 2 }}>
        <CardActionButtons>
          <LinkWithoutMargin
            href={`https://jpdb.io/search?q=${props.word}&lang=japanese`}
            target='_blank'
            rel='noopener'
            underline='none'
          >
            <Button size='medium' variant='contained'>
              JPDB
            </Button>
          </LinkWithoutMargin>
          <LinkWithoutMargin
            href={`https://youglish.com/pronounce/${props.word}/japanese`}
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
            href={`https://www.immersionkit.com/dictionary?keyword=${props.word}`}
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
      </CardActions>
    </Card>
  );
}

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

export default WordCardMini;
