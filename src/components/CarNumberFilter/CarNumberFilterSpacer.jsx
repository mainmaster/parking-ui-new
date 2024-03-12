import { Box } from '@mui/material';
import { spacers } from '../../theme/spacers';
import { isMobile } from 'react-device-detect';

export default function CarNumberFilterSpacer({ openForm }) {
  return (
    <Box
      sx={{
        minHeight: isMobile ? 0 : openForm ? spacers.filterOpen : spacers.filter
      }}
    ></Box>
  );
}
