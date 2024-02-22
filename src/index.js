import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { SkeletonTheme } from 'react-loading-skeleton';
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
import './global.css';
// Components
import App from 'components/App';
// Global styles
import 'react-tooltip/dist/react-tooltip.css';
import 'react-18-image-lightbox/style.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'styles/reset.scss';
import 'styles/fonts.scss';
import 'styles/common.scss';
// Store
import { store } from 'store';
// Api
import { apiSlice } from './api/apiSlice';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/material';
import theme from './theme/normal';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ThemeProvider theme={theme}>
    <ApiProvider api={apiSlice}>
      <SkeletonTheme baseColor="rgb(170, 170, 170)">
        <Provider store={store}>
          <SnackbarProvider
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SnackbarProvider>
        </Provider>
      </SkeletonTheme>
    </ApiProvider>
  </ThemeProvider>
);
