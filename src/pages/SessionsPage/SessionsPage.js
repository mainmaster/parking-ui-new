/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Lightbox from 'react-18-image-lightbox';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
// Store
import {
  sessionsFetch,
  sessionsChangePageFetch,
  changeCurrentPage
} from 'store/sessions/sessionsSlice';
// Components
import PaginationCustom from 'components/Pagination';
// Constants
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AppBar, Box, Stack, Typography, Button } from '@mui/material';
import {listWithScrollStyle, primaryButtonStyle, secondaryButtonStyle} from '../../theme/styles';
import ParkingInfo from '../../components/ParkingInfo/ParkingInfo';
import SessionsFilter from '../../components/SessionsFilter/SessionsFilter';
import FooterSpacer from '../../components/Header/FooterSpacer';
import SessionsSpacer from './SessionsSpacer';
import sessionsListIcon from '../../assets/svg/sessions_list_icon.svg';
import { SESSIONS_ON_PAGE } from '../../constants';
import LogSessionCard from '../../components/LogSessionCard/LogSessionCard';
import EventManager from '../../components/EventManager/EventManager';
import CloseSessionsDialog from '../../components/CloseSessionsDialog/CloseSessionsDialog';
import {useTranslation} from "react-i18next";
import {CreateSessionDialog} from "../../components/CreateSessionDialog/CreateSessionDialog";
import {useLocation, useNavigate} from "react-router-dom";

