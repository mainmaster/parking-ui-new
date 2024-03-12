import { Box } from '@mui/material';
import { spacers } from '../../theme/spacers';
import { isMobile } from 'react-device-detect';

export default function CameraSpacer() {
  return <Box sx={{ minHeight: isMobile ? 0 : spacers.cameras }}></Box>;
}
