import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
// Store
import {
  carParkFetch,
  editModalHandler,
  createModalHandler,
  carParkChangePageFetch,
  changeCurrentPage
} from '../../store/carPark/carParkSlice';
import { useRentersQuery } from '../../api/renters/renters.api';
import { getCarParkReport, uploadCarParkReport } from '../../api/car-park';
// Components
import PaginationCustom from 'components/Pagination';
import { useSnackbar } from 'notistack';
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
  Tab,
  styled
} from '@mui/material';
import {
  listWithScrollStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  tabStyle
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
import { accessPointsOnlyFetch } from '../../store/accessPoints/accessPointsSlice';
import {useTranslation} from "react-i18next";

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

const CarParkPage = () => {
  const { t } = useTranslation();
  const [openForm, setOpenForm] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { data: renters } = useRentersQuery();
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
  const [file, setFile] = useState(null);

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
    dispatch(accessPointsOnlyFetch());
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

  const handleImportClick = (e) => {
    console.log('import click');
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files);
      let file = e.target.files[0];
      setFile(file);
      e.target.value = null;
    }
  };

  useEffect(() => {
    if (file) {
      let formData = new FormData();
      //Adding files to the formdata
      formData.append('file', file);
      formData.append('name', file.name);
      uploadCarParkReport(formData).then((response) => {
        enqueueSnackbar(t('pages.carParkPage.fileSent'), { variant: 'success' });
        setFile(null);
      });
    }
  }, [file]);

  const handleExportClick = () => {
    getCarParkReport().then((res) => {
      // Create blob link to download
      const url = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = url;
      const date = format(Date.now(), 'yyyy-MM-dd');
      const filename = `export_${date}.xlsx`;
      link.setAttribute('download', filename);
      // Append to html link element page
      document.body.appendChild(link);
      // Start download
      link.click();
      // Clean up and remove the link
      link.parentNode.removeChild(link);
    });
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
            backgroundColor: theme.colors.surface.low,
            boxShadow: !parkListScrolled && 'none',
            zIndex: 10,
            borderBottom: `1px solid ${theme.colors.outline.separator}`
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
            <Stack
              direction={'row'}
              justifyContent={'flex-start'}
              alignItems={'center'}
              gap={'16px'}
              sx={{ width: '100%' }}
            >
              <Typography sx={titleTextStyle}>{t('pages.carParkPage.carPark')}</Typography>
              <Stack direction={'row'} gap={'8px'}>
                <Button
                  component="label"
                  disableRipple
                  variant="contained"
                  fullWidth={false}
                  sx={secondaryButtonStyle({ ...theme })}
                >
                  {t('pages.carParkPage.import')}
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleImportClick}
                  />
                </Button>
                <Button
                  disableRipple
                  variant="contained"
                  fullWidth={false}
                  sx={secondaryButtonStyle({ ...theme })}
                  onClick={handleExportClick}
                >
                  {t('pages.carParkPage.export')}
                </Button>
              </Stack>
            </Stack>
            <Stack
              direction={'row'}
              justifyContent={'flex-end'}
              sx={{ width: '100%' }}
            >
              <Button
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={primaryButtonStyle({ ...theme })}
                onClick={handleAddCarClick}
              >
                {t('pages.carParkPage.addCar')}
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
                  backgroundColor: theme.colors.button.primary.default
                }
              }}
              sx={{ minHeight: '42px' }}
            >
              <Tab sx={tabStyle({ ...theme })} disableRipple label={t('pages.carParkPage.active')} />
              <Tab
                sx={tabStyle({ ...theme })}
                disableRipple
                label={t('pages.carParkPage.noActive')}
              />
              <Tab
                sx={tabStyle({ ...theme })}
                disableRipple
                label={t('pages.carParkPage.aboniment')}
              />
            </Tabs>
          </Stack>
        </AppBar>
      )}
      <Stack
        ref={parkListRef}
        sx={[
          listWithScrollStyle({ ...theme }),
          {
            width: '100%',
            backgroundColor: theme.colors.surface.low
          }
        ]}
        onScroll={handleParkListScroll}
      >
        <EventManager offset={!openForm ? 0 : isMobile ? 0 : 138} />
        <CarParkSpacer />
        {isMobile && (
          <>
            <AppBar
              sx={{
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: theme.colors.surface.low,
                boxShadow: !parkListScrolled && 'none',
                zIndex: 10,
                borderBottom: `1px solid ${theme.colors.outline.separator}`
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
                <Typography sx={titleTextStyle}>{t('pages.carParkPage.carPark')}</Typography>
                <Button
                  disableRipple
                  variant="contained"
                  fullWidth={false}
                  sx={primaryButtonStyle({ ...theme })}
                  onClick={handleAddCarClick}
                >
                  {t('pages.carParkPage.addCar')}
                </Button>
              </Stack>
              <Stack
                direction={'row'}
                gap={'8px'}
                justifyContent={'space-between'}
                sx={{
                  height: '56px',
                  width: '100%',
                  px: '16px',
                  py: '8px'
                }}
              >
                <Button
                  component="label"
                  disableRipple
                  variant="contained"
                  fullWidth
                  sx={secondaryButtonStyle({ ...theme })}
                >
                  {t('pages.carParkPage.import')}
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleImportClick}
                  />
                </Button>
                <Button
                  disableRipple
                  variant="contained"
                  fullWidth
                  sx={secondaryButtonStyle({ ...theme })}
                  onClick={handleExportClick}
                >
                  {t('pages.carParkPage.export')}
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
                      backgroundColor: theme.colors.button.primary.default
                    }
                  }}
                  sx={{ minHeight: '42px' }}
                >
                  <Tab
                    sx={tabStyle({ ...theme })}
                    disableRipple
                    label={t('pages.carParkPage.active')}
                  />
                  <Tab
                    sx={tabStyle({ ...theme })}
                    disableRipple
                    label={t('pages.carParkPage.noActive')}
                  />
                  <Tab
                    sx={tabStyle({ ...theme })}
                    disableRipple
                    label={t('pages.carParkPage.aboniment')}
                  />
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
                <LogCarParkCard
                  key={item.id}
                  car={item}
                  renter={renters?.find((renter) => renter.id === item.renter)}
                />
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
                  alt={
                    currentTab === 0
                      ? t('pages.carParkPage.noActiveCarInPark')
                      : currentTab === 1
                      ? t('pages.carParkPage.noActiveCarInPark')
                      : t('pages.carParkPage.noAboniment')
                  }
                />
                <Typography sx={titleTextStyle}>
                  {currentTab === 0
                    ? t('pages.carParkPage.noActiveCarInPark')
                    : currentTab === 1
                    ? t('pages.carParkPage.noActiveCarInPark')
                    : t('pages.carParkPage.noAboniment')}
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
