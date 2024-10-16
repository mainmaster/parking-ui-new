import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Lightbox from 'react-18-image-lightbox';
// Components
import Cameras from 'components/Cameras';
import PaginationCustom from 'components/Pagination';
// Constants
import { BREAKPOINT_SM } from 'constants';
// Store
import {
  eventsFetch,
  eventsOnlyFetch,
  eventsChangePageFetch,
  changeDataModal,
  changeCurrentPage,
  setSelectedEventId
} from 'store/events/eventsSlice';
import React from 'react';
import { formatISO } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {AppBar, Typography, Box, Drawer, Stack, Button} from '@mui/material';
import LogEventCard from '../../components/LogEventCard/LogEventCard';
import {listWithScrollStyle, primaryButtonStyle, secondaryButtonStyle} from '../../theme/styles';
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
import { element } from 'prop-types';
import {useTranslation} from "react-i18next";
import download from "../../assets/svg/download_file.svg";
import GenerateEventReport from "../../components/GenerateEventReport/GenerateEventReport";

const mobileMenuItemStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer'
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

const EventsList = memo(({ onlyLog, mobileCameras }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isActiveModal, setIsActiveModal] = useState(false);
  const [isActiveModalMobile, setIsActiveModalMobile] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [eventsListScrolled, setEventsListScrolled] = useState(false);
  const operator = useSelector((state) => state.parkingInfo.operator);
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
  const mobileEventsListRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('event_id');
  const [accessOptions, setAccessOptions] = useState(initialAccessOptions);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    if (userType === 'operator') {
      let options = initialAccessOptions;
      if (
        operator &&
        'access_to_events' in operator &&
        operator.access_to_events === true
      ) {
        options = { ...options, disableEvents: false };
      } else {
        options = { ...options, disableEvents: true };
      }
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
        'access_to_close_access_point' in operator &&
        operator.access_to_close_access_point === true
      ) {
        options = { ...options, disableCloseAP: false };
      } else {
        options = { ...options, disableCloseAP: true };
      }
      if (
        operator &&
        'access_to_working_mode_access_point' in operator &&
        operator.access_to_working_mode_access_point === true
      ) {
        options = { ...options, disableWorkAP: false };
      } else {
        options = { ...options, disableWorkAP: true };
      }
      if (
        operator &&
        'access_to_send_message_led_board' in operator &&
        operator.access_to_send_message_led_board === true
      ) {
        options = { ...options, disableLEDMessage: false };
      } else {
        options = { ...options, disableLEDMessage: true };
      }
      if (
        operator &&
        'access_to_clear_led_board' in operator &&
        operator.access_to_clear_led_board === true
      ) {
        options = { ...options, disableClearLED: false };
      } else {
        options = { ...options, disableClearLED: true };
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
    if (eventId) {
      setTimeout(() => {
        dispatch(setSelectedEventId(parseInt(eventId)));
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


  const scrollTop =  eventsListRef.current ? eventsListRef.current.scrollTop : 0

  const changeActiveImageModal = (src) => {
    if (imageModal.isOpen && eventsListRef.current) {
      eventsListRef.current.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }

    setImageModal({
      src: src,
      isOpen: !imageModal.isOpen
    });

  };

  useEffect(() => {
    if (!accessOptions.disableEvents && userType) {
      if (userType === 'renter') {
        dispatch(eventsOnlyFetch());
      } else {
        dispatch(eventsFetch());
      }
    }

    return () => dispatch(changeCurrentPage(1));
  }, [accessOptions, userType]);

  useEffect(() => {
    if (filtered.length > 0) {
      setEventsList(filtered);
    } else {
      setEventsList(events);
    }
  }, [events, filtered]);

  const changePage = (event, value) => {
    dispatch(eventsChangePageFetch(value));
    if (eventsListRef.current) {
      eventsListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setEventsListScrolled(false);
    }
    if (mobileEventsListRef.current) {
      mobileEventsListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setEventsListScrolled(false);
    }
  };

  const handleEventsListScroll = () => {
    if (eventsListRef.current) {
      const { scrollTop } = eventsListRef.current.scrollTop;
      if (scrollTop > 0) {
        setEventsListScrolled(true);
      } else if (eventsListScrolled) {
        setEventsListScrolled(false);
      }
    }
  };

  const handleMobileEventsListScroll = () => {
    if (mobileEventsListRef.current) {
      const { scrollTop } = mobileEventsListRef.current;
      if (scrollTop > 0) {
        setEventsListScrolled(true);
      } else if (eventsListScrolled) {
        setEventsListScrolled(false);
      }
    }
  };

  const handleCloseReportDialog = () => {
    setIsReportOpen(false);
  }
  return (
    <>
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
              position: 'sticky',
              top: 0,
              right: 0,
              backgroundColor: theme.colors.surface.high,
              boxShadow: !eventsListScrolled && 'none',
              zIndex: 1
            }}
          >
            <CarNumberFilter openForm={openForm} setOpenForm={setOpenForm} />
          </AppBar>
          <Stack
            ref={eventsListRef}
            sx={[
              listWithScrollStyle({ ...theme }),
              {
                width: `calc(${spacers.events} - 1px)`,
                backgroundColor: theme.colors.surface.high
              }
            ]}
            onScroll={handleEventsListScroll}
          >
            <Button
              disableRipple
              variant="contained"
              onClick={() => setIsReportOpen(true)}
              sx={[secondaryButtonStyle({ ...theme }), {margin: '0 16px'}]}
              endIcon={<img src={download} alt={'add'} />}
            >
              Выгрузить
            </Button>
            {eventsList.length > 0 ? (
              <>
                {eventsList.map((item, index) => (
                  <LogEventCard
                    key={item.id + formatISO(Date.now())}
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
                <Typography sx={titleTextStyle}>
                  {t('pages.eventList.noReport')}
                </Typography>
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
          ref={mobileEventsListRef}
          sx={[
            listWithScrollStyle({ ...theme }),
            { width: '100%', backgroundColor: theme.colors.surface.low }
          ]}
          onScroll={handleMobileEventsListScroll}
        >
          {!onlyLog && <HeaderSpacer />}
          <CarNumberFilter openForm={openForm} setOpenForm={setOpenForm} />
          <Button
            disableRipple
            variant="contained"
            onClick={() => setIsReportOpen(true)}
            sx={[secondaryButtonStyle({ ...theme }), {margin: '0 16px'}]}
            endIcon={<img src={download} alt={'add'} />}
          >
            Выгрузить
          </Button>
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
                    alt={t('pages.eventList.noReport')}
                  />
                  <Typography sx={titleTextStyle}>
                    {t('pages.eventList.noReport')}
                  </Typography>
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
      <GenerateEventReport isOpen={isReportOpen} handleClose={handleCloseReportDialog}/>
    </>
  );
});

export default memo(EventsList);