import { createTheme } from '@mui/material/styles';
import '@fontsource-variable/onest';
import { vlcolors } from './vlcolors';
import { vlicons } from '../components/Header/utils';

const vltheme = createTheme({
  colors: vlcolors,
  icons: vlicons,
  name: 'vltheme',
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
      color: vlcolors.element.primary,
      lineHeight: '1.125rem'
    }
  },
  components: {
    MuiAccordionSummary: {
      styleOverrides: {
        content: {
          margin: 0
        }
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    }
  }
});
export default vltheme;
