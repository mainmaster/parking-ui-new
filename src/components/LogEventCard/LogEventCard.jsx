import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import React from 'react';
import { CarNumberCard } from '../CarNumberCard/CarNumberCard';
import { useSelector } from 'react-redux';
import eventButtonIcon from '../../assets/svg/log_event_button_icon.svg';
import eventCarIcon from '../../assets/svg/log_event_car_icon.svg';
import eventInIcon from '../../assets/svg/log_event_in_icon.svg';
import eventOutIcon from '../../assets/svg/log_event_out_icon.svg';
import { colors } from '../../theme/colors';
import { format, parseISO } from 'date-fns';
import { positiveButtonStyle, secondaryButtonStyle } from '../../theme/styles';
import TypeAuto from '../TypeAuto';

export default function LogEventCard({ event, onClickImage }) {
  const dateString = format(
    parseISO(event.create_datetime),
    'dd.mm.yyyy HH:mm:ss'
  );
  return (
    <Box component={'div'} sx={{ p: '1rem', width: '360px' }}>
      <Stack
        gap={'4px'}
        sx={{ borderBottom: '1px solid ' + colors.outline.separator }}
      >
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Stack direction={'row'}>
            <CarNumberCard carNumber={event.vehicle_plate} isTable />
            {event.car_img_path !== '' && (
              <img
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                src={process.env.REACT_APP_API_URL + '/' + event.car_img_path}
                alt="автомобиль"
                onClick={() =>
                  onClickImage(
                    process.env.REACT_APP_API_URL + '/' + event.car_img_path
                  )
                }
              />
            )}
          </Stack>
          <IconButton
            disableRipple
            sx={{
              width: '48px',
              height: '40px',
              borderRadius: '8px',
              border: `1px solid ${colors.outline.default}`,
              backgroundColor: colors.button.secondary.default
            }}
          >
            <img
              style={{
                height: 17
              }}
              src={eventButtonIcon}
              alt="к событию"
            />
          </IconButton>
        </Stack>
        {event.plate_img_path !== '' && (
          <img
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            src={process.env.REACT_APP_API_URL + '/' + event.plate_img_path}
            alt="номер"
            onClick={() =>
              onClickImage(
                process.env.REACT_APP_API_URL + '/' + event.plate_img_path
              )
            }
          />
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
        </Stack>
        <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
          <img
            style={{
              width: '18px'
            }}
            src={event.direction === 'in' ? eventInIcon : eventOutIcon}
            alt={event.access_point_description}
          />
          <Typography>{event.access_point_description}</Typography>
          <TypeAuto type={event.access_status_code} />
        </Stack>
        <Stack
          direction={'row'}
          gap={'8px'}
          alignItems={'center'}
          justifyContent={'flex-start'}
        >
          {!event.is_recognition && (
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              sx={positiveButtonStyle}
            >
              Ввести номер
            </Button>
          )}
          {event.access_status_code === '1004' && (
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              sx={secondaryButtonStyle}
            >
              Убрать из Чёрного списка
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
