import { Box } from '@mui/material';
import { spacers } from '../../theme/spacers';

export default function SettingsSpacer({ tabs }) {
  return (
    <Box
      sx={{ minHeight: tabs ? spacers.carpark : spacers.applications }}
    ></Box>
  );
}
