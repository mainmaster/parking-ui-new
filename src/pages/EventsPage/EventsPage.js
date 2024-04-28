import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useLocation } from 'react-router-dom';
import Lightbox from 'react-18-image-lightbox';
// Components
import Cameras from 'components/Cameras';
import PaginationCustom from 'components/Pagination';
import css from './MainPage.module.scss';
import '../../global.css';
// Constants
import { BREAKPOINT_SM } from 'constants';
import soundNotification from './notofication.mp3';
// Store
import {
  eventsFetch,
  putEvent,
  eventsChangePageFetch,
  changeDataModal,
  changeCurrentPage,
  setSelectedEventId
} from 'store/events/eventsSlice';
import { getUserData } from '../../api/auth/login';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AppBar, Typography, Box, Drawer, Stack, Modal } from '@mui/material';
import LogEventCard from '../../components/LogEventCard/LogEventCard';
import { colors } from '../../theme/colors';
import { listStyle, listWithScrollStyle } from '../../theme/styles';
import CarNumberFilter from '../../components/CarNumberFilter/CarNumberFilter';
import CarNumberFilterSpacer from '../../components/CarNumberFilter/CarNumberFilterSpacer';
import { changeActiveOpenApModal } from '../../store/cameras/camerasSlice';
import CarNumberDialog from '../../components/CarNumberDialog/CarNumberDialog';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
import HeaderSpacer from '../../components/Header/HeaderSpacer';
import { spacers } from '../../theme/spacers';
import FooterSpacer from '../../components/Header/FooterSpacer';
import { EVENTS_ON_PAGE } from '../../constants';
import logEventEmptyIcon from '../../assets/svg/log_event_empty_icon.svg';

const mobileHeaderStyle = {
  backgroundColor: colors.surface.high,
  borderBottom: `1px solid ${colors.outline.surface}`,
  boxShadow: 'none',
  justifyContent: 'space-around',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '16px',
  px: '16px',
  width: '100%',
  height: spacers.header
};

const mobileMenuItemStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer'
};

const mobileMenuItemTextStyle = {
  color: colors.element.secondary
};

const titleTextStyle = {
  fontSiza: '1.5rem',
  fontWeight: 500,
  lineSize: '1.75rem'
};

const initialAccessOptions = {
  disableEvents: false,
  disableOpenAP: false,
  disableCloseAP: false,
  disableWorkAP: false,
  disableLEDMessage: false,
  disableClearLED: false,
  disableResetDuty: false
};

