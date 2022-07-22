// MUI imports
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAtom } from 'jotai';
import { isSearchingAtom, searchFieldInputAtom } from '../../utils/jotai';

// other imports
import { inferQueryOutput } from '../../utils/trpc';
import WordCard from './word-card';
import WordCardMini from './word-card-mini';

export type SearchResultsLayoutProps = inferQueryOutput<'vocab.learnOrder'>;

const SearchResultsLayout = (props: SearchResultsLayoutProps) => {
  const [__isSearching, setIsSearching] = useAtom(isSearchingAtom);
  const [__searchFieldInput, setSearchFieldInput] =
    useAtom(searchFieldInputAtom);

  function doneWithSearch() {
    setSearchFieldInput('');
    setIsSearching(false);
  }

  if (props.words.length === 0 && props.notFound.length === 0)
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '64px',
          gap: '16px',
        }}
      >
        <Typography align='center'>
          Looks like there&apos;s nothing left
        </Typography>
        <Button onClick={doneWithSearch}>Cool</Button>
      </div>
    );

  return (
    <Stack spacing={2} marginTop={2} marginBottom={4}>
      {props.words.length > 0 && (
        <>
          <Typography key='header-words' variant='h5'>
            Words sorted by suggested Learn Order
          </Typography>
          {props.words.map((word) => (
            <WordCard key={word.word} word={word} />
          ))}
        </>
      )}

      {props.notFound.length > 0 && (
        <>
          <Typography key='header-notfound' variant='h5'>
            Words not found in Frequency Lists
          </Typography>
          {props.notFound.map((word) => (
            <WordCardMini key={word} word={word} />
          ))}
        </>
      )}
    </Stack>
  );
};

export default SearchResultsLayout;
