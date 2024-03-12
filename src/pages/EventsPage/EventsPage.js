import { useEffect, useRef, useState } from 'react';
import { OverlayTrigger, Spinner, Tab, Tabs, Tooltip } from 'react-bootstrap';
import css from './MainPage.module.scss';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Lightbox from 'react-18-image-lightbox';
// Utils
import { titles } from './utils';
import { formatDate } from 'utils';
// Components
import Table from 'components/Table';
import EventCard from 'components/EventCard';
import CardEventModal from 'components/Modals/CardEventModal';
import Cameras from 'components/Cameras';
import PaginationCustom from 'components/Pagination';
import FilterForm from 'components/pages/main-page/FilterForm';
import {
  ArrowLeftSquareFill,
  ArrowRightSquareFill
} from 'react-bootstrap-icons';

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
import { CarNumberCard } from '../../components/CarNumberCard/CarNumberCard';
import { EventsDashboard } from '../../components/EventsDashboard/EventsDashboard';
import TypeAuto from '../../components/TypeAuto';
import React from 'react';
import { AppBar, Typography, Box, Drawer, Stack } from '@mui/material';
import LogEventCard from '../../components/LogEventCard/LogEventCard';
import { colors } from '../../theme/colors';
import {
  listStyle,
  listWithScrollStyle,
  secondaryButtonStyle
} from '../../theme/styles';
import CarNumberFilter from '../../components/CarNumberFilter/CarNumberFilter';
import CarNumberFilterSpacer from '../../components/CarNumberFilter/CarNumberFilterSpacer';
import OpenApByVehiclePlateModal from '../../components/Modals/OpenApByVehiclePlateModal';
import { changeActiveOpenApModal } from '../../store/cameras/camerasSlice';
import CarNumberDialog from '../../components/CarNumberDialog/CarNumberDialog';
import HeaderSpacer from '../../components/Header/HeaderSpacer';
import { spacers } from '../../theme/spacers';
import FooterSpacer from '../../components/Header/FooterSpacer';
import { isMobile } from 'react-device-detect';
import { EVENTS_ON_PAGE } from '../../constants';

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

  const addToRefs = (node) => {
    if (node && !eventRef.current.includes(node)) {
      eventRef.current.push(node);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      const item = eventRef.current.find(
        (i) => i.id === selectedEventId.toString()
      );
      if (item) {
        item.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          dispatch(setSelectedEventId(null));
        }, 1200);
      }
    }
  }, [selectedEventId, eventRef]);

  const [imageModal, setImageModal] = useState({
    isOpen: false,
    src: ''
  });

  const changeActiveImageModal = (src) =>
    setImageModal({
      src: src,
      isOpen: !imageModal.isOpen
    });

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
            {events.length > 0
              ? events.map((item, index) => (
                  <LogEventCard
                    key={index}
                    event={item}
                    onClickImage={changeActiveImageModal}
                    selected={item.id === selectedEventId}
                    ref={addToRefs}
                  />
                ))
              : null}
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
            <FooterSpacer />
          </Stack>
          {/* <CardEventModal
            show={isActiveModalMobile}
            handleClose={changeMobileModal}
          /> */}
          <CarNumberDialog
            show={isOpenApModal}
            handleClose={() => dispatch(changeActiveOpenApModal())}
          />
          {imageModal.isOpen && (
            <Lightbox
              onCloseRequest={changeActiveImageModal}
              mainSrc={imageModal.src}
              imagePadding={100}
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

          {events.length > 0
            ? events.map((item, index) => (
                <LogEventCard
                  key={index}
                  event={item}
                  onClickImage={changeActiveImageModal}
                  selected={item.id === selectedEventId}
                  ref={addToRefs}
                />
              ))
            : null}
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
          <FooterSpacer />
          <CarNumberDialog
            show={isOpenApModal}
            handleClose={() => dispatch(changeActiveOpenApModal())}
          />
          {imageModal.isOpen && (
            <Lightbox
              onCloseRequest={changeActiveImageModal}
              mainSrc={imageModal.src}
              imagePadding={100}
            />
          )}
        </Stack>
      )}
    </>
  );
};

export default EventsPage;
