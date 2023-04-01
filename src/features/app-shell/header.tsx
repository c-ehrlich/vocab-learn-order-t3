// MUI imports
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Snackbar from "@mui/material/Snackbar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import HelpIcon from "@mui/icons-material/Help";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import SettingsIcon from "@mui/icons-material/Settings";

// Other imports
import { useAtom } from "jotai";
import {
  frequencyListWeightsAtom,
  isSearchingAtom,
  searchWordsAtom,
} from "../../utils/jotai";
import { useState } from "react";
import Sliders from "./frequency-sliders";
import MaterialModal from "./material-modal";
import HelpModalContents from "./help-modal-contents";
import { COLOR_LIGHT } from "../../theme/defaultTheme";
import { trpc } from "../../utils/trpc";

function Header() {
  const [isSearching, setIsSearching] = useAtom(isSearchingAtom);
  const [frequencyListWeights, __setFrequencyListWeights] = useAtom(
    frequencyListWeightsAtom
  );
  const [searchWords, __setSearchWords] = useAtom(searchWordsAtom);

  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [failureSnackbarOpen, setFailureSnackbarOpen] = useState(false);
  const [anchorElFrequency, setAnchorElFrequency] =
    useState<null | HTMLElement>(null);

  const queryClient = trpc.useContext();

  const temporarilyOpenSnackbar = (
    openStateSetter: (value: React.SetStateAction<boolean>) => void
  ) => {
    openStateSetter(true);
    setTimeout(() => {
      openStateSetter(false);
    }, 3000);
  };

  async function saveRemainingWordsToClipboard() {
    const query = queryClient.vocab.learnOrder.getData({
      words: searchWords,
      weights: frequencyListWeights,
    });
    if (query) {
      let words = [] as string[];

      query.words.forEach((word) => {
        const multiplier = word.multiplier || 1;
        for (let i = 0; i < multiplier; i++) {
          words.push(word.word);
        }
      });
      query.notFound.forEach((word) => words.push(word));
      const text = words.join(", ");
      await navigator.clipboard.writeText(text);
      if ((await navigator.clipboard.readText()) === text) {
        temporarilyOpenSnackbar(setSuccessSnackbarOpen);
      } else {
        temporarilyOpenSnackbar(setFailureSnackbarOpen);
      }
    }
  }

  return (
    <AppBar position="sticky">
      <Container maxWidth="md" disableGutters>
        <Toolbar>
          <Box sx={{ flexGrow: 0 }}>
            {isSearching ? (
              <IconButton
                aria-label="back"
                onClick={() => setIsSearching(false)}
              >
                <ArrowBackIosNewIcon fontSize="large" />
              </IconButton>
            ) : (
              <IconButton
                aria-label="settings"
                onClick={(e) => setAnchorElFrequency(e.currentTarget)}
              >
                <SettingsIcon fontSize="large" />
              </IconButton>
            )}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElFrequency}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElFrequency)}
              onClose={() => setAnchorElFrequency(null)}
            >
              <Sliders />
            </Menu>
          </Box>
          <Typography
            fontFamily="EB Garamond"
            fontWeight="400"
            letterSpacing={-0.5}
            sx={{
              flexGrow: 1,
              display: "flex",
              color: COLOR_LIGHT,
              fontSize: "38px",
              // TODO size 28 at 480px or less (is this a material breakpoint?)
            }}
            justifyContent="center"
            textAlign="center"
          >
            vocab learn order
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            {isSearching ? (
              <IconButton
                aria-label="save"
                onClick={saveRemainingWordsToClipboard}
              >
                <SaveAltIcon fontSize="large" />
              </IconButton>
            ) : (
              <IconButton
                aria-label="help"
                onClick={() => setHelpModalOpen(true)}
              >
                <HelpIcon fontSize="large" />
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={successSnackbarOpen}
        onClose={() => setSuccessSnackbarOpen(false)}
        sx={{ width: "100%" }}
      >
        <Alert severity="success">Successfully copied to clipboard</Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={failureSnackbarOpen}
        onClose={() => setFailureSnackbarOpen(false)}
        sx={{ width: "100%" }}
      >
        <Alert severity="warning">
          Could not copy to clipboard. Please copy manually
        </Alert>
      </Snackbar>
    </AppBar>
  );
}

export default Header;
