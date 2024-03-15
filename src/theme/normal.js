import { createTheme } from '@mui/material/styles';
import '@fontsource-variable/onest';
import { colors } from './colors';
import VeranoSansSemibold from '../assets/fonts/VeranoSans-SemiBold.ttf';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1024,
      lg: 1200,
      xl: 1536
    }
  },
  typography: {
    fontFamily: 'Onest Variable',

    allVariants: {
      color: colors.element.primary,
      lineHeight: '1.125rem'
    }
  }
});

export default theme;

export const veranoTheme = createTheme({
  typography: {
    fontFamily: ['VeranoSemibold', 'sans-serif'].join(',')
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@font-face': {
          fontFamily: 'VeranoSemibold',
          src: `local('VeranoSans-SemiBold'), url(${VeranoSansSemibold}) format('ttf')`
        }
      }
    }
  }
});
