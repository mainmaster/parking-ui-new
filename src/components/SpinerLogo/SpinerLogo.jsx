import RiveComponent from '@rive-app/react-canvas';
import { Box } from '@mui/material';
import spinerFile from '../../assets/riv/logo.riv';

export default function SpinerLogo() {
  return (
    <Box sx={{ width: '180px', height: '180px' }}>
      <RiveComponent src={spinerFile} />
    </Box>
  );
}
