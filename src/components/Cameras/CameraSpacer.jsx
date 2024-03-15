import { Box } from '@mui/material';
import { spacers } from '../../theme/spacers';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function CameraSpacer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return <Box sx={{ minHeight: isMobile ? 0 : spacers.cameras }}></Box>;
}
