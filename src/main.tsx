import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { RouterProvider } from './providers/RouteProvider';
import './index.scss';
import theme from './assets/theme'
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from '@mui/material';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <AppProvider>
          <RouterProvider />
        </AppProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
