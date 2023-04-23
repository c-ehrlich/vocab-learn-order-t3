// MUI imports
import { styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { COLOR_LIGHT, COLOR_MID, COLOR_DARK } from "../../theme/defaultTheme";

// font imports
import "@fontsource/archivo";

// Other imports
import { useState } from "react";
import { useAtom } from "jotai";
import { isSearchingAtom, searchFieldInputAtom } from "../../utils/jotai";

const InputTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: COLOR_DARK,
  },
});

function SearchField() {
  const [__isSearching, setIsSearching] = useAtom(isSearchingAtom);
  const [searchFieldInput, setSearchFieldInput] = useAtom(searchFieldInputAtom);

  const [badResponseSnackbarOpen, setBadResponseSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  function handleSearch() {
    if (!searchFieldInput) {
      setSnackbarText("Please input something");
      setBadResponseSnackbarOpen(true);
    } else {
      setIsSearching(true);
    }
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={badResponseSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setBadResponseSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setBadResponseSnackbarOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarText}
        </Alert>
      </Snackbar>
      <InputTextField
        lang="ja"
        id="outlined-multiline-static"
        placeholder="Paste words here"
        multiline
        rows={16}
        value={searchFieldInput}
        onChange={(e) => setSearchFieldInput(e.target.value)}
        sx={{
          fontFamily: "Hiragino Kaku Pro, Meiryo",
          marginTop: 2,
          "& .MuiOutlinedInput-root": {
            "& > fieldset": {
              borderColor: `${COLOR_DARK} !important`,
            },
          },
        }}
        fullWidth
      />
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        columnSpacing={2}
        rowSpacing={2}
        sx={{ marginTop: 0 }}
      >
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            onClick={() => setSearchFieldInput("")}
            aria-label="clear"
            variant="outlined"
            startIcon={<ClearIcon />}
            size="large"
            sx={{
              backgroundColor: COLOR_MID,
              color: COLOR_DARK,
              "&:hover": {
                color: COLOR_LIGHT,
              },
            }}
          >
            Clear
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            onClick={handleSearch}
            aria-label="search"
            variant="outlined"
            startIcon={<SearchIcon />}
            size="large"
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export { SearchField };
