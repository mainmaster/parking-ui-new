import { Box } from '@mui/material';
import { spacers } from '../../theme/spacers';

export default function FooterSpacer() {
  const isMobile = window.orientation > 1;
  return <Box sx={{ minHeight: isMobile ? spacers.footer : 0 }}></Box>;
}