const titleTextStyle = {
  width: '25%',
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

const initialAccessOptions = {
  disableResetDuty: false,
  disableCloseSession: false,
  disableCloseSessionBeforeDate: false
};

const SessionsPage = () => {
  const { t } = useTranslation();
  const [openForm, setOpenForm] = useState(false);
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.sessions.sessions);
  const pages = useSelector((state) => state.sessions.pages);
  const currentPage = useSelector((state) => state.sessions.currentPage);
  const isLoading = useSelector((state) => state.sessions.isLoadingFetch);
  const isError = useSelector((state) => state.sessions.isErrorFetch);
  const operator = useSelector((state) => state.parkingInfo.operator);
  const userType = useSelector((state) => state.parkingInfo.userType);
  const [sessionsListScrolled, setSessionsListScrolled] = useState(false);
  const sessionsListRef = useRef(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openCloseSessionsDialog, setOpenCloseSessionsDialog] = useState(false);
  const [accessOptions, setAccessOptions] = useState(initialAccessOptions);
  const [isCreateSessionDialogOpen, setIsCreateSessionDialogOpen] = useState(false);

  useEffect(() => {
    if (userType === 'operator') {
      let options = initialAccessOptions;
      if (
        operator &&
        'access_to_close_session' in operator &&
        operator.access_to_close_session === true
      ) {
        options = { ...options, disableCloseSession: false };
      } else {
        options = { ...options, disableCloseSession: true };
      }
      if (
        operator &&
        'access_to_close_sessions_before_date' in operator &&
        operator.access_to_close_sessions_before_date === true
      ) {
        options = { ...options, disableCloseSessionBeforeDate: false };
      } else {
        options = { ...options, disableCloseSessionBeforeDate: true };
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

  const [imageModal, setImageModal] = useState({
    isOpen: false,
    src: ''
  });

  const changeActiveImageModal = (src) =>
    setImageModal({
      src: src,
      isOpen: !imageModal.isOpen
    });

  useEffect(() => {
    return () => dispatch(changeCurrentPage(1));
  }, [dispatch]);

  // const changePage = (index) => {
  //   dispatch(sessionsChangePageFetch(index));
  // };

  const updateURL = (newFilters) => {
    const currentParams = new URLSearchParams(location.search);

    Object.keys(newFilters).forEach((key) => {
      const value = newFilters[key];
      if (value !== undefined && value !== null) {
        currentParams.set(key, value);
      } else {
        currentParams.delete(key);
      }
    });

    currentParams.set('page', newFilters.page || 1);

    navigate({ search: currentParams.toString() });
  };

  const changePage = (event, value) => {
    dispatch(sessionsChangePageFetch(value));
    const values = {
      page: value
    };
    updateURL(values);
    if (sessionsListRef.current) {
      sessionsListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setSessionsListScrolled(false);
    }
  };

  const handleSessionsListScroll = () => {
    if (sessionsListRef.current) {
      const { scrollTop } = sessionsListRef.current;
      if (scrollTop > 0) {
        setSessionsListScrolled(true);
      } else if (sessionsListScrolled) {
        setSessionsListScrolled(false);
      }
    }
  };

  const handleCloseSessionsClick = () => {
    setOpenCloseSessionsDialog(true);
  };

  const handleCloseCreateSessionDialog = () => {
    setIsCreateSessionDialogOpen(false);
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
            boxShadow: !sessionsListScrolled && 'none',
            zIndex: 10
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
            <Typography sx={titleTextStyle}>{t('pages.sessionsPage.sessions')}: <span style={{fontSize: '1rem', fontWeight: 400}}>{pages} {t('pages.sessionsPage.all')}</span></Typography>
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
                onClick={() => setIsCreateSessionDialogOpen(true)}
              >
                {t('pages.sessionsPage.create')}
              </Button>
              <SessionsFilter openForm={openForm} setOpenForm={setOpenForm} />
            </Stack>
          </Stack>
        </AppBar>
      )}
      <Stack
        ref={sessionsListRef}
        sx={[
          listWithScrollStyle({ ...theme }),
          {
            width: '100%',
            backgroundColor: theme.colors.surface.low
          }
        ]}
        onScroll={handleSessionsListScroll}
      >
        <EventManager offset={!openForm ? 0 : isMobile ? 0 : 270} />
        <SessionsSpacer />

        {isMobile && (
          <>
            <Stack direction={'column'} sx={{ p: '16px', pb: '8px', width: '100%', }}>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography sx={{...titleTextStyle, padding: '16px', flex: 1.5 }}>{t('pages.sessionsPage.sessions')}: <span style={{fontSize: '1rem', fontWeight: 400}}>{pages} {t('pages.sessionsPage.all')}</span></Typography>
                <Button
                  disableRipple
                  variant="contained"
                  fullWidth={false}
                  sx={{...primaryButtonStyle({ ...theme }), flex: 1 }}
                  onClick={() => setIsCreateSessionDialogOpen(true)}
                >
                  {t('pages.sessionsPage.create')}
                </Button>
              </Stack>
              <ParkingInfo fullWidth={true} />
            </Stack>
            <Box
              sx={{
                height: openForm ? '327px' : '56px',
                py: '8px',
                borderBottom:
                  openForm && userType !== 'admin'
                    ? `1px solid ${theme.colors.outline.surface}`
                    : 'none'
              }}
            >
              <SessionsFilter openForm={openForm} setOpenForm={setOpenForm} />
            </Box>
            {(userType === 'admin' ||
              (userType === 'operator' &&
                accessOptions.disableCloseSessionBeforeDate === false)) && (
              <Box
                sx={{
                  px: '16px',
                  py: '8px',
                  minWidth: '288px',
                  borderBottom: openForm
                    ? `1px solid ${theme.colors.outline.surface}`
                    : 'none'
                }}
              >
                <Button
                  disableRipple
                  variant="contained"
                  fullWidth
                  sx={secondaryButtonStyle({ ...theme })}
                  onClick={handleCloseSessionsClick}
                >
                  {t('pages.sessionsPage.closeSessions')}
                </Button>
              </Box>
            )}
          </>
        )}
        {!isMobile && (
          <Stack direction={'row'} sx={{ width: '100%', px: '16px' }} justifyContent={'space-between'}>
            {
              (userType === 'admin' ||
                (userType === 'operator' &&
                  accessOptions.disableCloseSessionBeforeDate === false)) ?
                <Button
                  disableRipple
                  variant="contained"
                  fullWidth={false}
                  sx={secondaryButtonStyle({ ...theme })}
                  onClick={handleCloseSessionsClick}
                >
                  {t('pages.sessionsPage.closeSessions')}
                </Button> :
                <div></div>
            }
            <ParkingInfo />
          </Stack>
        )}

        {sessions.length > 0 ? (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {sessions.map((item, index) => (
                <LogSessionCard
                  key={item.id}
                  session={item}
                  onClickImage={changeActiveImageModal}
                  accessOptions={accessOptions}
                />
              ))}
            </Box>
            <Box
              sx={{
                height: '48px'
              }}
            >
              <PaginationCustom
                pages={Math.ceil(pages / SESSIONS_ON_PAGE)}
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
            {isLoading ? (
              <SpinerLogo />
            ) : (
              <>
                <img
                  style={{ height: '40px' }}
                  src={sessionsListIcon}
                  alt={t('pages.sessionsPage.noSessions')}
                />
                <Typography sx={titleTextStyle}>{t('pages.sessionsPage.noSessions')}</Typography>
              </>
            )}
          </Stack>
        )}

        <FooterSpacer />
      </Stack>
      <CloseSessionsDialog
        show={openCloseSessionsDialog}
        handleClose={setOpenCloseSessionsDialog}
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
      <CreateSessionDialog isOpen={isCreateSessionDialogOpen} handleClose={handleCloseCreateSessionDialog} />
    </>
  );
};

export default SessionsPage;
