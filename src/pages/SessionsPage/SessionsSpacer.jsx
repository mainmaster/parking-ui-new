import { Box } from '@mui/material';
import { spacers } from '../../theme/spacers';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from 'react-redux';

export default function SessionsSpacer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const userType = useSelector((state) => state.parkingInfo.userType);
  return (
    <>
      <Box sx={{ minHeight: isMobile ? 0 : spacers.sessions }}></Box>
      {userType === 'admin' && (
        <Box sx={{ minHeight: isMobile ? 0 : spacers.sessions_admin }}></Box>
      )}
    </>
  );
}
