import { createTheme } from '@mui/material/styles';
import '@fontsource-variable/onest';
import { colors } from './colors';

const theme = createTheme({
  typography: {
    fontFamily: 'Onest Variable',

    allVariants: {
      color: colors.element.primary,
      lineHeight: '1.125rem'
    }
  }
});

export default theme;
