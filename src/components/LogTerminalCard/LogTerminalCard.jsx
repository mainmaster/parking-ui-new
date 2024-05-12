import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Box, Button, Stack, Typography } from '@mui/material';
import { secondaryButtonStyle, cardContainerStyle } from '../../theme/styles';
import { setEditTerminal } from '../../store/terminals/terminalsSlice';
import {
  useDeleteTerminalMutation,
  useActivateTerminalMutation
} from '../../api/terminal/terminal.api';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

export default function LogTerminalCard({ terminal }) {
  const { enqueueSnackbar } = useSnackbar();
  const [deleteTerminal] = useDeleteTerminalMutation();
  const [activateTerminal] = useActivateTerminalMutation();
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
    dispatch(setEditTerminal(terminal));
  };

  const handleActivateModeClick = () => {
    activateTerminal(terminal.id)
      .unwrap()
      .then((result) => {
        console.log(result);
        enqueueSnackbar('Терминал активирован', { variant: 'success' });
      })
      .catch(() => {
        enqueueSnackbar('Ошибка, попробуйте позже', {
          variant: 'error',
          iconVariant: 'warning'
        });
      });
  };

  const handleDeleteModeClick = () => {
    deleteTerminal(terminal.id);
  };

  return (
    <Box
      sx={[cardContainerStyle({ ...theme }), isMobile && { minWidth: '320px' }]}
    >
      <Stack gap={'16px'}>
        <Typography sx={titleTextStyle}>{terminal.description}</Typography>
        <Stack gap={'12px'}>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>Адрес</Typography>
            <Typography sx={{ fontWeight: 500 }}>{terminal.address}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>Место</Typography>
            <Typography sx={{ fontWeight: 500 }}>{terminal.place}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>Номер</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {terminal.automat_number}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>IP адрес</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {`${terminal.ip_address}:${terminal.port}`}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>Тип</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {terminal.terminal_type}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle({ ...theme })}
            onClick={handleActivateModeClick}
          >
            Тест
          </Button>
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
