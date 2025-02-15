import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { SkeletonTheme } from 'react-loading-skeleton';
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
import './global.css';
// Components
import App from 'components/App';
// Global styles
import { styled } from '@mui/material/styles';
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
import { SnackbarProvider, MaterialDesignContent } from 'notistack';
import { ThemeProvider } from '@mui/material';
import theme from './theme/normal';
import vltheme from './theme/vlnormal';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import errorIcon from './assets/svg/login_error_icon.svg';
import '../src/translation/index.js';
import { ru, enUS } from 'date-fns/locale';

const container = document.getElementById('root');
const root = createRoot(container);
const currentTheme = process.env.THEME === 'vl' ? vltheme : theme;

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent-error': {
    backgroundColor: currentTheme.colors.element.error,
    borderRadius: '8px',
    paddingTop: '6px',
    height: '40px',
    '& #notistack-snackbar': {
      padding: 0
    }
  }
}));

root.render(
  <ThemeProvider theme={currentTheme}>
    <Suspense fallback={'loading'}>
      <ApiProvider api={apiSlice}>
        <SkeletonTheme baseColor="rgb(170, 170, 170)">
          <Provider store={store}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={ru}
            >
              <SnackbarProvider
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center'
                }}
                iconVariant={{
                  error: (
                    <img
                      style={{ width: '24px', marginRight: '8px' }}
                      src={errorIcon}
                      alt="Error"
                    />
                  )
                }}
                Components={{
                  error: StyledMaterialDesignContent
                }}
              >
                <App />
              </SnackbarProvider>
            </LocalizationProvider>
          </Provider>
        </SkeletonTheme>
      </ApiProvider>
    </Suspense>
  </ThemeProvider>
);
