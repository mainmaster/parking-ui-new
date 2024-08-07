import { useEffect, useMemo, useRef, useState } from 'react';
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
import { AppBar, Typography, Box, Drawer, Stack } from '@mui/material';
import LogEventCard from '../../components/LogEventCard/LogEventCard';
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
import EventsList from './EventsList';
import {useTranslation} from "react-i18next";

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

const EventsPage = ({ onlyLog }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isActiveModal, setIsActiveModal] = useState(false);
  const [isActiveModalMobile, setIsActiveModalMobile] = useState(false);
  const [mobileCameras, setMobileCameras] = useState(true);
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

  const mobileHeaderStyle = useMemo(() => {

    return {
      backgroundColor: theme.colors.surface.high,
      borderBottom: `1px solid ${theme.colors.outline.surface}`,
      boxShadow: 'none',
      justifyContent: 'space-around',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '16px',
      px: '16px',
      width: '100%',
      height: spacers.header
    };
  }, [theme]);

  const mobileMenuItemTextStyle = useMemo(() => {
    return {
      color: theme.colors.element.secondary
    };
  }, [theme]);

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

  const changeMobileModal = () => {
    setIsActiveModalMobile(!isActiveModalMobile);
  };

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
                  ? `2px solid ${theme.colors.button.primary.default}`
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
                    ? theme.colors.button.primary.default
                    : theme.colors.element.secondary
                }
              ]}
            >
              {t('pages.eventPage.monitoring')}
            </Typography>
          </Box>
          <Box
            sx={[
              mobileMenuItemStyle,
              {
                borderBottom: !mobileCameras
                  ? `2px solid ${theme.colors.button.primary.default}`
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
                    ? theme.colors.button.primary.default
                    : theme.colors.element.secondary
                }
              ]}
            >
              {t('pages.eventPage.reports')}
            </Typography>

          </Box>
        </AppBar>
      )}
      {!onlyLog && ((isMobile && mobileCameras) || !isMobile) && (
        <Cameras accessOptions={accessOptions} />
      )}
            <EventsList onlyLog={onlyLog} mobileCameras={mobileCameras}/>
      {isOpenApModal && (
        <CarNumberDialog
          show={isOpenApModal}
          handleClose={() => dispatch(changeActiveOpenApModal())}
        />
      )}
    </>
  );
};

export default EventsPage;
