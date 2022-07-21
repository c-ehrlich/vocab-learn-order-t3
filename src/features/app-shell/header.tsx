// MUI imports
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import HelpIcon from '@mui/icons-material/Help';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SettingsIcon from '@mui/icons-material/Settings';

// Other imports
import { useAtom } from 'jotai';
import { isSearchingAtom } from '../../utils/jotai';
import { useState } from 'react';
import Sliders from './frequency-sliders';
import MaterialModal from './material-modal';
import HelpModalContents from './help-modal-contents';
import { COLOR_LIGHT } from '../../theme/defaultTheme';

function Header() {
  const [isSearching, setIsSearching] = useAtom(isSearchingAtom);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [anchorElFrequency, setAnchorElFrequency] =
    useState<null | HTMLElement>(null);

  return (
    <AppBar position='sticky'>
      <Container maxWidth='md' disableGutters>
        <Toolbar>
          <Box sx={{ flexGrow: 0 }}>
            {isSearching ? (
              <IconButton
                aria-label='back'
                onClick={() => setIsSearching(false)}
              >
                <ArrowBackIosNewIcon fontSize='large' />
              </IconButton>
            ) : (
              <IconButton
                aria-label='settings'
                onClick={(e) => setAnchorElFrequency(e.currentTarget)}
              >
                <SettingsIcon fontSize='large' />
              </IconButton>
            )}
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElFrequency}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElFrequency)}
              onClose={() => setAnchorElFrequency(null)}
            >
              <Sliders />
            </Menu>
          </Box>
          <Typography
            fontFamily='EB Garamond'
            fontWeight='400'
            letterSpacing={-0.5}
            sx={{
              flexGrow: 1,
              display: 'flex',
              color: COLOR_LIGHT,
              fontSize: '38px',
              // TODO size 28 at 480px or less (is this a material breakpoint?)
            }}
            justifyContent='center'
            textAlign='center'
          >
            vocab learn order
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            {isSearching ? (
              <IconButton
                aria-label='save'
                onClick={async () => {
                  // TODO implement this (how with react query?)
                  // saveRemainingWordsToClipboard();
                }}
              >
                <SaveAltIcon fontSize='large' />
              </IconButton>
            ) : (
              <IconButton
                aria-label='help'
                onClick={() => setHelpModalOpen(true)}
              >
                <HelpIcon fontSize='large' />
              </IconButton>
            )}
          </Box>
          <MaterialModal
            open={helpModalOpen}
            handleClose={() => setHelpModalOpen(false)}
          >
            <HelpModalContents handleClose={() => setHelpModalOpen(false)} />
          </MaterialModal>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
