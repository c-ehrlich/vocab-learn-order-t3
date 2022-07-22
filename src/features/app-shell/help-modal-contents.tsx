// MUI imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

// other imports
import { useAtom } from 'jotai';
import { COLOR_LIGHT } from '../../theme/defaultTheme';
import { searchFieldInputAtom } from '../../utils/jotai';
import { sampleText } from '../../utils/sampleText';

type Props = {
  handleClose: () => void;
};

const HelpModalContents = (props: Props) => {
  const [__searchFieldInput, setSearchFieldInput] =
    useAtom(searchFieldInputAtom);

  const handlePopulateTextClick = () => {
    setSearchFieldInput(sampleText);
    props.handleClose();
  };

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

      <Grid container justifyContent='center'>
        <Button
          onClick={handlePopulateTextClick}
          aria-label='Create Sample Input'
          variant='outlined'
          sx={{ marginY: 1, color: COLOR_LIGHT }}
        >
          Create Sample Input
        </Button>
      </Grid>

      <Grid container justifyContent='center'>
        <Grid item xs={12}>
          <Typography align='center'>
            <Link href='https://github.com/c-ehrlich/vocab-learn-order-t3'>
              view source code
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default HelpModalContents;