const EventsPage = ({ onlyLog }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [isError, setIsError] = useState(false);
  const [isActiveModal, setIsActiveModal] = useState(false);
  const [isActiveModalMobile, setIsActiveModalMobile] = useState(false);
  const [mobileCameras, setMobileCameras] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [eventsListScrolled, setEventsListScrolled] = useState(false);
  const [userData, setUserData] = useState(null);
  const userType = useSelector((state) => state.parkingInfo.userType);
  const events = useSelector((state) => state.events.events);
  const filtered = useSelector((state) => state.events.filtered);
  const [eventsList, setEventsList] = useState([]);
  const pages = useSelector((state) => state.events.pages);
  const currentPage = useSelector((state) => state.events.currentPage);
  const isLoading = useSelector((state) => state.events.isLoadingFetch);
  const selectedEventId = useSelector((state) => state.events.selectedEventId);
  const isOpenApModal = useSelector((state) => state.cameras.isOpenApModal);
  const eventRef = useRef([]);
  eventRef.current = [];
  const eventsListRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentHref, setCurrentHref] = useState(useLocation().pathname);
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('event_id');
  const [accessOptions, setAccessOptions] = useState(initialAccessOptions);

  useLayoutEffect(() => {
    if (currentHref !== '/login' && currentHref !== '/registration') {
      getUserData()
        .then((res) => {
          setUserData(res.data);
        })
        .catch((e) => {
          enqueueSnackbar('Ошибка подключения', { variant: 'error' });
        });
    }
  }, [currentHref]);

  useEffect(() => {
    if (userData && userType === 'operator') {
      let options = initialAccessOptions;
      if (
        userData.operator &&
        'access_to_events' in userData.operator &&
        userData.operator.access_to_events === true
      ) {
        options = { ...options, disableEvents: false };
      } else {
        options = { ...options, disableEvents: true };
      }
      if (
        userData.operator &&
        'access_to_open_access_point' in userData.operator &&
        userData.operator.access_to_open_access_point === true
      ) {
        options = { ...options, disableOpenAP: false };
      } else {
        options = { ...options, disableOpenAP: true };
      }
      if (
        userData.operator &&
        'access_to_close_access_point' in userData.operator &&
        userData.operator.access_to_close_access_point === true
      ) {
        options = { ...options, disableCloseAP: false };
      } else {
        options = { ...options, disableCloseAP: true };
      }
      if (
        userData.operator &&
        'access_to_working_mode_access_point' in userData.operator &&
        userData.operator.access_to_working_mode_access_point === true
      ) {
        options = { ...options, disableWorkAP: false };
      } else {
        options = { ...options, disableWorkAP: true };
      }
      if (
        userData.operator &&
        'access_to_send_message_led_board' in userData.operator &&
        userData.operator.access_to_send_message_led_board === true
      ) {
        options = { ...options, disableLEDMessage: false };
      } else {
        options = { ...options, disableLEDMessage: true };
      }
      if (
        userData.operator &&
        'access_to_clear_led_board' in userData.operator &&
        userData.operator.access_to_clear_led_board === true
      ) {
        options = { ...options, disableClearLED: false };
      } else {
        options = { ...options, disableClearLED: true };
      }
      if (
        userData.operator &&
        'access_to_reset_duty_session' in userData.operator &&
        userData.operator.access_to_reset_duty_session === true
      ) {
        options = { ...options, disableResetDuty: false };
      } else {
        options = { ...options, disableResetDuty: true };
      }
      setAccessOptions(options);
    }
  }, [userType, userData]);

  useEffect(() => {
    if (eventId) {
      setTimeout(() => {
        dispatch(setSelectedEventId(parseInt(eventId)));
        console.log(eventId);
      }, 1000);
    }
  }, [eventId]);

  const addToRefs = (node) => {
    if (node && !eventRef.current.includes(node)) {
      eventRef.current.push(node);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      const id = selectedEventId;
      const item = eventRef.current.find((i) => i.id === id.toString());
      if (item) {
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          dispatch(setSelectedEventId(null));
        }, 2200);
      }
    }
  }, [eventId, selectedEventId, eventRef]);

  const [imageModal, setImageModal] = useState({
    isOpen: false,
    src: ''
  });

  const changeActiveImageModal = (src) =>
    setImageModal({
      src: src,
      isOpen: !imageModal.isOpen
    });

  const handleImageButtonHover = (src) => {
    if (src) {
      setImageModal({
        src: src,
        isOpen: true
      });
    } else {
      setImageModal({
        src: '',
        isOpen: false
      });
    }
  };

  const changeModal = (item) => {
    dispatch(changeDataModal(item));

    if (window.innerWidth < BREAKPOINT_SM) {
      changeMobileModal();
      setIsActiveModal(true);
    }
  };

  useEffect(() => {
    if (!accessOptions.disableEvents) {
      dispatch(eventsFetch());
    }
    return () => dispatch(changeCurrentPage(1));
  }, []);

  useEffect(() => {
    if (filtered.length > 0) {
      setEventsList(filtered);
    } else {
      setEventsList(events);
    }
  }, [events, filtered]);

  const changeMobileModal = () => {
    setIsActiveModalMobile(!isActiveModalMobile);
  };

  const changePage = (event, value) => {
    dispatch(eventsChangePageFetch(value));
    if (eventsListRef.current) {
      eventsListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setEventsListScrolled(false);
    }
  };

  const handleMobileMenuItemClick = () => {
    setMobileCameras(!mobileCameras);
  };

  const handleEventsListScroll = () => {
    if (eventsListRef.current) {
      const { scrollTop } = eventsListRef.current;
      if (scrollTop > 0) {
        setEventsListScrolled(true);
      } else if (eventsListScrolled) {
        setEventsListScrolled(false);
      }
    }
  };

  return (
    // <Grid container sx={{ maxHeight: '100dvh' }}>
    <>
      {!onlyLog && isMobile && (
        <AppBar position="absolute" sx={mobileHeaderStyle}>
          <Box
            sx={[
              mobileMenuItemStyle,
              {
                borderBottom: mobileCameras
                  ? `2px solid ${colors.button.primary.default}`
                  : 'none'
              }
            ]}
            onClick={handleMobileMenuItemClick}
          >
            <Typography
              sx={[
                mobileMenuItemTextStyle,
                {
                  color: mobileCameras
                    ? colors.button.primary.default
                    : colors.element.secondary
                }
              ]}
            >
              Наблюдение
            </Typography>
          </Box>
          <Box
            sx={[
              mobileMenuItemStyle,
              {
                borderBottom: !mobileCameras
                  ? `2px solid ${colors.button.primary.default}`
                  : 'none'
              }
            ]}
            onClick={handleMobileMenuItemClick}
          >
            <Typography
              sx={[
                mobileMenuItemTextStyle,
                {
                  color: !mobileCameras
                    ? colors.button.primary.default
                    : colors.element.secondary
                }
              ]}
            >
              Отчёты
            </Typography>
          </Box>
        </AppBar>
      )}
      {!onlyLog && ((isMobile && mobileCameras) || !isMobile) && (
        <Cameras accessOptions={accessOptions} />
      )}
      {!isMobile && !accessOptions.disableEvents && (
        <Drawer
          sx={{
            width: spacers.events,
            maxHeight: '100dvh',
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: spacers.events,
              boxSizing: 'border-box',
              zIndex: 1
            }
          }}
          variant="permanent"
          anchor="right"
        >
          <AppBar
            sx={{
              width: spacers.events,
              position: 'absolute',
              top: 0,
              right: 0,
              backgroundColor: colors.surface.high,
              boxShadow: !eventsListScrolled && 'none',
              zIndex: 1
            }}
          >
            <CarNumberFilter openForm={openForm} setOpenForm={setOpenForm} />
          </AppBar>
          <Stack
            ref={eventsListRef}
            sx={[
              listWithScrollStyle,
              {
                width: `calc(${spacers.events} - 1px)`,
                backgroundColor: colors.surface.high
              }
            ]}
            onScroll={handleEventsListScroll}
          >
            <CarNumberFilterSpacer openForm={openForm} />
            {eventsList.length > 0 ? (
              <>
                {eventsList.map((item, index) => (
                  <LogEventCard
                    key={item.id}
                    event={item}
                    onClickImage={changeActiveImageModal}
                    // onHoverImageButton={handleImageButtonHover}
                    selected={item.id === selectedEventId}
                    ref={addToRefs}
                    accessOptions={accessOptions}
                  />
                ))}
                <Box
                  sx={{
                    height: '48px'
                  }}
                >
                  <PaginationCustom
                    pages={Math.ceil(pages / EVENTS_ON_PAGE)}
                    changePage={changePage}
                    currentPage={currentPage}
                  />
                </Box>
              </>
            ) : (
              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                height={'100%'}
                gap={'16px'}
              >
                <img
                  style={{ height: '40px' }}
                  src={logEventEmptyIcon}
                  alt="нет отчётов"
                />
                <Typography sx={titleTextStyle}>Нет отчётов</Typography>
              </Stack>
            )}

            <FooterSpacer />
          </Stack>
          {/* <CardEventModal
            show={isActiveModalMobile}
            handleClose={changeMobileModal}
          /> */}
          {imageModal.isOpen && (
            // <Modal
            //   open={imageModal.isOpen}
            //   onClose={changeActiveImageModal}
            //   sx={{
            //     position: 'absolute',
            //     zIndex: 1000,
            //     left: '72px',
            //     right: spacers.events,
            //     display: 'flex',
            //     justifyContent: 'center'
            //   }}
            //   slotProps={{
            //     backdrop: {
            //       sx: {
            //         backgroundColor: colors.blackout,
            //         left: '72px',
            //         right: spacers.events
            //       }
            //     }
            //   }}
            // >
            //   <img
            //     src={imageModal.src}
            //     alt="car"
            //     style={{ width: '100%', padding: '16px', margin: 'auto 0' }}
            //   />
            // </Modal>

            <Lightbox
              onCloseRequest={changeActiveImageModal}
              mainSrc={imageModal.src}
              reactModalStyle={{
                overlay: { zIndex: 1300 }
              }}
            />
          )}
        </Drawer>
      )}
      {isMobile && !accessOptions.disableEvents && (!mobileCameras || onlyLog) && (
        <Stack
          sx={[
            listWithScrollStyle,
            { width: '100%', backgroundColor: colors.surface.low }
          ]}
        >
          {!onlyLog && <HeaderSpacer />}
          <CarNumberFilter openForm={openForm} setOpenForm={setOpenForm} />

          {eventsList.length > 0 ? (
            <>
              {eventsList.map((item, index) => (
                <LogEventCard
                  key={item.id}
                  event={item}
                  onClickImage={changeActiveImageModal}
                  selected={item.id === selectedEventId}
                  ref={addToRefs}
                  accessOptions={accessOptions}
                />
              ))}
              <Box
                sx={{
                  height: '48px'
                }}
              >
                <PaginationCustom
                  pages={Math.ceil(pages / EVENTS_ON_PAGE)}
                  changePage={changePage}
                  currentPage={currentPage}
                />
              </Box>
            </>
          ) : (
            <Stack
              justifyContent={'center'}
              height={'100%'}
              alignItems={'center'}
              gap={'16px'}
            >
              {isLoading ? (
                <SpinerLogo />
              ) : (
                <>
                  <img
                    style={{ height: '40px' }}
                    src={logEventEmptyIcon}
                    alt="нет отчётов"
                  />
                  <Typography sx={titleTextStyle}>Нет отчётов</Typography>
                </>
              )}
            </Stack>
          )}

          <FooterSpacer />

          {imageModal.isOpen && (
            <Lightbox
              onCloseRequest={changeActiveImageModal}
              mainSrc={imageModal.src}
              imagePadding={100}
            />
          )}
        </Stack>
      )}
      <CarNumberDialog
        show={isOpenApModal}
        handleClose={() => dispatch(changeActiveOpenApModal())}
      />
    </>
  );
};

export default EventsPage;
