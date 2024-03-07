import { Box } from '@mui/material';
import { spacers } from '../../theme/spacers';

export default function HeaderSpacer() {
  const isMobile = window.orientation > 1;
  return <Box sx={{ minHeight: isMobile ? spacers.header : 0 }}></Box>;
}
