import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useParkingInfoQuery } from '../../api/settings/settings';
import React from 'react';
import { colors } from '../../theme/colors';

export default function ParkingInfo({ fullWidth }) {
  const { data: parkingInfo } = useParkingInfoQuery();
  const ocupied =
    parkingInfo?.carsOnParking.totalPlaces -
    parkingInfo?.carsOnParking.freePlaces;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Stack
      direction={isMobile ? 'column' : 'row'}
      justifyContent={'flex-end'}
      gap={isMobile ? '4px' : '16px'}
      sx={{
        width: '100%',
        flexGrow: 1,
        maxWidth: fullWidth ? '100%' : '640px'
      }}
    >
      <Stack direction={isMobile ? 'row' : 'column'}>
        <Typography
          sx={{ fontWeight: 500 }}
        >{`${parkingInfo?.carsOnParking.totalPlaces}`}</Typography>
        <Typography sx={{ fontWeight: 500 }}>мест:</Typography>
      </Stack>
      <Stack
        direction={'row'}
        sx={{
          border: `1px solid ${colors.outline.separator}`,
          borderRadius: '8px',
          width: '100%',
          //maxWidth: '566px',
          minWidth: '200px',
          flexGrow: 1,
          height: '40px',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: '8px',
            border: `1px solid ${colors.element.primary}`,
            width: `${
              (ocupied / parkingInfo?.carsOnParking.totalPlaces) * 100
            }%`,
            height: '40px',
            backgroundColor: colors.surface.high
          }}
        >
          <Typography
            sx={{
              position: 'absolute',
              top: '11px',
              left: '8px',
              fontWeight: 500,
              whiteSpace: 'nowrap'
            }}
          >{`${
            parkingInfo?.carsOnParking.totalPlaces -
            parkingInfo?.carsOnParking.freePlaces
          } занято`}</Typography>
        </Box>
        <Typography
          sx={{
            position: 'absolute',
            top: '11px',
            right: '8px',
            fontWeight: 500
          }}
        >{`${parkingInfo?.carsOnParking.freePlaces} свободно`}</Typography>
      </Stack>
    </Stack>
  );
}
