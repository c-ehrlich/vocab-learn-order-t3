import { Stack, Typography } from '@mui/material';
// import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { inferQueryOutput } from '../../utils/trpc';
// import { useNavigate } from 'react-router-dom';
// import useStore from '../store';
// import animations from '../themes/animations';
// import WordCard from './WordCard';
// import WordCardMini from './WordCardMini';

type SearchResultsLayoutProps = inferQueryOutput<'vocab.learnOrder'>;

const SearchResultsLayout = (props: SearchResultsLayoutProps) => {
  return (
    <Stack spacing={2} marginTop={2} marginBottom={4}>
      {props.words.length > 0 && (
        <>
          <Typography key='header-words' variant='h5'>
            Words sorted by suggested Learn Order
          </Typography>
          {props.words.map((word) => (
            <div key={word.word}>{JSON.stringify(word)}</div>
            // <WordCard key={word.word} word={word} />
          ))}
        </>
      )}

      {props.notFound.length > 0 && (
        <>
          <Typography key='header-notfound' variant='h5'>
            Words not found in Frequency Lists
          </Typography>
          {props.notFound.map((word) => (
            <div key={word}>{word}</div>
            // <WordCardMini key={word} word={word} />
          ))}
        </>
      )}
    </Stack>
  );
};

export default SearchResultsLayout;
