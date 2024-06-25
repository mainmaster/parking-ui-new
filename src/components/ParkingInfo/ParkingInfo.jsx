import {
  Box,
  Stack,
  Typography,
  Tooltip,
  styled,
  tooltipClasses,
  IconButton
} from '@mui/material';
import _ from 'lodash';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useParkingInfoQuery } from '../../api/settings/settings';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import detailsIcon from '../../assets/svg/parkinfo_details_open_icon.svg';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colors.chart.free,
    maxWidth: '120px',
    border: `1px solid ${theme.colors.outline.default}`,
    borderRadius: '8px',
    p: '8px 12px'
  }
}));

const mobileBoxStyle = {
  height: '86px',
  p: '16px',
  pb: '8px',
  width: '100%'
};

const detailSquareStyle = {
  width: '18px',
  height: '18px',
  borderRadius: '4px'
};

export default function ParkingInfo({ fullWidth }) {
  const { data: parkingInfo, refetch: refetchParkingData } = useParkingInfoQuery();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [details, setDetails] = useState(false);
  const [renterDetails, setRenterDetails] = useState(false);
  const interval = useRef(null);

  useEffect(() => {
    interval.current = setInterval(() => {
      refetchParkingData();
    }, 5000);

    return () => {
      clearInterval(interval.current);
    }
  }, []);

  const ocupied = useMemo(
    () =>
      parkingInfo?.carsOnParking.totalPlaces -
      parkingInfo?.carsOnParking.freePlaces,
    [parkingInfo]
  );

  const renters = useMemo(
    () =>
      parkingInfo?.carsOnParking.totalPlaces -
      parkingInfo?.carsOnParking.freePlaces -
      parkingInfo?.carsOnParking.single -
      parkingInfo?.carsOnParking.subscribe,
    [parkingInfo]
  );

  return (
    <>
      <Box sx={isMobile ? mobileBoxStyle : { width: '100%' }}>
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
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Stack direction={isMobile ? 'row' : 'column'}>
              <Typography
                sx={{ fontWeight: 500 }}
              >{`${parkingInfo?.carsOnParking.totalPlaces}`}</Typography>
              <Typography sx={{ fontWeight: 500 }}>мест:</Typography>
            </Stack>
            {isMobile && (
              <Stack direction={'row'} gap={'5px'}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: theme.colors.element.secondary
                  }}
                >
                  {details ? 'Свернуть детали' : 'Развернуть детали'}
                </Typography>
                <IconButton
                  sx={{ padding: 0 }}
                  onClick={() => setDetails(!details)}
                  disableRipple
                >
                  <img
                    src={detailsIcon}
                    alt={'details'}
                    style={{
                      width: '15px',
                      transform: details ? 'none' : 'rotate(180deg)'
                    }}
                  />
                </IconButton>
              </Stack>
            )}
          </Stack>
          <Stack
            direction={'row'}
            sx={{
              border: `1px solid ${theme.colors.outline.separator}`,
              borderRadius: '8px',
              width: '100%',
              //maxWidth: '566px',
              minWidth: '200px',
              flexGrow: 1,
              height: '40px',
              position: 'relative'
            }}
          >
            <HtmlTooltip
              title={
                <React.Fragment>
                  <Typography
                    color={theme.colors.element.primary}
                    sx={{
                      fontWeight: 500,
                      fontSize: '1.5rem',
                      lineHeight: '1.75rem'
                    }}
                  >
                    {`${renters} мест`}
                  </Typography>
                  <Typography
                    color={theme.colors.element.secondary}
                    sx={{ fontWeight: 500 }}
                  >
                    Арендаторы
                  </Typography>
                  {parkingInfo?.carsOnParking?.renters_places_detail &&
                    Object.keys(
                      parkingInfo.carsOnParking.renters_places_detail
                    ).map((key) => {
                      return (
                        <Box sx={{ p: '8px' }}>
                          <Typography
                            color={theme.colors.element.primary}
                            sx={{
                              fontWeight: 500
                            }}
                          >
                            {`${parkingInfo.carsOnParking.renters_places_detail[key]} мест`}
                          </Typography>
                          <Typography
                            color={theme.colors.element.secondary}
                            sx={{ fontWeight: 500 }}
                          >
                            {key}
                          </Typography>{' '}
                        </Box>
                      );
                    })}
                </React.Fragment>
              }
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  borderRadius: '8px',
                  border: `1px solid ${theme.colors.element.primary}`,
                  width: `${
                    (ocupied / parkingInfo?.carsOnParking.totalPlaces) * 100
                  }%`,
                  height: '40px',
                  backgroundColor: theme.colors.chart.tenants
                }}
              ></Box>
            </HtmlTooltip>
            {parkingInfo?.carsOnParking?.subscribe && (
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <Typography
                      color={theme.colors.element.primary}
                      sx={{
                        fontWeight: 500,
                        fontSize: '1.5rem',
                        lineHeight: '1.75rem'
                      }}
                    >
                      {`${parkingInfo?.carsOnParking?.subscribe} мест`}
                    </Typography>
                    <Typography
                      color={theme.colors.element.secondary}
                      sx={{ fontWeight: 500 }}
                    >
                      Абонементы
                    </Typography>
                  </React.Fragment>
                }
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    borderRadius: '8px',
                    borderTopRightRadius: '0px',
                    borderBottomRightRadius: '0px',
                    border: `1px solid ${theme.colors.element.primary}`,
                    borderRight: 'none',
                    width: `${
                      (parkingInfo.carsOnParking.subscribe /
                        parkingInfo.carsOnParking.totalPlaces) *
                      100
                    }%`,
                    height: '40px',
                    backgroundColor: theme.colors.chart.subscribers
                  }}
                ></Box>
              </HtmlTooltip>
            )}
            {parkingInfo?.carsOnParking?.single && (
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <Typography
                      color={theme.colors.element.primary}
                      sx={{
                        fontWeight: 500,
                        fontSize: '1.5rem',
                        lineHeight: '1.75rem'
                      }}
                    >
                      {`${parkingInfo?.carsOnParking?.single} мест`}
                    </Typography>
                    <Typography
                      color={theme.colors.element.secondary}
                      sx={{ fontWeight: 500 }}
                    >
                      Разовые
                    </Typography>
                  </React.Fragment>
                }
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    borderRadius: '8px',
                    borderTopRightRadius: '0px',
                    borderBottomRightRadius: '0px',
                    border: `1px solid ${theme.colors.element.primary}`,
                    borderRight: 'none',
                    width: `${
                      (parkingInfo.carsOnParking.single /
                        parkingInfo.carsOnParking.totalPlaces) *
                      100
                    }%`,
                    height: '40px',
                    backgroundColor: theme.colors.chart.one_time
                  }}
                ></Box>
              </HtmlTooltip>
            )}
            <Typography
              sx={{
                position: 'absolute',
                top: '11px',
                left: '8px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                pointerEvents: 'none'
              }}
            >{`${
              parkingInfo?.carsOnParking.totalPlaces -
              parkingInfo?.carsOnParking.freePlaces
            } занято`}</Typography>
            <Typography
              sx={{
                position: 'absolute',
                top: '11px',
                right: '8px',
                fontWeight: 500,
                pointerEvents: 'none'
              }}
            >{`${parkingInfo?.carsOnParking.freePlaces} свободно`}</Typography>
          </Stack>
        </Stack>
      </Box>
      {isMobile && details && (
        <Stack
          gap={'4px'}
          sx={{
            pb: '8px',
            borderBottom: `1px solid ${theme.colors.outline.surface}`
          }}
        >
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            gap={'4px'}
            sx={{ p: '8px 16px' }}
          >
            <Stack direction={'row'} gap={'4px'}>
              <Box
                sx={[
                  detailSquareStyle,
                  {
                    border: `1px solid ${theme.colors.element.primary}`,
                    backgroundColor: theme.colors.element.light
                  }
                ]}
              ></Box>
              <Typography>Свободно</Typography>
            </Stack>
            <Stack direction={'row'} gap={'4px'}>
              <Typography sx={{ fontWeight: 500 }}>
                {parkingInfo?.carsOnParking?.freePlaces} мест
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            gap={'4px'}
            sx={{ p: '8px 16px' }}
          >
            <Stack direction={'row'} gap={'4px'}>
              <Box
                sx={[
                  detailSquareStyle,
                  {
                    border: `1px solid ${theme.colors.element.primary}`,
                    backgroundColor: theme.colors.chart.one_time
                  }
                ]}
              ></Box>
              <Typography>Разовые</Typography>
            </Stack>
            <Stack direction={'row'} gap={'4px'}>
              <Typography sx={{ fontWeight: 500 }}>
                {parkingInfo?.carsOnParking?.single} мест
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            gap={'4px'}
            sx={{ p: '8px 16px' }}
          >
            <Stack direction={'row'} gap={'4px'}>
              <Box
                sx={[
                  detailSquareStyle,
                  {
                    border: `1px solid ${theme.colors.element.primary}`,
                    backgroundColor: theme.colors.chart.subscribers
                  }
                ]}
              ></Box>
              <Typography>Абонементы</Typography>
            </Stack>
            <Stack direction={'row'} gap={'4px'}>
              <Typography sx={{ fontWeight: 500 }}>
                {parkingInfo?.carsOnParking?.subscribe} мест
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            gap={'4px'}
            sx={{ p: '8px 16px' }}
          >
            <Stack direction={'row'} gap={'4px'}>
              <Box
                sx={[
                  detailSquareStyle,
                  {
                    border: `1px solid ${theme.colors.element.primary}`,
                    backgroundColor: theme.colors.chart.tenants
                  }
                ]}
              ></Box>
              <Typography>Арендаторы</Typography>
              {parkingInfo?.carsOnParking?.renters_places_detail &&
                !_.isEmpty(parkingInfo.carsOnParking.renters_places_detail) && (
                  <IconButton
                    sx={{ padding: 0 }}
                    onClick={() => setRenterDetails(!renterDetails)}
                    disableRipple
                  >
                    <img
                      src={detailsIcon}
                      alt={'renter details'}
                      style={{
                        width: '15px',
                        transform: renterDetails ? 'none' : 'rotate(180deg)'
                      }}
                    />
                  </IconButton>
                )}
            </Stack>
            <Stack direction={'row'} gap={'4px'}>
              <Typography sx={{ fontWeight: 500 }}>{renters} мест</Typography>
            </Stack>
          </Stack>
          {parkingInfo?.carsOnParking?.renters_places_detail &&
            !_.isEmpty(parkingInfo.carsOnParking.renters_places_detail) &&
            renterDetails &&
            Object.keys(parkingInfo.carsOnParking.renters_places_detail).map(
              (key) => {
                return (
                  <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    gap={'4px'}
                    sx={{ p: '8px 16px' }}
                  >
                    <Stack direction={'row'} gap={'4px'}>
                      <Box
                        sx={[
                          detailSquareStyle,
                          {
                            border: `1px solid ${theme.colors.element.primary}`,
                            backgroundColor: theme.colors.chart.tenants
                          }
                        ]}
                      ></Box>
                      <Typography>{`Арендатор ${key}`}</Typography>
                    </Stack>
                    <Stack direction={'row'} gap={'4px'}>
                      <Typography
                        sx={{ fontWeight: 500 }}
                      >{`${parkingInfo.carsOnParking.renters_places_detail[key]} мест`}</Typography>
                    </Stack>
                  </Stack>
                );
              }
            )}
        </Stack>
      )}
    </>
  );
}
