import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";
import { trpc } from "../utils/trpc";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { defaultTheme } from "../theme/defaultTheme";
import Header from "../features/app-shell/header";
import Head from "next/head";
import BodyWrapper from "../features/app-shell/body-wrapper";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Vocab Learn Order</title>
        <meta
          name="description"
          content="Determine what order to learn Japanese words in"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Header />
        <BodyWrapper>
          <Component {...pageProps} />
        </BodyWrapper>
      </ThemeProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
