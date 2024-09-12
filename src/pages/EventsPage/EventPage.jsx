import { useEffect, useLayoutEffect, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getEvent } from '../../api/events';
import { resetDebtRequest } from '../../api/sessions';
import { CarNumberCard } from '../../components/CarNumberCard/CarNumberCard';
import FooterSpacer from '../../components/Header/FooterSpacer';
import Lightbox from 'react-18-image-lightbox';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
import { formatDate } from 'utils';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  IconButton,
  Tooltip,
  Typography,
  Button,
  Stack,
  AppBar
} from '@mui/material';
import {
  listStyle,
  secondaryButtonStyle,
  positiveButtonStyle,
  captionTextStyle
} from '../../theme/styles';
import linkIcon from '../../assets/svg/link_icon.svg';
import eventCarIcon from '../../assets/svg/log_event_car_icon.svg';
import eventInIcon from '../../assets/svg/log_event_in_icon.svg';
import eventOutIcon from '../../assets/svg/log_event_out_icon.svg';
import eventInnerIcon from '../../assets/svg/log_event_inner_icon.svg';
import eventUserIcon from '../../assets/svg/log_event_user_icon.svg';
import eventCopyIcon from '../../assets/svg/log_event_copy_icon.svg';
import TypeAuto from '../../components/TypeAuto';
import { changeActiveOpenApModal } from '../../store/cameras/camerasSlice';
import CarNumberDialog from '../../components/CarNumberDialog/CarNumberDialog';
import EventManager from '../../components/EventManager/EventManager';
import '@fontsource-variable/roboto-mono';
import { useSnackbar } from 'notistack';
import {useTranslation} from "react-i18next";

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

const valueTextStyle = {
  fontWeight: 500
};

const detailsTextStyle = {
  fontFamily: ['Roboto Mono Variable', 'monospace'].join(','),
  lineHeight: '1.5rem'
};

const initialAccessOptions = {
  disableOpenAP: false,
  disableResetDuty: false
};
//
// const TreeElement = ({ propertyKey, value, isArray }) => {
//   if (!value) {
//     return null;
//   }
//
//   if (Array.isArray(value)) {
//     return (
//       <>
//         {value.map((val, index) => (
//           <>
//             <Typography sx={detailsTextStyle}>
//               {propertyKey+index}:
//             </Typography>
//             <TreeElement
//               key={propertyKey + '' + index}
//               propertyKey={propertyKey}
//               value={val}
//               isArray
//             />
//           </>
//         ))}
//       </>
//     );
//   }
//
//   if (typeof value === 'object') {
//     return <Tree obj={value} />;
//   }
//
//   return (
//     <Typography sx={detailsTextStyle}>
//                {propertyKey}: {value}
//     </Typography>
//   );
// };
//
// const Tree = ({ obj }) => {
//   return (
//     <>
//       {Object.entries(obj).map(([key, value]) => (
//         <>
//           <TreeElement key={key} propertyKey={key} value={value}></TreeElement>
//         </>
//       ))}
//     </>
//   );
// };

