import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
  Menu,
  MenuItem
} from '@mui/material';
import React, { forwardRef, useState } from 'react';
import { CarNumberCard } from '../CarNumberCard/CarNumberCard';
import { useDispatch, useSelector } from 'react-redux';
import eventButtonIcon from '../../assets/svg/log_event_button_icon.svg';
import eventCarIcon from '../../assets/svg/log_event_car_icon.svg';
import eventBarrierIcon from '../../assets/svg/log_event_barrier_icon.svg';
import eventPlateIcon from '../../assets/svg/log_event_plate_icon.svg';
import eventInIcon from '../../assets/svg/log_event_in_icon.svg';
import eventOutIcon from '../../assets/svg/log_event_out_icon.svg';
import eventInnerIcon from '../../assets/svg/log_event_inner_icon.svg';
import eventUserIcon from '../../assets/svg/log_event_user_icon.svg';
import eventCardIcon from '../../assets/svg/log_event_card_icon.svg';
import eventMenuOpenIcon from '../../assets/svg/event_menu_open_icon.svg';
import eventMenuCopyIcon from '../../assets/svg/event_menu_copy_icon.svg';
import { colors } from '../../theme/colors';
import { format, parseISO } from 'date-fns';
import { positiveButtonStyle, secondaryButtonStyle } from '../../theme/styles';
import TypeAuto from '../TypeAuto';
import {
  paidSessionFetch,
  resetDebtFetch
} from '../../store/sessions/sessionsSlice';
import { deleteBlackListFetch } from '../../store/blackList/blackListSlice';
import { changeDataModal } from '../../store/events/eventsSlice';
import { changeActiveOpenApModal } from '../../store/cameras/camerasSlice';
import { resetDebtRequest } from '../../api/sessions';
import { useNavigate } from 'react-router-dom';
import { typeText } from '../TypeAuto/types';
import { useSnackbar } from 'notistack';

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
  { event, onClickImage, onHoverImageButton, selected, accessOptions },
  ref
) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [debtPaid, setDebtPaid] = useState(false);
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  let RURuble = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  });

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLinkClick = () => {
    setSelectedMenuItem('copy');
    navigator.clipboard
      .writeText(window.location.href + '/' + event.id)
      .then(() => {
        enqueueSnackbar('Ссылка скопирована');
      });
    setAnchorEl(null);
  };

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
    setSelectedMenuItem('event');
    window.open(`${window.location.href}/${event.id}`, '_blank', 'noreferrer');
    setAnchorEl(null);
  };

  const handleResetDebtClick = () => {
    if (event.vehicle_plate && event.vehicle_plate.full_plate) {
      resetDebtRequest(event.vehicle_plate.full_plate).then((res) => {
        if (res) {
          setDebtPaid(true);
          enqueueSnackbar('Долг обнулён');
        }
      });
    }
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
                // onMouseLeave={
                //   onHoverImageButton ? () => onHoverImageButton() : () => {}
                // }
                // onMouseOver={
                //   onHoverImageButton
                //     ? () =>
                //         onHoverImageButton(
                //           process.env.REACT_APP_API_URL +
                //             '/' +
                //             event.car_img_path
                //         )
                //     : () => {}
                // }
              >
                {!event.is_recognition &&
                event.event_code !== 1003 &&
                event.event_code !== 1013 ? (
                  <img
                    style={{
                      width: 24
                    }}
                    src={eventBarrierIcon}
                    alt="шлагбаум"
                  />
                ) : (
                  <img
                    style={{
                      width: 20
                    }}
                    src={eventCarIcon}
                    alt="автомобиль"
                  />
                )}
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
            onClick={handleMenuClick}
          >
            <Typography sx={{ fontWeight: 500 }}>...</Typography>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="event-menu"
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 10,
              sx: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '168px',
                border: `1px solid ${colors.outline.default}`,
                borderRadius: '8px',
                '& .MuiAvatar-root': {},
                '&::before': {}
              }
            }}
            MenuListProps={{ sx: { p: 0 } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
              id="event"
              selected={selectedMenuItem === 'event'}
              onClick={handleEventClick}
              sx={{ p: '8px', gap: '8px' }}
            >
              <img
                style={{
                  width: 24,
                  height: 24
                }}
                src={eventMenuOpenIcon}
                alt={'Открыть'}
              />
              <Typography>Открыть</Typography>
            </MenuItem>
            <MenuItem
              id="copy"
              selected={selectedMenuItem === 'copy'}
              onClick={handleCopyLinkClick}
              sx={{ p: '8px', gap: '8px' }}
            >
              <img
                style={{
                  width: 24,
                  height: 24
                }}
                src={eventMenuCopyIcon}
                alt={'Скопировать ссылку'}
              />
              <Typography>Коп. ссылку</Typography>
            </MenuItem>
          </Menu>
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
        {((event.car_brand && event.car_brand !== '') ||
          typeText[event.access_status_code]) && (
          <>
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

              <TypeAuto type={event.access_status_code} />
            </Stack>
          </>
        )}
        {event.access_point_description && (
          <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
            {event.direction && (
              <img
                style={{
                  width: '18px'
                }}
                src={
                  event.direction === 'in'
                    ? eventInIcon
                    : event.direction === 'out'
                    ? eventOutIcon
                    : eventInnerIcon
                }
                alt={event.access_point_description}
              />
            )}
            <Typography>{event.access_point_description}</Typography>
          </Stack>
        )}
        {event.initiator && (
          <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
            <img
              style={{
                width: '18px'
              }}
              src={eventUserIcon}
              alt={event.initiator}
            />
            <Typography>{event.initiator}</Typography>
          </Stack>
        )}
        {event.debt ? (
          <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
            <img
              style={{
                width: '18px'
              }}
              src={eventCardIcon}
              alt={`Долг ${event.debt} руб`}
            />
            <Typography>{RURuble.format(event.debt)}</Typography>
            <Typography sx={{ color: colors.element.secondary }}>
              {event.event_code === 1026 ? 'долга обнулено' : 'долг'}
            </Typography>
          </Stack>
        ) : null}
        {(!event.is_recognition &&
          (event.event_code === 1003 || event.event_code === 1033) &&
          !accessOptions.disableOpenAP) ||
        event.access_status_code === '1004' ||
        (event.debt &&
          event.event_code !== 1026 &&
          event.event_code !== 1027 &&
          !accessOptions.disableResetDuty) ? (
          <Stack
            direction={'row'}
            gap={'8px'}
            alignItems={'center'}
            justifyContent={'flex-start'}
          >
            {!event.is_recognition &&
              (event.event_code === 1003 || event.event_code === 1033) &&
              !accessOptions.disableOpenAP && (
                <Button
                  disableRipple
                  variant="contained"
                  fullWidth={false}
                  sx={[positiveButtonStyle, { mt: '4px' }]}
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
                sx={[secondaryButtonStyle, { mt: '4px' }]}
              >
                Убрать из Чёрного списка
              </Button>
            )}
            {event.debt &&
              event.event_code !== 1026 &&
              event.event_code !== 1027 &&
              !accessOptions.disableResetDuty && (
                <Button
                  disableRipple
                  disabled={debtPaid}
                  variant="contained"
                  fullWidth={false}
                  sx={[secondaryButtonStyle, { mt: '4px' }]}
                  onClick={handleResetDebtClick}
                >
                  Обнулить долг
                </Button>
              )}
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
});
