import { useDispatch } from 'react-redux';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { colors } from '../../theme/colors';
import { secondaryButtonStyle } from '../../theme/styles';
import { CarNumberCard } from '../CarNumberCard/CarNumberCard';
import {
  editModalHandler,
  deleteCarParkFetch
} from 'store/carPark/carParkSlice';

const cardContainerStyle = {
  flex: '1 1 365px',
  minWidth: '365px',
  maxWidth: '466px',
  border: '1px solid ' + colors.outline.separator,
  borderTop: 'none',
  borderLeft: 'none',
  p: '16px',
  backgroundColor: colors.surface.low
};

const labelTextStyle = {
  minWidth: '88px',
  color: colors.element.secondary
};

export default function LogCarParkCard({ car }) {
  const dispatch = useDispatch();
  const validDateString = format(parseISO(car.valid_until), 'dd.MM.yyyy');

  const handleEditCarClick = () => {
    dispatch(editModalHandler(car.id));
  };

  const handleDeleteCarClick = () => {
    dispatch(
      deleteCarParkFetch({
        id: car.id
      })
    );
  };

  return (
    <Box sx={cardContainerStyle}>
      <Stack gap={'12px'}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <CarNumberCard carNumber={car.vehicle_plate} isTable />
          <Box sx={{ width: '100%' }}></Box>
          <Typography
            sx={{
              whiteSpace: 'nowrap',
              fontWeight: 500,
              color: colors.element.secondary
            }}
          >{`№ ${car.id}`}</Typography>
        </Stack>
        <Stack gap={'4px'}>
          <Stack direction={'row'} gap={'8px'}>
            <Typography sx={labelTextStyle}>Описание</Typography>
            <Typography sx={{ fontWeight: 500 }}>{car.description}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'8px'}>
            <Typography sx={labelTextStyle}>Компания</Typography>
            <Typography sx={{ fontWeight: 500 }}>{car.renter}</Typography>
          </Stack>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>Доступ до</Typography>
          <Typography sx={{ fontWeight: 500 }}>{validDateString}</Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle}
            onClick={handleEditCarClick}
          >
            Изменить
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle}
            onClick={handleDeleteCarClick}
          >
            Удалить
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
