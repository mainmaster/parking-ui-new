import { Box } from '@mui/material';
import { spacers } from '../../theme/spacers';
import { isMobile } from 'react-device-detect';

export default function FooterSpacer() {
  return <Box sx={{ minHeight: isMobile ? spacers.footer : 0 }}></Box>;
}
