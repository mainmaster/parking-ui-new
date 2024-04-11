import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
// Store
import {
  carParkFetch,
  editModalHandler,
  createModalHandler,
  carParkChangePageFetch,
  changeCurrentPage
} from '../../store/carPark/carParkSlice';
// Components
import PaginationCustom from 'components/Pagination';
import CreateCarParkModal from 'components/Modals/CreateCarParkModal';
import EditCarParkModal from 'components/Modals/EditCarParkModal';
// Constants
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  AppBar,
  Box,
  Stack,
  Typography,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import { colors } from '../../theme/colors';
import {
  listStyle,
  listWithScrollStyle,
  closeButtonStyle
} from '../../theme/styles';
import CarParkFilter from '../../components/CarParkFilter/CarParkFilter';
import FooterSpacer from '../../components/Header/FooterSpacer';
import CarParkSpacer from './CarParkSpacer';
import parkEmptyIcon from '../../assets/svg/carpark_empty_icon.svg';
import { CARS_ON_PAGE, ITEM_MIN_WIDTH, ITEM_MAX_WIDTH } from '../../constants';
import LogCarParkCard from '../../components/LogCarParkCard/LogCarParkCard';
import EventManager from '../../components/EventManager/EventManager';
import OpenFormSpacer from './OpenformSpacer';
import AddCarDialog from '../../components/CarParkAddCarDialog/CarParkAddCarDialog';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

const tabStyle = {
  minHeight: '42px',
  textTransform: 'none',
  fontSize: '1rem',
  lineHeight: '1.125rem',
  fontWeight: 500,
  '&.Mui-selected': {
    color: colors.button.primary.default
  }
};