export const EventPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const operator = useSelector((state) => state.parkingInfo.operator);
  const userType = useSelector((state) => state.parkingInfo.userType);
  const [errorEvent, setErrorEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState();
  const [copied, setCopied] = useState(false);
  const [debtPaid, setDebtPaid] = useState(false);
  const [detailsText, setDetailsText] = useState('');
  const [detailsCopied, setDetailsCopied] = useState(false);
  const [eventListScrolled, setEventListScrolled] = useState(false);
  const isOpenApModal = useSelector((state) => state.cameras.isOpenApModal);
  const dispatch = useDispatch();
  const eventListRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const [accessOptions, setAccessOptions] = useState(initialAccessOptions);
  const [eventMessages, setEventMessages] = useState('');
  const [eventMessagesCopied, setEventMessagesCopied] = useState(false);

  const labelTextStyle = useMemo(() => {
    return {
      width: '112px',
      color: theme.colors.element.secondary
    };
  }, [theme]);

  const errorContent = <div>Нет события с ID - {id}</div>;

  useLayoutEffect(() => {
    getEvent(id)
      .then((res) => {
        setLoading(false);
        setEvent(res.data);
      })
      .catch((error) => {
        setLoading(false);
        setErrorEvent(true);
      });
    document.title = `${t('pages.eventPage.event')} №${id}` || t('pages.eventPage.loading');
    return () => {
      document.title = 'Parking';
    };
  }, [id]);

  useEffect(() => {
    if (userType === 'operator') {
      let options = initialAccessOptions;
      if (
        operator &&
        'access_to_open_access_point' in operator &&
        operator.access_to_open_access_point === true
      ) {
        options = { ...options, disableOpenAP: false };
      } else {
        options = { ...options, disableOpenAP: true };
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

  useEffect(() => {
    if (event?.scores) {
      setDetailsText(JSON.stringify(event.scores));
    }

    if (event?.event_message) {
      setEventMessages(JSON.stringify(event.event_message))
    }
  }, [event]);

  const handleCopyLinkClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  const handleCopyDetailsClick = () => {
    navigator.clipboard.writeText(detailsText);
    setDetailsCopied(true);
    setEventMessagesCopied(false);
  };

  const handleCopyEventMessageClick = () => {
    navigator.clipboard.writeText(eventMessages);
    setEventMessagesCopied(true);
    setDetailsCopied(false);
  };

  const handleEventListScroll = () => {
    if (eventListRef.current) {
      const { scrollTop } = eventListRef.current;
      if (scrollTop > 0) {
        setEventListScrolled(true);
      } else if (eventListScrolled) {
        setEventListScrolled(false);
      }
    }
  };

  const [imageModal, setImageModal] = useState({
    isOpen: false,
    src: ''
  });

  const changeActiveImageModal = (src) =>
    setImageModal({
      src: src,
      isOpen: !imageModal.isOpen
    });

  const handleResetDebtClick = () => {
    if (event.vehicle_plate && event.vehicle_plate.full_plate) {
      resetDebtRequest(event.vehicle_plate.full_plate).then((res) => {
        if (res) {
          setDebtPaid(true);
          enqueueSnackbar(t('pages.eventPage.debtReset'));
        }
      });
    }
  };

  return (
    <>
      <AppBar
        sx={{
          width: isMobile ? '100%' : 'calc(100% - 72px)',
          position: 'absolute',
          top: 0,
          left: isMobile ? 0 : '72px',
          backgroundColor: theme.colors.surface.low,
          boxShadow: !eventListScrolled && 'none'
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
            {/* <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              onClick={handleBackClick}
              sx={[
                secondaryButtonStyle,
                isMobile && {
                  minWidth: '48px',
                  '& .MuiButton-startIcon': {
                    margin: 0
                  }
                }
              ]}
              startIcon={
                <img
                  src={backIcon}
                  alt="Назад"
                  style={{ width: '24px', height: '24px' }}
                />
              }
            >
              {isMobile ? '' : 'Назад'}
            </Button> */}
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? 0 : '0.5rem'}
            >
              <Typography sx={titleTextStyle}>{t('pages.eventPage.event')} </Typography>
              <Typography
                sx={isMobile ? captionTextStyle({ ...theme }) : titleTextStyle}
              >
                №{id}
              </Typography>
            </Stack>
          </Stack>
          <Tooltip title={copied ? t('pages.eventPage.urlIsCopy') : t('pages.eventPage.copyUrl')}>
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
                  alt={t('pages.eventPage.copyUrl')}
                  style={{
                    width: '24px',
                    height: '24px'
                  }}
                />
              }
            >
              {isMobile ? '' : t('pages.eventPage.copyUrl')}
            </Button>
          </Tooltip>
        </Stack>
      </AppBar>
      <Stack
        ref={eventListRef}
        sx={[
          listStyle({ ...theme }),
          {
            width: '100%',
            p: '16px',
            pt: isMobile ? '66px' : '64px',
            backgroundColor: theme.colors.surface.low
          }
        ]}
        onScroll={handleEventListScroll}
      >
        <EventManager />
        {loading && <SpinerLogo />}
        {errorEvent && errorContent}
        {event && (
          <>
            <Stack gap={'8px'} sx={{ pt: '16px' }} alignItems={'flex-start'}>
              {event.car_img_path && (
                <IconButton
                  disableRipple
                  onClick={() =>
                    changeActiveImageModal(
                      process.env.REACT_APP_API_URL + '/' + event.car_img_path
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
                      process.env.REACT_APP_API_URL + '/' + event.car_img_path
                    }
                    alt="Фото автомобиля"
                  />{' '}
                </IconButton>
              )}
              {event.plate_img_path && (
                <IconButton
                  disableRipple
                  onClick={() =>
                    changeActiveImageModal(
                      process.env.REACT_APP_API_URL + '/' + event.plate_img_path
                    )
                  }
                >
                  <img
                    style={{
                      maxWidth: '560px',
                      borderRadius: '8px'
                    }}
                    src={
                      process.env.REACT_APP_API_URL + '/' + event.plate_img_path
                    }
                    alt="Фото номера"
                  />
                </IconButton>
              )}
            </Stack>
            <Stack gap={'16px'} sx={{ pt: '16px' }}>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Typography sx={labelTextStyle}>{t('pages.eventPage.gosNumber')}</Typography>
                {event.vehicle_plate.full_plate !== '' && (
                  <Stack direction={'row'}>
                    <CarNumberCard carNumber={event.vehicle_plate} isTable />
                  </Stack>
                )}
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Typography sx={labelTextStyle}>{t('pages.eventPage.description')}</Typography>
                <Typography sx={valueTextStyle}>{event.description}</Typography>
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Typography sx={labelTextStyle}>{t('pages.eventPage.dateAndTime')}</Typography>
                <Typography sx={valueTextStyle}>
                  {formatDate(event.create_datetime)}
                </Typography>
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Stack
                  direction={'row'}
                  justifyContent={isMobile ? 'flex-start' : 'space-between'}
                  gap={'8px'}
                  sx={labelTextStyle}
                >
                  <Typography sx={{ color: theme.colors.element.secondary }}>
                    {t('pages.eventPage.car')}
                  </Typography>
                  <img
                    style={{
                      width: '14.6px'
                    }}
                    src={eventCarIcon}
                    alt="img"
                  />
                </Stack>
                <Typography sx={valueTextStyle}>{event.car_brand}</Typography>
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Typography sx={labelTextStyle}>{t('pages.eventPage.carList')}</Typography>
                <Stack direction={'row'}>
                  <TypeAuto type={event.access_status_code} />
                </Stack>
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Typography sx={labelTextStyle}>{t('pages.eventPage.direction')}</Typography>
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
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Stack
                  direction={'row'}
                  justifyContent={isMobile ? 'flex-start' : 'space-between'}
                  gap={'8px'}
                  sx={labelTextStyle}
                >
                  <Typography sx={{ color: theme.colors.element.secondary }}>
                    {t('pages.eventPage.author')}
                  </Typography>
                  <img
                    style={{
                      width: '14.6px'
                    }}
                    src={eventUserIcon}
                    alt="img"
                  />
                </Stack>
                <Typography sx={valueTextStyle}>
                  {event.initiator || '_'}
                </Typography>
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Typography sx={labelTextStyle}>{t('pages.eventPage.action')}</Typography>
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
                        sx={[positiveButtonStyle({ ...theme }), { mt: '8px' }]}
                        onClick={() =>
                          dispatch(changeActiveOpenApModal(event.access_point))
                        }
                      >
                        {t('pages.eventPage.enterNumber')}
                      </Button>
                    )}
                  {event.access_status_code === '1004' && (
                    <Button
                      disableRipple
                      variant="contained"
                      fullWidth={false}
                      sx={[secondaryButtonStyle({ ...theme }), { mt: '8px' }]}
                    >
                      {t('pages.eventPage.removeFromBlackList')}
                    </Button>
                  )}
                  {event.debt && !accessOptions.disableResetDuty && (
                    <Button
                      disableRipple
                      disabled={debtPaid}
                      variant="contained"
                      fullWidth={false}
                      sx={[secondaryButtonStyle({ ...theme }), { mt: '8px' }]}
                      onClick={handleResetDebtClick}
                    >
                      {t('pages.eventPage.resetDebt')}
                    </Button>
                  )}
                </Stack>
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Typography sx={labelTextStyle}>{t('pages.eventPage.details')}</Typography>
                {event.scores && (
                  <Stack
                    direction={'row'}
                    gap={'10px'}
                    justifyContent={'space-between'}
                    sx={{
                      width: '100%',
                      maxWidth: '720px',
                      backgroundColor: theme.colors.surface.high,
                      borderRadius: '8px',
                      border: `1px solid ${theme.colors.outline.surface}`,
                      p: '16px'
                    }}
                  >
                    <Stack>
                      {Object.entries(event.scores).map((item) => {
                        return (
                          <Stack key={item[1]}>
                            {Array.isArray(item[1]) ? (
                              <>
                                <Typography sx={detailsTextStyle}>
                                  {item[0]}:
                                </Typography>
                                {item[1].map((li) => (
                                  <Typography key={li}>{li}</Typography>
                                ))}
                              </>
                            ) : (
                              <Typography sx={detailsTextStyle}>
                                {item[0]}: {item[1]}
                              </Typography>
                            )}
                          </Stack>
                        );
                      })}
                    </Stack>
                    <Tooltip
                      title={
                        detailsCopied
                          ? t('pages.eventPage.detailsIsCopy')
                          : t('pages.eventPage.copyDetail')
                      }
                    >
                      <Button
                        disableRipple
                        variant="contained"
                        fullWidth={false}
                        onClick={handleCopyDetailsClick}
                        sx={[
                          secondaryButtonStyle({ ...theme }),
                          {
                            minWidth: '48px',
                            '& .MuiButton-startIcon': {
                              margin: 0
                            }
                          }
                        ]}
                        startIcon={
                          <img
                            src={eventCopyIcon}
                            alt={t('pages.eventPage.copy')}
                            style={{ width: '24px', height: '24px' }}
                          />
                        }
                      ></Button>
                    </Tooltip>
                  </Stack>
                )}
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Typography sx={labelTextStyle}>{t('pages.eventPage.eventBody')}</Typography>
                {event.event_message && (
                  <Stack
                    direction={'row'}
                    gap={'10px'}
                    justifyContent={'space-between'}
                    sx={{
                      width: '100%',
                      maxWidth: '720px',
                      backgroundColor: theme.colors.surface.high,
                      borderRadius: '8px',
                      border: `1px solid ${theme.colors.outline.surface}`,
                      p: '16px'
                    }}
                  >
                    <Stack sx={{maxHeight: 500, overflow: 'auto'}}>
                      {JSON.stringify(event.event_message, null, 2)}
                    </Stack>
                    <Tooltip
                      title={
                        eventMessagesCopied
                          ? t('pages.eventPage.eventIsCopy')
                          : t('pages.eventPage.eventDetail')
                      }
                    >
                      <Button
                        disableRipple
                        variant="contained"
                        fullWidth={false}
                        onClick={handleCopyEventMessageClick}
                        sx={[
                          secondaryButtonStyle({ ...theme }),
                          {
                            minWidth: '48px',
                            '& .MuiButton-startIcon': {
                              margin: 0
                            }
                          }
                        ]}
                        startIcon={
                          <img
                            src={eventCopyIcon}
                            alt={t('pages.eventPage.copy')}
                            style={{ width: '24px', height: '24px' }}
                          />
                        }
                      ></Button>
                    </Tooltip>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </>
        )}
        <CarNumberDialog
          show={isOpenApModal}
          handleClose={() => dispatch(changeActiveOpenApModal())}
        />
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
        <FooterSpacer />
      </Stack>
    </>
  );
};
