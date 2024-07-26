import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Box, Button, Stack, Typography } from '@mui/material';
import { secondaryButtonStyle, cardContainerStyle } from '../../theme/styles';
import { setEditTerminal } from '../../store/terminals/terminalsSlice';
import {
  useDeleteTerminalMutation,
  useActivateTerminalMutation, useRebootTerminalMutation
} from '../../api/terminal/terminal.api';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';
import {useTranslation} from "react-i18next";

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

export default function LogTerminalCard({ terminal }) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteTerminal] = useDeleteTerminalMutation();
  const [activateTerminal] = useActivateTerminalMutation();
  const [rebootTerminal] = useRebootTerminalMutation();
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
        enqueueSnackbar(t('components.logTerminalCard.terminalActivated'), { variant: 'success' });
      })
      .catch(() => {
        enqueueSnackbar(t('components.logTerminalCard.error'), {
          variant: 'error',
          iconVariant: 'warning'
        });
      });
  };

  const handleDeleteModeClick = () => {
    deleteTerminal(terminal.id);
  };

  const handleRebootModeClick = () => {
    rebootTerminal(terminal.id).unwrap()
        .then((result) => {
          console.log(result);
          enqueueSnackbar(t('components.logTerminalCard.terminalRebooted'), { variant: 'success' });
        })
        .catch(() => {
          enqueueSnackbar(t('components.logTerminalCard.error'), {
            variant: 'error',
            iconVariant: 'warning'
          });
        });
  }

  return (
    <Box
      sx={[cardContainerStyle({ ...theme }), isMobile && { minWidth: '320px' }]}
    >
      <Stack gap={'16px'}>
        <Typography sx={titleTextStyle}>{terminal.description}</Typography>
        <Stack gap={'12px'}>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>{t('components.logTerminalCard.address')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>{terminal.address}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>{t('components.logTerminalCard.place')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>{terminal.place}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>{t('components.logTerminalCard.number')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {terminal.automat_number}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>{t('components.logTerminalCard.ipAddress')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {`${terminal.ip_address}:${terminal.port}`}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>{t('components.logTerminalCard.sshPort')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {`${terminal.ssh_port}`}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>{t('components.logTerminalCard.type')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {terminal.terminal_type}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction={'column'} gap={'8px'}>
          <Stack direction={'row'} gap={'8px'}>
            <Button
                disableRipple
                variant="contained"
                fullWidth
                sx={secondaryButtonStyle({ ...theme })}
                onClick={handleActivateModeClick}
            >
              {t('components.logTerminalCard.test')}
            </Button>
            <Button
                disableRipple
                variant="contained"
                fullWidth
                sx={secondaryButtonStyle({ ...theme })}
                onClick={handleRebootModeClick}
            >
              {t('components.logTerminalCard.reboot')}
            </Button>
          </Stack>
          <Stack direction={'row'} gap={'8px'}>
            <Button
                disableRipple
                variant="contained"
                fullWidth
                sx={secondaryButtonStyle({ ...theme })}
                onClick={handleEditModeClick}
            >
              {t('components.logTerminalCard.change')}
            </Button>
            <Button
                disableRipple
                variant="contained"
                fullWidth
                sx={secondaryButtonStyle({ ...theme })}
                onClick={handleDeleteModeClick}
            >
              {t('components.logTerminalCard.delete')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
