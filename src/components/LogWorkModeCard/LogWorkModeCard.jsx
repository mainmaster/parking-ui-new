import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { secondaryButtonStyle, cardContainerStyle } from '../../theme/styles';
import {
  editModalHandler,
  deleteWorkingModeFetch
} from 'store/workingModes/workingModesSlice';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { passModeOptions } from 'constants';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

export default function LogWorkModeCard({ mode }) {
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

  let RURuble = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  });

  const passModeName = useMemo(() => {
    return passModeOptions.find((item) => item.value === mode.pass_mode);
  }, [mode]);

  const handleEditModeClick = () => {
    dispatch(editModalHandler(mode.id));
  };

  const handleDeleteModeClick = () => {
    dispatch(deleteWorkingModeFetch(mode.id));
  };

  return (
    <Box
      sx={[cardContainerStyle({ ...theme }), isMobile && { minWidth: '320px' }]}
    >
      <Stack gap={'16px'}>
        <Typography sx={titleTextStyle}>{mode.description}</Typography>
        <Stack gap={'12px'} sx={{ minHeight: '216px' }}>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>Пропускной режим</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {passModeName?.name}
            </Typography>
          </Stack>
          {mode.pass_mode !== 'closed' && (
            <Stack direction={'row'} gap={'12px'}>
              <Typography sx={labelTextStyle}>Цена</Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {RURuble.format(mode.price)}
              </Typography>
            </Stack>
          )}
          {mode.pass_mode === 'pay_by_hour' && (
            <Stack direction={'row'} gap={'12px'}>
              <Typography sx={labelTextStyle}>Входная плата</Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {RURuble.format(mode.entry_fee)}
              </Typography>
            </Stack>
          )}
          {mode.pass_mode === 'pay_by_interval' && (
            <Stack direction={'row'} gap={'12px'}>
              <Typography sx={labelTextStyle}>Интервал</Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {`${mode.interval} мин`}
              </Typography>
            </Stack>
          )}
          {mode.pass_mode === 'pay_by_day' && (
            <Stack direction={'row'} gap={'12px'}>
              <Typography sx={labelTextStyle}>
                Задержка для запуска суточного режима
              </Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {`${mode.day_counts_from_mins} мин`}
              </Typography>
            </Stack>
          )}
          {mode.pass_mode === 'pay_by_first_hours' && (
            <Stack direction={'row'} gap={'12px'}>
              <Typography sx={labelTextStyle}>
                Количество первых N минут
              </Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {`${mode.number_of_first_mins} мин`}
              </Typography>
            </Stack>
          )}
          {(mode.pass_mode === 'pay_by_hour' ||
            mode.pass_mode === 'pay_by_interval' ||
            mode.pass_mode === 'closed') && (
            <Stack direction={'row'} gap={'12px'}>
              <Typography sx={labelTextStyle}>
                Время транзитной блокировки
              </Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {`${mode.transit_block_time_min} мин`}
              </Typography>
            </Stack>
          )}
          {mode.pass_mode === 'pay_by_hour' && (
            <Stack direction={'row'} gap={'12px'}>
              <Typography sx={labelTextStyle}>Свободное время</Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {`${mode.free_time_min} мин`}
              </Typography>
            </Stack>
          )}
          {(mode.pass_mode === 'pay_by_hour' ||
            mode.pass_mode === 'closed') && (
            <>
              <Stack direction={'row'} gap={'12px'}>
                <Typography sx={labelTextStyle}>Время от</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {`${mode.time_gte_hour}`.padStart(2, '0') +
                    ':' +
                    `${mode.time_gte_min}`.padStart(2, '0')}
                </Typography>
              </Stack>
              <Stack direction={'row'} gap={'12px'}>
                <Typography sx={labelTextStyle}>Время до</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {`${mode.time_lte_hour}`.padStart(2, '0') +
                    ':' +
                    `${mode.time_lte_min}`.padStart(2, '0')}
                </Typography>
              </Stack>
            </>
          )}
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
