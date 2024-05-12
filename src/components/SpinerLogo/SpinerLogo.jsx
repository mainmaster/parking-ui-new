import RiveComponent from '@rive-app/react-canvas';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import spinerFile from '../../assets/riv/theme/logo.riv';
import vlSpinerFile from '../../assets/riv/vltheme/logo.riv';

export default function SpinerLogo() {
  const theme = useTheme();
  return (
    <Box sx={{ width: '180px', height: '180px' }}>
      <RiveComponent
        src={theme.name == 'vltheme' ? vlSpinerFile : spinerFile}
      />
    </Box>
  );
}
