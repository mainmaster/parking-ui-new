import { useDispatch } from 'react-redux';
import { Box, Button, Stack, Typography } from '@mui/material';
import { secondaryButtonStyle, cardContainerStyle } from '../../theme/styles';
import {
  editModalHandler,
  deleteControllerFetch
} from 'store/controllers/controllersSlice';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

export default function LogControllerCard({ controller }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const labelTextStyle = useMemo(() => {
    return {
      minWidth: '88px',
      maxWidth: '88px',
      color: theme.colors.element.secondary
    };
  }, [theme]);

  const handleEditModeClick = () => {
    dispatch(editModalHandler(controller.id));
  };

  const handleDeleteModeClick = () => {
    dispatch(deleteControllerFetch(controller.id));
  };

  return (
    <Box
      sx={[cardContainerStyle({ ...theme }), isMobile && { minWidth: '320px' }]}
    >
      <Stack gap={'16px'}>
        <Typography sx={titleTextStyle}>{controller.description}</Typography>
        <Stack gap={'12px'}>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>IP адрес</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {`${controller.ip_address}:${controller.port}`}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>Пароль</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {controller.password}
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
