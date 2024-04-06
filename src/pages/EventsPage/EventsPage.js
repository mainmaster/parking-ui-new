import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
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
import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AppBar, Typography, Box, Drawer, Stack, Modal } from '@mui/material';
import LogEventCard from '../../components/LogEventCard/LogEventCard';
import { colors } from '../../theme/colors';
import { listWithScrollStyle } from '../../theme/styles';
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

const EventsPage = ({ onlyLog }) => {
  const dispatch = useDispatch();
  const [isError, setIsError] = useState(false);
  const [isActiveModal, setIsActiveModal] = useState(false);
  const [isActiveModalMobile, setIsActiveModalMobile] = useState(false);
  const [mobileCameras, setMobileCameras] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [eventsListScrolled, setEventsListScrolled] = useState(false);
  const events = useSelector((state) => state.events.events);
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
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('event_id');

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
    dispatch(eventsFetch());
    if (window.innerWidth < BREAKPOINT_SM) {
      setIsActiveModal(true);
    }
    return () => dispatch(changeCurrentPage(1));
  }, []);

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
      {!onlyLog && ((isMobile && mobileCameras) || !isMobile) && <Cameras />}
      {!isMobile && (
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
            {events.length > 0 ? (
              <>
                {events.map((item, index) => (
                  <LogEventCard
                    key={item.id}
                    event={item}
                    onClickImage={changeActiveImageModal}
                    // onHoverImageButton={handleImageButtonHover}
                    selected={item.id === selectedEventId}
                    ref={addToRefs}
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
      {isMobile && (!mobileCameras || onlyLog) && (
        <Stack
          sx={[
            listWithScrollStyle,
            { width: '100%', backgroundColor: colors.surface.low }
          ]}
        >
          {!onlyLog && <HeaderSpacer />}
          <CarNumberFilter openForm={openForm} setOpenForm={setOpenForm} />

          {events.length > 0 ? (
            <>
              {events.map((item, index) => (
                <LogEventCard
                  key={index}
                  event={item}
                  onClickImage={changeActiveImageModal}
                  selected={item.id === selectedEventId}
                  ref={addToRefs}
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
