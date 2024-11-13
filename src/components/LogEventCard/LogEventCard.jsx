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
import { useTheme } from '@mui/material/styles';
import React, { forwardRef, useMemo, useState } from 'react';
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
import {useTranslation} from "react-i18next";

export default forwardRef(function LogEventCard(
  { event, onClickImage, onHoverImageButton, selected, accessOptions },
  ref
) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [debtPaid, setDebtPaid] = useState(false);
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const selectedStyle = useMemo(() => {
    return {
      animation: 'flipBackground 400ms ease-out 200ms',
      animationIterationCount: 2,
      '@keyframes flipBackground': {
        '0%': { backgroundColor: theme.colors.surface.active },
        '50%': { backgroundColor: theme.colors.surface.active },
        '100%': { backgroundColor: theme.colors.surface.high }
      }
    };
  }, [theme]);

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
    const url = window.location.href.split('?')[0];
    navigator.clipboard
      .writeText(url + '/' + event.id)
      .then(() => {
        enqueueSnackbar(t('components.logEventCard.irlIsCopy'));
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
    const url = window.location.href.split('?')[0]
    window.open(`${url}/${event.id}`, '_blank', 'noreferrer');
    setAnchorEl(null);
  };

  const handleResetDebtClick = () => {
    if (event.vehicle_plate && event.vehicle_plate.full_plate) {
      resetDebtRequest(event.vehicle_plate.full_plate).then((res) => {
        if (res) {
          setDebtPaid(true);
          enqueueSnackbar(t('components.logEventCard.dolgFree'));
        }
      });
    }
  };

  return (
    <Box
      id={event.id.toString() + event.event_code.toString()}
      ref={ref}
      component={'div'}
      sx={[
        {
          p: '1rem',
          width: '100%',
          borderBottom: '1px solid ' + theme.colors.outline.separator
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
                  border: `1px solid ${theme.colors.outline.separator}`,
                  backgroundColor: theme.colors.button.secondary.default
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
                event.event_code !== 1013 &&
                event.event_code !== 1042 ? (
                  <img
                    style={{
                      width: 24
                    }}
                    src={eventBarrierIcon}
                    alt={t('components.logEventCard.laurent')}
                  />
                ) : (
                  <img
                    style={{
                      width: 20
                    }}
                    src={eventCarIcon}
                    alt={t('components.logEventCard.car')}
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
                border: `1px solid ${theme.colors.outline.default}`,
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
                alt={t('components.logEventCard.open')}
              />
              <Typography>{t('components.logEventCard.open')}</Typography>
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
                alt={t('components.logEventCard.copyUrl')}
              />
              <Typography>{t('components.logEventCard.cUrl')}</Typography>
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
              border: `1px solid ${theme.colors.outline.separator}`,
              backgroundColor: theme.colors.button.secondary.default
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
              alt={t('components.logEventCard.number')}
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
              color: theme.colors.element.secondary,
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
              alt={`${t('components.logEventCard.dolg')} ${event.debt} ${t('components.logEventCard.rub')}`}
            />
            <Typography>{RURuble.format(event.debt)}</Typography>
            <Typography sx={{ color: theme.colors.element.secondary }}>
              {event.event_code === 1026 ? t('components.logEventCard.zeroDolg') : t('components.logEventCard.dolg')}
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
                  sx={[positiveButtonStyle({ ...theme }), { mt: '4px' }]}
                  onClick={() =>
                    dispatch(changeActiveOpenApModal(event.access_point))
                  }
                >
                  {t('components.logEventCard.enterNumber')}
                </Button>
              )}
            {event.access_status_code === '1004' && (
              <Button
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={[secondaryButtonStyle, { mt: '4px' }]}
              >
                {t('components.logEventCard.removeFromBlackList')}
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
                  {t('components.logEventCard.freeDolg')}
                </Button>
              )}
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
});
