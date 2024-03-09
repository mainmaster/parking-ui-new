import { Box } from '@mui/material';
import { spacers } from '../../theme/spacers';
import { isMobile } from 'react-device-detect';

export default function HeaderSpacer() {
  return <Box sx={{ minHeight: isMobile ? spacers.header : 0 }}></Box>;
}
