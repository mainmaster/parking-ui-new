import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { secondaryButtonStyle, cardContainerStyle } from '../../theme/styles';
import {
  editModalHandler,
  deleteCameraFetch
} from 'store/cameras/camerasSlice';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

export default function LogCameraCard({ camera }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const labelTextStyle = useMemo(() => {
    return {
      minWidth: '160px',
      maxWidth: '160px',
      color: theme.colors.element.secondary
    };
  }, [theme]);

  const handleEditModeClick = () => {
    dispatch(editModalHandler(camera.id));
  };

  const handleDeleteModeClick = () => {
    dispatch(deleteCameraFetch(camera.id));
  };

  return (
    <Box
      sx={[cardContainerStyle({ ...theme }), isMobile && { minWidth: '320px' }]}
    >
      <Stack gap={'16px'}>
        <Typography sx={titleTextStyle}>{camera.description}</Typography>
        <Stack gap={'12px'} sx={{ minHeight: '216px' }}>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>IP адрес</Typography>
            <Typography sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}>
              {`${camera.ip_address}:${camera.port}`}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>Логин</Typography>
            <Typography sx={{ fontWeight: 500 }}>{camera.login}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>Пароль</Typography>
            <Typography sx={{ fontWeight: 500 }}>{camera.password}</Typography>
          </Stack>
          <Stack gap={'4px'}>
            <Typography sx={labelTextStyle}>Ссылка на трансляцию</Typography>
            <Typography sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}>
              {camera.mjpeg_url}
            </Typography>
          </Stack>
          <Stack gap={'4px'}>
            <Typography sx={labelTextStyle}>Ссылка на снапшот</Typography>
            <Typography sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}>
              {camera.snapshot_url}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle({ ...theme })}
            onClick={handleEditModeClick}
          >
            Изменить
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle({ ...theme })}
            onClick={handleDeleteModeClick}
          >
            Удалить
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
