import { Box } from '@mui/material';
import { spacers } from '../../theme/spacers';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function FooterSpacer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return <Box sx={{ minHeight: isMobile ? spacers.footer : 0 }}></Box>;
}
