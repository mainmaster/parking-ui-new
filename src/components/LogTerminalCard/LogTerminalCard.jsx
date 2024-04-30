import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Box, Button, Stack, Typography } from '@mui/material';
import { colors } from '../../theme/colors';
import { secondaryButtonStyle } from '../../theme/styles';
import { ITEM_MAX_WIDTH, ITEM_MIN_WIDTH } from '../../constants';
import { setEditTerminal } from '../../store/terminals/terminalsSlice';
import {
  useDeleteTerminalMutation,
  useActivateTerminalMutation
} from '../../api/terminal/terminal.api';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const cardContainerStyle = {
  flex: `1 1 ${ITEM_MIN_WIDTH}px`,
  minWidth: `${ITEM_MIN_WIDTH}px`,
  maxWidth: `${ITEM_MAX_WIDTH}px`,
  border: '1px solid ' + colors.outline.separator,
  borderTop: 'none',
  borderLeft: 'none',
  p: '16px',
  backgroundColor: colors.surface.low
};

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

const labelTextStyle = {
  minWidth: '88px',
  maxWidth: '88px',
  color: colors.element.secondary
};

export default function LogTerminalCard({ terminal }) {
  const { enqueueSnackbar } = useSnackbar();
  const [deleteTerminal] = useDeleteTerminalMutation();
  const [activateTerminal] = useActivateTerminalMutation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    <Box sx={[cardContainerStyle, isMobile && { minWidth: '320px' }]}>
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
            sx={secondaryButtonStyle}
            onClick={handleActivateModeClick}
          >
            Тест
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle}
            onClick={handleEditModeClick}
          >
            Изменить
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle}
            onClick={handleDeleteModeClick}
          >
            Удалить
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
