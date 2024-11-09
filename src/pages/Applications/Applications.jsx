import React, { useCallback, useRef, useState, useEffect } from 'react';
import PaginationCustom from 'components/Pagination';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
import { useDispatch, useSelector } from 'react-redux';
import {
  applicationsChangePageFetch,
  applicationsFetch,
  changeCurrentPage,
  setEditApplication
} from '../../store/applications/applicationSlice';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  AppBar,
  Box,
  Stack,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import { listWithScrollStyle, primaryButtonStyle } from '../../theme/styles';
import ApplicationFilter from '../../components/ApplicationFilter/ApplicationFilter';
import FooterSpacer from '../../components/Header/FooterSpacer';
import ApplicationsSpacer from './ApplicationsSpacer';
import parkEmptyIcon from '../../assets/svg/carpark_empty_icon.svg';
import { CARS_ON_PAGE, ITEM_MIN_WIDTH, ITEM_MAX_WIDTH } from '../../constants';
import LogApplicationCard from '../../components/LogApplicationCard/LogApplicationCard';
import EventManager from '../../components/EventManager/EventManager';
import OpenFormSpacer from './OpenformSpacer';
import AddApplicationDialog from '../../components/AddApplicationDialog/AddApplicationDialog';
import { useTranslation } from 'react-i18next';
import download from '../../assets/svg/unload_white.svg';
import {UnloadApplicationDialog} from "../../components/UnloadApplicationDialog/UnloadApplicationDialog";

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  maxWidth: 'max-content'
};

export const Applications = () => {
  const { t } = useTranslation();
  const [openForm, setOpenForm] = useState(false);
  const dispatch = useDispatch();
  const applications = useSelector((state) => state.applications.applications);
  const pages = useSelector((state) => state.applications.pages);
  const currentPage = useSelector((state) => state.applications.currentPage);
  const isLoading = useSelector((state) => state.applications.isLoadingFetch);
  const isError = useSelector((state) => state.applications.isErrorFetch);
  const isEditModal = useSelector(
    (state) => state.applications.editApplication.edit
  );
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [applicationsListScrolled, setApplicationsListScrolled] =
    useState(false);
  const applicationsListRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const containerRef = useRef(null);
  const [itemsInRow, setItemsInRow] = useState(0);
  const [isUnloadOpen, setIsUnloadOpen] = useState(false);

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
    return () => dispatch(changeCurrentPage(1));
  }, [dispatch]);

  const changePage = (event, value) => {
    dispatch(applicationsChangePageFetch(value));
    if (applicationsListRef.current) {
      applicationsListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setApplicationsListScrolled(false);
    }
  };

  const handleApplicationsListScroll = () => {
    if (applicationsListRef.current) {
      const { scrollTop } = applicationsListRef.current;
      if (scrollTop > 0) {
        setApplicationsListScrolled(true);
      } else if (applicationsListScrolled) {
        setApplicationsListScrolled(false);
      }
    }
  };

  const handleAddApplicationClick = () => {
    setIsCreateModal(true);
  };

  const handleCloseEditApplicationClick = () => {
    dispatch(
      setEditApplication({
        edit: false,
        application: null
      })
    );
  };

  const handleIsUnloadClose = () => {
    setIsUnloadOpen(false);
  }

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
            boxShadow: !applicationsListScrolled && 'none',
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
            <Typography
              sx={{ ...titleTextStyle, maxWidth: 300, width: '100%' }}
            >
              {t('pages.applications.requests')}:{' '}
              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: 400
                }}
              >
                {applications.count} {t('pages.sessionsPage.all')}
              </span>
            </Typography>
            <Stack
              direction={'row'}
              justifyContent={'flex-end'}
              sx={{ width: '100%' }}
              gap={1}
            >
              <Button
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={primaryButtonStyle({ ...theme })}
                onClick={handleAddApplicationClick}
              >
                {t('pages.applications.addRequest')}
              </Button>
              <IconButton
                onClick={() => setIsUnloadOpen(true)}
                disableRipple
                sx={primaryButtonStyle({ ...theme })}
              >
                <img
                  src={download}
                  alt={'details'}
                  style={{
                    width: '15px'
                  }}
                />
              </IconButton>
              <ApplicationFilter
                openForm={openForm}
                setOpenForm={setOpenForm}
              />
            </Stack>
          </Stack>
        </AppBar>
      )}
      <Stack
        ref={applicationsListRef}
        sx={[
          listWithScrollStyle({ ...theme }),
          {
            width: '100%',
            backgroundColor: theme.colors.surface.low
          }
        ]}
        onScroll={handleApplicationsListScroll}
      >
        <EventManager offset={!openForm ? 0 : isMobile ? 0 : 270} />
        <ApplicationsSpacer />
        {isMobile && (
          <>
            <AppBar
              sx={{
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: theme.colors.surface.low,
                boxShadow: !applicationsListScrolled && 'none',
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
                <Typography sx={{ ...titleTextStyle }}>
                  {t('pages.applications.requests')}:<br />{' '}
                  <span style={{ fontSize: '1rem', fontWeight: 400 }}>
                    {applications.count} {t('pages.sessionsPage.all')}
                  </span>
                </Typography>
                <Stack direction={'row'} gap={'16px'}>
                  <Button
                    disableRipple
                    variant="contained"
                    fullWidth={false}
                    sx={primaryButtonStyle({ ...theme })}
                    onClick={handleAddApplicationClick}
                  >
                    {t('pages.applications.addRequest')}
                  </Button>
                  <IconButton
                    onClick={() => setIsUnloadOpen(true)}
                    disableRipple
                    sx={primaryButtonStyle({ ...theme })}
                  >
                    <img
                      src={download}
                      alt={'details'}
                      style={{
                        width: '15px'
                      }}
                    />
                  </IconButton>
                </Stack>
              </Stack>
              <Box
                sx={{
                  height: openForm ? '194px' : '56px',
                  py: '8px'
                }}
              >
                <ApplicationFilter
                  openForm={openForm}
                  setOpenForm={setOpenForm}
                />
              </Box>
            </AppBar>
            {openForm && <OpenFormSpacer />}
          </>
        )}

        {applications && applications.count > 0 ? (
          <>
            <Box
              ref={containerRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {applications.requests.map((item, index) => (
                <LogApplicationCard key={item.id} application={item} />
              ))}
            </Box>
            <Box
              sx={{
                height: '48px'
              }}
            >
              {applications.count > CARS_ON_PAGE && (
                <PaginationCustom
                  pages={Math.ceil(pages / CARS_ON_PAGE)}
                  changePage={changePage}
                  currentPage={currentPage}
                />
              )}
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
                  alt="Нет заявок"
                />
                <Typography sx={titleTextStyle}>
                  {t('pages.applications.noRequest')}
                </Typography>
              </>
            )}
          </Stack>
        )}

        <FooterSpacer />
      </Stack>
      <AddApplicationDialog
        show={isCreateModal}
        handleClose={() => setIsCreateModal(false)}
      />
      <AddApplicationDialog
        show={isEditModal}
        handleClose={handleCloseEditApplicationClick}
        edit={true}
      />
      <UnloadApplicationDialog
        isOpen={isUnloadOpen}
        handleClose={handleIsUnloadClose}
      />
    </>
  );
};
