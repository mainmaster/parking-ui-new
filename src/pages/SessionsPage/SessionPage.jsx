import { useLayoutEffect, useState, useRef, useEffect, useMemo } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { CarNumberCard } from '../../components/CarNumberCard/CarNumberCard';
import TypeAuto from '../../components/TypeAuto';
import Lightbox from 'react-18-image-lightbox';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
import FooterSpacer from '../../components/Header/FooterSpacer';
import { formatDate, getDayMinuteSecondsByNumber } from 'utils';
import {
  paidSessionSelectFetch,
  sessionSelectFetch,
  statusSessionSelectFetch
} from '../../store/sessions/sessionsSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  Tooltip,
  Typography,
  Button,
  Stack,
  AppBar,
  IconButton
} from '@mui/material';
import linkIcon from '../../assets/svg/link_icon.svg';
import {
  listStyle,
  secondaryButtonStyle,
  captionTextStyle
} from '../../theme/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import EventManager from '../../components/EventManager/EventManager';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

const initialAccessOptions = {
  disableResetDuty: false,
  disableCloseSession: false
};

export const SessionPage = () => {
  const { id } = useParams();
  const session = useSelector((state) => state.sessions.selectSession);
  const loading = useSelector((state) => state.sessions.isLoadingSelect);
  const errorLoad = useSelector((state) => state.sessions.isErrorSelect);
  const operator = useSelector((state) => state.parkingInfo.operator);
  const userType = useSelector((state) => state.parkingInfo.userType);
  const [copied, setCopied] = useState(false);
  const [sessionListScrolled, setSessionListScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sessionListRef = useRef(null);
  const [accessOptions, setAccessOptions] = useState(initialAccessOptions);

  const labelTextStyle = useMemo(() => {
    return {
      width: '112px',
      color: theme.colors.element.secondary
    };
  }, [theme]);

  useEffect(() => {
    if (userType === 'operator') {
      let options = initialAccessOptions;
      if (
        operator &&
        'access_to_close_session' in operator &&
        operator.access_to_close_session === true
      ) {
        options = { ...options, disableCloseSession: false };
      } else {
        options = { ...options, disableCloseSession: true };
      }
      if (
        operator &&
        'access_to_reset_duty_session' in operator &&
        operator.access_to_reset_duty_session === true
      ) {
        options = { ...options, disableResetDuty: false };
      } else {
        options = { ...options, disableResetDuty: true };
      }
      setAccessOptions(options);
    }
  }, [userType, operator]);

  const [imageModal, setImageModal] = useState({
    isOpen: false,
    src: ''
  });

  const changeActiveImageModal = (src) =>
    setImageModal({
      src: src,
      isOpen: !imageModal.isOpen
    });

  const dispatch = useDispatch();

  const handleCopyLinkClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  const handleSessionListScroll = () => {
    if (sessionListRef.current) {
      const { scrollTop } = sessionListRef.current;
      if (scrollTop > 0) {
        setSessionListScrolled(true);
      } else if (sessionListScrolled) {
        setSessionListScrolled(false);
      }
    }
  };

  const handlePaidClick = () => {
    dispatch(paidSessionSelectFetch({ id: session.id, is_paid: true }));
  };

  const handleCloseClick = () => {
    dispatch(statusSessionSelectFetch({ id: session.id, status: 'closed' }));
  };

  useLayoutEffect(() => {
    dispatch(sessionSelectFetch(id));
    document.title = `Сессия №${id}` || 'Загрузка';
    return () => {
      document.title = 'Parking';
    };
  }, [dispatch, id]);

  const errorContent = <h1>События с №{id} не найдено</h1>;

  return (
    <>
      <AppBar
        sx={{
          width: isMobile ? '100%' : 'calc(100% - 72px)',
          position: 'absolute',
          top: 0,
          left: isMobile ? 0 : '72px',
          backgroundColor: theme.colors.surface.low,
          boxShadow: !sessionListScrolled && 'none'
        }}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          sx={{
            p: '16px',
            pb: isMobile ? '10px' : '8px'
          }}
        >
          <Stack direction={'row'} alignItems={'center'} gap={'16px'}>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? 0 : '0.5rem'}
            >
              <Typography sx={titleTextStyle}>Сессия </Typography>
              <Typography
                sx={isMobile ? captionTextStyle({ ...theme }) : titleTextStyle}
              >
                №{id}
              </Typography>
            </Stack>
          </Stack>
          <Tooltip title={copied ? 'Ссылка скопирована' : 'Скопировать ссылку'}>
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              onClick={handleCopyLinkClick}
              sx={[
                secondaryButtonStyle({ ...theme }),
                isMobile
                  ? {
                      minWidth: '48px',
                      '& .MuiButton-endIcon': {
                        margin: 0
                      }
                    }
                  : { minWidth: '212px' }
              ]}
              endIcon={
                <img
                  src={linkIcon}
                  alt="Скопировать ссылку"
                  style={{
                    width: '24px',
                    height: '24px'
                  }}
                />
              }
            >
              {isMobile ? '' : 'Скопировать ссылку'}
            </Button>
          </Tooltip>
        </Stack>
      </AppBar>
      <Stack
        gap={'16px'}
        ref={sessionListRef}
        sx={[
          listStyle({ ...theme }),
          {
            width: '100%',
            p: '16px',
            pt: isMobile ? '66px' : '64px',
            pb: 0,
            backgroundColor: theme.colors.surface.low
          }
        ]}
        onScroll={handleSessionListScroll}
      >
        <EventManager />
        {loading && <SpinerLogo />}
        {errorLoad && errorContent}
        {session && session.events.length > 0 && (
          <>
            <Stack>
              <Stack
                direction={'row'}
                flexWrap={'nowrap'}
                gap={'8px'}
                sx={{ p: 0, pb: '8px', width: '100%' }}
              >
                {session.events.map((event) => {
                  if (event.car_img_path && event.car_img_path !== '') {
                    return (
                      <IconButton
                        key={event.car_img_path}
                        disableRipple
                        sx={{
                          maxWidth: '560px',
                          width: '100%',
                          flex: '1 1 320px'
                        }}
                        onClick={() =>
                          changeActiveImageModal(
                            process.env.REACT_APP_API_URL +
                              '/' +
                              event.car_img_path
                          )
                        }
                      >
                        <img
                          key={event.id}
                          style={{
                            maxWidth: '560px',
                            borderRadius: '8px',
                            width: '100%'
                          }}
                          src={
                            process.env.REACT_APP_API_URL +
                            '/' +
                            event.car_img_path
                          }
                          alt={`Событие № ${event.id}`}
                        />
                      </IconButton>
                    );
                  } else {
                    return '';
                  }
                })}
              </Stack>
              {session.events && session.events.length && session.events.some(({plate_img_path}) => !!plate_img_path) && (
                  <IconButton
                    disableRipple
                    sx={{ maxWidth: '560px', width: '100%' }}
                    onClick={() =>
                      changeActiveImageModal(
                        process.env.REACT_APP_API_URL +
                          '/' +
                        session.events.find(({plate_img_path}) => !!plate_img_path).plate_img_path
                      )
                    }
                  >
                    <img
                      style={{
                        maxWidth: '560px',
                        borderRadius: '8px',
                        width: '100%'
                      }}
                      src={
                        process.env.REACT_APP_API_URL +
                        '/' +
                        session.events.find(({plate_img_path}) => !!plate_img_path).plate_img_path
                      }
                      alt="Фото номера"
                    />
                  </IconButton>
                )}
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>Госномер</Typography>
              {session.events[0].vehicle_plate &&
                session.events[0].vehicle_plate.full_plate !== '' && (
                  <Stack direction={'row'}>
                    <CarNumberCard
                      carNumber={session.events[0].vehicle_plate}
                      isTable
                    />
                  </Stack>
                )}
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>Список авто</Typography>
              <Stack direction={'row'}>
                <TypeAuto type={session.events[0].access_status_code} />
              </Stack>
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>Статус</Typography>
              <Stack direction={'row'}>
                <TypeAuto type={session.status} />
              </Stack>
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>Оплата</Typography>
              <Stack direction={'row'}>
                <TypeAuto type={session.is_paid ? 'paid' : 'not_paid'} />
              </Stack>
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>Проведено</Typography>
              <Typography>
                {getDayMinuteSecondsByNumber(session.time_on_parking)}
              </Typography>
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>Создана</Typography>
              <Typography>{formatDate(session.create_datetime)}</Typography>
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>Закрыта</Typography>
              <Typography>
                {session.closed_datetime
                  ? formatDate(session.closed_datetime)
                  : '-'}
              </Typography>
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>Оплата до</Typography>
              <Typography>
                {session.payment_is_valid_until
                  ? formatDate(session.payment_is_valid_until)
                  : '-'}
              </Typography>
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>Долг</Typography>
              <Typography>{`${session.payment_amount} ₽`}</Typography>
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>Действие</Typography>
              <Stack direction={'row'}>
                <Stack direction={'row'} gap={'8px'}>
                  {session.payment_amount > 0 &&
                    !accessOptions.disableResetDuty && (
                      <Button
                        disableRipple
                        variant="contained"
                        fullWidth
                        sx={[
                          secondaryButtonStyle({ ...theme }),
                          { minWidth: '141px' }
                        ]}
                        onClick={handlePaidClick}
                      >
                        Обнулить долг
                      </Button>
                    )}
                  {session.status === 'open' &&
                    !accessOptions.disableCloseSession && (
                      <Button
                        disableRipple
                        variant="contained"
                        fullWidth
                        sx={secondaryButtonStyle({ ...theme })}
                        onClick={handleCloseClick}
                      >
                        Закрыть
                      </Button>
                    )}
                </Stack>
              </Stack>
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>События</Typography>
              <Stack gap={'16px'}>
                {session.events.map((event) => (
                  <NavLink
                    key={event.id}
                    to={`/events/${event.id}`}
                    style={{ lineHeight: '1.125rem' }}
                  >
                    Событие №{event.id}
                  </NavLink>
                ))}
              </Stack>
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>Оплаты</Typography>
              <Stack gap={'16px'}>
                {session.payments.map((payment) => (
                  <NavLink
                    key={payment.id}
                    to={`/payments/${payment.id}`}
                    style={{ lineHeight: '1.125rem' }}
                  >
                    Оплата №{payment.id}
                  </NavLink>
                ))}
              </Stack>
            </Stack>
          </>
        )}
        <FooterSpacer />
        {imageModal.isOpen && (
          <Lightbox
            onCloseRequest={changeActiveImageModal}
            mainSrc={imageModal.src}
            imagePadding={100}
            reactModalStyle={{
              overlay: { zIndex: 1300 }
            }}
          />
        )}
      </Stack>
    </>
  );
};
