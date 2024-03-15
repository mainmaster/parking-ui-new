import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import React, { forwardRef } from 'react';
import { CarNumberCard } from '../CarNumberCard/CarNumberCard';
import { useDispatch, useSelector } from 'react-redux';
import eventButtonIcon from '../../assets/svg/log_event_button_icon.svg';
import eventCarIcon from '../../assets/svg/log_event_car_icon.svg';
import eventPlateIcon from '../../assets/svg/log_event_plate_icon.svg';
import eventInIcon from '../../assets/svg/log_event_in_icon.svg';
import eventOutIcon from '../../assets/svg/log_event_out_icon.svg';
import { colors } from '../../theme/colors';
import { format, parseISO } from 'date-fns';
import { positiveButtonStyle, secondaryButtonStyle } from '../../theme/styles';
import TypeAuto from '../TypeAuto';
import { paidSessionFetch } from '../../store/sessions/sessionsSlice';
import { deleteBlackListFetch } from '../../store/blackList/blackListSlice';
import { changeDataModal } from '../../store/events/eventsSlice';
import { changeActiveOpenApModal } from '../../store/cameras/camerasSlice';
import { useNavigate } from 'react-router-dom';
import { typeText } from '../TypeAuto/types';

const selectedStyle = {
  animation: 'flipBackground 400ms ease-out 200ms',
  animationIterationCount: 2,
  '@keyframes flipBackground': {
    '0%': { backgroundColor: colors.surface.active },
    '50%': { backgroundColor: colors.surface.active },
    '100%': { backgroundColor: colors.surface.high }
  }
};

export default forwardRef(function LogEventCard(
  { event, onClickImage, selected },
  ref
) {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const dateString = format(
    parseISO(event.create_datetime),
    'dd.MM.yyyy HH:mm:ss'
  );

  const paidHandle = (id) => {
    dispatch(paidSessionFetch({ id, is_paid: true }));
  };

  const blackListHandle = (id) => {
    dispatch(
      deleteBlackListFetch({
        // id: item.id,
        // status: urlStatus['*']
      })
    );
  };

  const handleEventClick = () => {
    //dispatch(changeDataModal(event));
    window.open(`${window.location.href}/${event.id}`, '_blank', 'noreferrer');
  };

  return (
    <Box
      id={event.id}
      ref={ref}
      component={'div'}
      sx={[
        {
          p: '1rem',
          width: '100%',
          borderBottom: '1px solid ' + colors.outline.separator
        },
        selected && selectedStyle
      ]}
    >
      <Stack gap={'4px'}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Stack direction={'row'} gap={'4px'}>
            <CarNumberCard carNumber={event.vehicle_plate} isTable />
            {event.car_img_path !== '' && (
              <IconButton
                disableRipple
                sx={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.outline.separator}`,
                  backgroundColor: colors.button.secondary.default
                }}
                onClick={() =>
                  onClickImage(
                    process.env.REACT_APP_API_URL + '/' + event.car_img_path
                  )
                }
              >
                <img
                  style={{
                    width: 20
                  }}
                  src={eventCarIcon}
                  alt="автомобиль"
                />
              </IconButton>
            )}
          </Stack>
          <IconButton
            disableRipple
            sx={[
              secondaryButtonStyle,
              {
                width: '48px',
                height: '40px'
              }
            ]}
            onClick={handleEventClick}
          >
            <Typography sx={{ fontWeight: 500 }}>...</Typography>
          </IconButton>
        </Stack>
        {event.plate_img_path !== '' && (
          <IconButton
            disableRipple
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: `1px solid ${colors.outline.separator}`,
              backgroundColor: colors.button.secondary.default
            }}
            onClick={() =>
              onClickImage(
                process.env.REACT_APP_API_URL + '/' + event.plate_img_path
              )
            }
          >
            <img
              style={{
                width: 23.5
              }}
              src={eventPlateIcon}
              alt="номер"
            />
          </IconButton>
        )}
        <Stack>
          <Typography sx={{ fontWeight: 500, lineHeight: '1.125rem' }}>
            {event.description}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: colors.element.secondary,
              lineHeight: '0.875rem'
            }}
          >
            {dateString}
          </Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
          {((event.car_brand && event.car_brand !== '') ||
            typeText[event.access_status_code]) && (
            <>
              <IconButton
                disableRipple
                sx={{
                  width: '18px',
                  height: '18px',
                  borderRadius: 0,
                  cursor: 'inherit'
                }}
              >
                <img
                  style={{
                    width: '14.6px'
                  }}
                  src={eventCarIcon}
                  alt="img"
                />
              </IconButton>
              <Typography>{event.car_brand}</Typography>
            </>
          )}
          <TypeAuto type={event.access_status_code} />
        </Stack>
        <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
          {event.direction && (
            <img
              style={{
                width: '18px'
              }}
              src={event.direction === 'in' ? eventInIcon : eventOutIcon}
              alt={event.access_point_description}
            />
          )}
          <Typography>{event.access_point_description}</Typography>
        </Stack>
        <Stack
          direction={'row'}
          gap={'8px'}
          alignItems={'center'}
          justifyContent={'flex-start'}
        >
          {!event.is_recognition &&
            (event.event_code === 1003 || event.event_code === 1033) && (
              <Button
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={[positiveButtonStyle, { mt: '8px' }]}
                onClick={() =>
                  dispatch(changeActiveOpenApModal(event.access_point))
                }
              >
                Ввести номер
              </Button>
            )}
          {event.access_status_code === '1004' && (
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              sx={[secondaryButtonStyle, { mt: '8px' }]}
            >
              Убрать из Чёрного списка
            </Button>
          )}
          {event.debt && (
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              sx={[secondaryButtonStyle, { mt: '8px' }]}
            >
              Обнулить долг
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
});
