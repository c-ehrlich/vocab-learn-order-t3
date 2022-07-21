// src/pages/_app.tsx
import '../styles/globals.css';
import type { AppType } from 'next/dist/shared/lib/utils';
import { trpc } from '../utils/trpc';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { defaultTheme } from '../theme/defaultTheme';
import Header from '../features/app-shell/header';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Header />
      <Component {...pageProps} />;
    </ThemeProvider>
  );
};

export default trpc.withTRPC(MyApp);
