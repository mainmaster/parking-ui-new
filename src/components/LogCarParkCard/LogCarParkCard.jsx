import { useDispatch } from 'react-redux';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { secondaryButtonStyle, cardContainerStyle } from '../../theme/styles';
import { CarNumberCard } from '../CarNumberCard/CarNumberCard';
import {
  editModalHandler,
  deleteCarParkFetch
} from 'store/carPark/carParkSlice';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';
import {useTranslation} from "react-i18next";

export default function LogCarParkCard({ car, renter }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const validDateString = format(parseISO(car.valid_until), 'dd.MM.yyyy');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const labelTextStyle = useMemo(() => {
    return {
      minWidth: '88px',
      color: theme.colors.element.secondary
    };
  }, [theme]);

  const handleEditCarClick = () => {
    dispatch(editModalHandler(car.id));
  };

  const handleDeleteCarClick = () => {
    dispatch(deleteCarParkFetch({ id: car.id }));
  };

  return (
    <Box
      sx={[cardContainerStyle({ ...theme }), isMobile && { minWidth: '320px' }]}
    >
      <Stack gap={'12px'}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <CarNumberCard carNumber={car.vehicle_plate} isTable />
          <Box sx={{ width: '100%' }}></Box>
          <Typography
            sx={{
              whiteSpace: 'nowrap',
              fontWeight: 500,
              color: theme.colors.element.secondary
            }}
          >{`№ ${car.id}`}</Typography>
        </Stack>
        <Stack gap={'4px'}>
          <Stack direction={'row'} gap={'8px'}>
            <Typography sx={labelTextStyle}>{t('components.logCarParkCard.description')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>{car.description}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'8px'}>
            <Typography sx={labelTextStyle}>{t('components.logCarParkCard.renter')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {renter?.company_name || ''}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>{t('components.logCarParkCard.accessTo')}</Typography>
          <Typography sx={{ fontWeight: 500 }}>{validDateString}</Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle({ ...theme })}
            onClick={handleEditCarClick}
          >
            {t('components.logCarParkCard.change')}
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle({ ...theme })}
            onClick={handleDeleteCarClick}
          >
            {t('components.logCarParkCard.delete')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
