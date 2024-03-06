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
  changeCurrentPage
} from 'store/events/eventsSlice';
import { CarNumberCard } from '../../components/CarNumberCard/CarNumberCard';
import { EventsDashboard } from '../../components/EventsDashboard/EventsDashboard';
import TypeAuto from '../../components/TypeAuto';
import React from 'react';
import { Box, Drawer, Grid, IconButton, Stack } from '@mui/material';
import LogEventCard from '../../components/LogEventCard/LogEventCard';
import { colors } from '../../theme/colors';
import { listStyle, secondaryButtonStyle } from '../../theme/styles';
import CarNumberFilter from '../../components/CarNumberFilter/CarNumberFilter';
import OpenApByVehiclePlateModal from '../../components/Modals/OpenApByVehiclePlateModal';
import { changeActiveOpenApModal } from '../../store/cameras/camerasSlice';
import CarNumberDialog from '../../components/CarNumberDialog/CarNumberDialog';

const EventsPage = ({ onlyLog }) => {
  const dispatch = useDispatch();
  const [isError, setIsError] = useState(false);
  const [isActiveModal, setIsActiveModal] = useState(false);
  const [isActiveModalMobile, setIsActiveModalMobile] = useState(false);
  const events = useSelector((state) => state.events.events);
  const pages = useSelector((state) => state.events.pages);
  const currentPage = useSelector((state) => state.events.currentPage);
  const isLoading = useSelector((state) => state.events.isLoadingFetch);
  const isOpenApModal = useSelector((state) => state.cameras.isOpenApModal);

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

  const spinnerContent = (
    <div className={css.spinner}>
      <Spinner animation="border" />
    </div>
  );

  const errorContent = (
    <div className={css.error}>Что-то пошло не так! Попробуйте позже</div>
  );

  const rowsTable =
    events.length !== 0
      ? events.map((item, index) => (
          <tr
            className="selected_row"
            tabIndex={1}
            key={index}
            onClick={() => {
              changeModal(item);
            }}
          >
            <td>
              {item.vehicle_plate.number === '' ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '33px'
                  }}
                ></div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '40px'
                  }}
                >
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>№ {item.id}</Tooltip>}
                  >
                    <CarNumberCard carNumber={item.vehicle_plate} isTable />
                  </OverlayTrigger>

                  <span>
                    {item.direction === 'in' && (
                      <ArrowRightSquareFill color="#1cd80f" size={30} />
                    )}
                    {item.direction === null && null}
                    {item.direction === 'out' && (
                      <ArrowLeftSquareFill color="#de0103" size={30} />
                    )}
                  </span>

                  <TypeAuto type={item?.access_status_code} />
                </div>
              )}
            </td>

            <td>{item?.car_brand}</td>

            <td>{formatDate(item.create_datetime)}</td>
            <td>{item.description}</td>
            <td>{item.access_point_description}</td>
          </tr>
        ))
      : null;

  const tableContent = (
    <div>
      <div className={css.wrap}>
        <div className={css.flex}>
          <div className={cn(css.wrap_table, isActiveModal && css.active)}>
            <Table
              titles={titles}
              rows={rowsTable}
              hover
              className={css.table}
            />
          </div>
          <EventCard
            className={cn(css.card, isActiveModal && css.hidden)}
            onClickImage={changeActiveImageModal}
          />
        </div>
      </div>
      <PaginationCustom
        pages={pages}
        changePage={changePage}
        currentPage={currentPage}
      />
    </div>
  );

  const hasData = !(isLoading || isError);
  const errorMessage = isError ? errorContent : null;
  const spinner = isLoading ? spinnerContent : null;
  const content = hasData ? tableContent : null;

  return (
    // <Grid container sx={{ maxHeight: '100dvh' }}>
    <>
      {onlyLog ? (
        <>
          <FilterForm />
          {errorMessage}
          {spinner}
          {content}
          <CardEventModal
            show={isActiveModalMobile}
            handleClose={changeMobileModal}
          />
          {imageModal.isOpen && (
            <Lightbox
              onCloseRequest={changeActiveImageModal}
              mainSrc={imageModal.src}
              imagePadding={100}
            />
          )}
        </>
      ) : (
        <>
          <Cameras />
          <Drawer
            sx={{
              width: '361px',
              maxHeight: '100dvh',
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: '361px',
                boxSizing: 'border-box',
                zIndex: 1
              }
            }}
            variant="permanent"
            anchor="right"
          >
            <Stack
              sx={[
                listStyle,
                { width: '360px', backgroundColor: colors.surface.high }
              ]}
            >
              <CarNumberFilter />

              {events.length > 0
                ? events.map((item, index) => (
                    <LogEventCard
                      key={index}
                      event={item}
                      onClickImage={changeActiveImageModal}
                    />
                  ))
                : null}
              <Box
                sx={{
                  height: '48px'
                }}
              >
                <PaginationCustom
                  pages={pages}
                  changePage={changePage}
                  currentPage={currentPage}
                />
              </Box>
            </Stack>
            <CardEventModal
              show={isActiveModalMobile}
              handleClose={changeMobileModal}
            />
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
        </>
      )}
    </>
  );
};

export default EventsPage;