const CarParkPage = () => {
  const [openForm, setOpenForm] = useState(false);
  const dispatch = useDispatch();
  const carParks = useSelector((state) => state.carPark.carParks);
  const pages = useSelector((state) => state.carPark.pages);
  const currentPage = useSelector((state) => state.carPark.currentPage);
  const isLoading = useSelector((state) => state.carPark.isLoadingFetch);
  const isError = useSelector((state) => state.carPark.isErrorFetch);
  const isEditModal = useSelector((state) => state.carPark.isEditModal);
  const isCreateModal = useSelector((state) => state.carPark.isCreateModal);
  const [parkListScrolled, setParkListScrolled] = useState(false);
  const parkListRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const urlStatus = useParams();
  const [params] = useSearchParams();
  const [currentTab, setCurrentTab] = useState(0);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [itemsInRow, setItemsInRow] = useState(0);

  const handleResize = useCallback(() => {
    if (containerRef?.current) {
      const items = Math.floor(
        containerRef.current.offsetWidth / ITEM_MIN_WIDTH
      );
      setItemsInRow(items - 1);
    }
  }, [containerRef]);

  useEffect(() => {
    window.addEventListener('load', handleResize);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('load', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef, handleResize]);

  useEffect(() => {
    dispatch(carParkFetch());
  }, [urlStatus, params]);

  // const changePage = (index) => {
  //   dispatch(sessionsChangePageFetch(index));
  // };

  const changePage = (event, value) => {
    dispatch(carParkChangePageFetch(value));
    if (parkListRef.current) {
      parkListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setParkListScrolled(false);
    }
  };

  const handleParkListScroll = () => {
    if (parkListRef.current) {
      const { scrollTop } = parkListRef.current;
      if (scrollTop > 0) {
        setParkListScrolled(true);
      } else if (parkListScrolled) {
        setParkListScrolled(false);
      }
    }
  };

  const handleAddCarClick = () => {
    dispatch(createModalHandler());
  };

  const handleChangeTab = (event, value) => {
    switch (value) {
      case 0:
        navigate('./active');
        break;
      case 1:
        navigate('./inactive');
        break;
      case 2:
        navigate('./subscribe');
        break;
    }
    setCurrentTab(value);
  };

  return (
    <>
      {!isMobile && (
        <AppBar
          sx={{
            width: 'calc(100% - 72px)',
            position: 'absolute',
            top: 0,
            left: '72px',
            backgroundColor: colors.surface.low,
            boxShadow: !parkListScrolled && 'none',
            zIndex: 10,
            borderBottom: `1px solid ${colors.outline.separator}`
          }}
        >
          <Stack
            direction={'row'}
            gap={'16px'}
            justifyContent={'space-between'}
            sx={{
              height: '64px',
              width: '100%',
              p: '16px',
              pb: '8px'
            }}
          >
            <Typography sx={titleTextStyle}>Автопарк</Typography>
            <Stack
              direction={'row'}
              justifyContent={'flex-end'}
              sx={{ width: '100%' }}
            >
              <Button
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={closeButtonStyle}
                onClick={handleAddCarClick}
              >
                Добавить машину
              </Button>

              <CarParkFilter openForm={openForm} setOpenForm={setOpenForm} />
            </Stack>
          </Stack>
          <Stack direction={'row'}>
            <Tabs
              value={currentTab}
              onChange={handleChangeTab}
              variant="scrollable"
              scrollButtons={false}
              TabIndicatorProps={{
                sx: {
                  backgroundColor: colors.button.primary.default
                }
              }}
              sx={{ minHeight: '42px' }}
            >
              <Tab sx={tabStyle} disableRipple label="Активные" />
              <Tab sx={tabStyle} disableRipple label="Неактивные" />
              <Tab sx={tabStyle} disableRipple label="Абонементы" />
            </Tabs>
          </Stack>
        </AppBar>
      )}
      <Stack
        ref={parkListRef}
        sx={[
          listWithScrollStyle,
          {
            width: '100%',
            backgroundColor: colors.surface.low
          }
        ]}
        onScroll={handleParkListScroll}
      >
        <EventManager />
        <CarParkSpacer />
        {isMobile && (
          <>
            <AppBar
              sx={{
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: colors.surface.low,
                boxShadow: !parkListScrolled && 'none',
                zIndex: 10,
                borderBottom: `1px solid ${colors.outline.separator}`
              }}
            >
              <Stack
                direction={'row'}
                gap={'16px'}
                justifyContent={'space-between'}
                sx={{
                  height: '64px',
                  width: '100%',
                  p: '16px',
                  pb: '8px'
                }}
              >
                <Typography sx={titleTextStyle}>Автопарк</Typography>
                <Button
                  disableRipple
                  variant="contained"
                  fullWidth={false}
                  sx={closeButtonStyle}
                  onClick={handleAddCarClick}
                >
                  Добавить машину
                </Button>
              </Stack>
              <Box
                sx={{
                  height: openForm ? '194px' : '56px',
                  py: '8px'
                }}
              >
                <CarParkFilter openForm={openForm} setOpenForm={setOpenForm} />
              </Box>
              <Stack direction={'row'}>
                <Tabs
                  value={currentTab}
                  onChange={handleChangeTab}
                  variant="scrollable"
                  scrollButtons={false}
                  TabIndicatorProps={{
                    sx: {
                      backgroundColor: colors.button.primary.default
                    }
                  }}
                  sx={{ minHeight: '42px' }}
                >
                  <Tab sx={tabStyle} disableRipple label="Активные" />
                  <Tab sx={tabStyle} disableRipple label="Неактивные" />
                  <Tab sx={tabStyle} disableRipple label="Абонементы" />
                </Tabs>
              </Stack>
            </AppBar>
            {openForm && <OpenFormSpacer />}
          </>
        )}

        {carParks && carParks.car_park && carParks.car_park.length > 0 ? (
          <>
            <Box
              ref={containerRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {carParks.car_park.map((item, index) => (
                <LogCarParkCard key={item.id} car={item} />
              ))}
              {itemsInRow > 0 &&
                [...Array(itemsInRow)].map((value, index) => (
                  <Box
                    id={index + 1}
                    key={index}
                    sx={{
                      flex: `1 1 ${ITEM_MIN_WIDTH}px`,
                      minWidth: `${ITEM_MIN_WIDTH}px`,
                      maxWidth: `${ITEM_MAX_WIDTH}px`
                    }}
                  />
                ))}
            </Box>
            <Box
              sx={{
                height: '48px'
              }}
            >
              {carParks.count > CARS_ON_PAGE && (
                <PaginationCustom
                  pages={Math.ceil(pages / CARS_ON_PAGE)}
                  changePage={changePage}
                  currentPage={currentPage}
                />
              )}
            </Box>
          </>
        ) : (
          <Stack
            justifyContent={'center'}
            alignItems={'center'}
            height={'100%'}
            gap={'16px'}
          >
            {isLoading ? (
              <SpinerLogo />
            ) : (
              <>
                <img
                  style={{ height: '40px' }}
                  src={parkEmptyIcon}
                  alt="Нет активных машин в автопарке"
                />
                <Typography sx={titleTextStyle}>
                  Нет активных машин в автопарке
                </Typography>
              </>
            )}
          </Stack>
        )}

        <FooterSpacer />
      </Stack>
      <AddCarDialog
        show={isCreateModal}
        handleClose={() => dispatch(createModalHandler())}
      />
      <AddCarDialog
        show={isEditModal}
        handleClose={() => dispatch(editModalHandler())}
        edit={true}
      />
    </>
  );
};

export default CarParkPage;
