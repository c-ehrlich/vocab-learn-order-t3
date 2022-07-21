import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { COLOR_LIGHT } from '../../theme/defaultTheme';
import { searchFieldInputAtom } from '../../utils/jotai';
import { sampleText } from '../../utils/sampleText';

type Props = {
  handleClose: () => void;
};

const HelpModalContents = (props: Props) => {
  // const {serverResponse } = useStore();

  const [_, setSearchFieldInput] = useAtom(searchFieldInputAtom);

  const handlePopulateTextClick = () => {
    setSearchFieldInput(sampleText);
    props.handleClose();
  };

  // const handleGetPreviousWords = () => {
  //   const words = getLocalStorageOrDefault(
  //     'vocablist',
  //     '(no previous input found)'
  //   );
  //   console.log(words);
  //   const strippedWords = words.replaceAll('"', '');
  //   setSearchFieldInput(strippedWords);
  //   props.handleClose();
  // };

  return (
    <>
      <Typography>How to use:</Typography>
      <Box>
        <ul>
          <li>
            Enter a list of Japanese words (just about any formatting should be
            ok). If you just want to demo the app, click the button below to get
            some sample input.
          </li>
          <li>
            Adjust the Frequency List weightings if you want, by clicking the
            settings button. Any changes you make will be stored on your
            computer so they will still be there the next time you visit this
            site.
          </li>
          <li>
            Click <strong>Search</strong> to see your words, sorted by optimal
            learn order. Use{' '}
            <Link href='https://chrome.google.com/webstore/detail/yomichan/ogmnaimimemjmbakcfefmnahgdfhfami'>
              Yomichan
            </Link>{' '}
            to create <Link href='https://apps.ankiweb.net/'>Anki</Link> cards,
            and get sample sentences from YouGlish or ImmersionKit.
          </li>
        </ul>
      </Box>
      {/* {serverResponse === null && (
        <Grid container justifyContent='center'>
          <Button
            onClick={handlePopulateTextClick}
            aria-label='Create Sample Input'
            variant='outlined'
            sx={{ marginY: 1, color: COLOR_LIGHT }}
          >
            Create Sample Input
          </Button>
          <Typography>
            Did you close the window without first saving your words?
          </Typography>
          <Button
            // onClick={handleGetPreviousWords}
            aria-label='Restore previous words'
            variant='outlined'
            sx={{ marginY: 1, color: COLOR_LIGHT }}
          >
            Get previous words (TODO)
          </Button>
        </Grid>
      )} */}
      <Grid container justifyContent='center'>
        <Grid item xs={12}>
          <Typography align='center'>
            <Link href='https://github.com/c-ehrlich/vocab-learn-order'>
              view source code
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default HelpModalContents;
