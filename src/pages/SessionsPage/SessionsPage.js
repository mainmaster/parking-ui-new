/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Lightbox from 'react-18-image-lightbox';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
// Store
import {
  sessionsFetch,
  sessionsChangePageFetch,
  changeCurrentPage
} from 'store/sessions/sessionsSlice';
import { getUserData } from '../../api/auth/login';
import { useSnackbar } from 'notistack';
// Components
import PaginationCustom from 'components/Pagination';
// Constants
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AppBar, Box, Stack, Typography, Button } from '@mui/material';
import { colors } from '../../theme/colors';
import {
  listStyle,
  listWithScrollStyle,
  secondaryButtonStyle
} from '../../theme/styles';
import ParkingInfo from '../../components/ParkingInfo/ParkingInfo';
import SessionsFilter from '../../components/SessionsFilter/SessionsFilter';
import FooterSpacer from '../../components/Header/FooterSpacer';
import SessionsSpacer from './SessionsSpacer';
import sessionsListIcon from '../../assets/svg/sessions_list_icon.svg';
import { SESSIONS_ON_PAGE } from '../../constants';
import LogSessionCard from '../../components/LogSessionCard/LogSessionCard';
import EventManager from '../../components/EventManager/EventManager';
import CloseSessionsDialog from '../../components/CloseSessionsDialog/CloseSessionsDialog';

const titleTextStyle = {
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
  const [openForm, setOpenForm] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const sessions = useSelector((state) => state.sessions.sessions);
  const pages = useSelector((state) => state.sessions.pages);
  const currentPage = useSelector((state) => state.sessions.currentPage);
  const isLoading = useSelector((state) => state.sessions.isLoadingFetch);
  const isError = useSelector((state) => state.sessions.isErrorFetch);
  const [userData, setUserData] = useState(null);
  const userType = useSelector((state) => state.parkingInfo.userType);
  const [sessionsListScrolled, setSessionsListScrolled] = useState(false);
  const sessionsListRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openCloseSessionsDialog, setOpenCloseSessionsDialog] = useState(false);
  const [currentHref, setCurrentHref] = useState(useLocation().pathname);
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
        'access_to_close_session' in userData.operator &&
        userData.operator.access_to_close_session === true
      ) {
        options = { ...options, disableCloseSession: false };
      } else {
        options = { ...options, disableCloseSession: true };
      }
      if (
        userData.operator &&
        'access_to_close_sessions_before_date' in userData.operator &&
        userData.operator.access_to_close_sessions_before_date === true
      ) {
        options = { ...options, disableCloseSessionBeforeDate: false };
      } else {
        options = { ...options, disableCloseSessionBeforeDate: true };
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
    dispatch(sessionsFetch());
    return () => dispatch(changeCurrentPage(1));
  }, [dispatch]);

  // const changePage = (index) => {
  //   dispatch(sessionsChangePageFetch(index));
  // };

  const changePage = (event, value) => {
    dispatch(sessionsChangePageFetch(value));
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
            <Typography sx={titleTextStyle}>Сессии</Typography>
            <Stack
              direction={'row'}
              justifyContent={'flex-end'}
              sx={{ width: '100%' }}
            >
              <ParkingInfo />

              <SessionsFilter openForm={openForm} setOpenForm={setOpenForm} />
            </Stack>
          </Stack>
        </AppBar>
      )}
      <Stack
        ref={sessionsListRef}
        sx={[
          listWithScrollStyle,
          {
            width: '100%',
            backgroundColor: colors.surface.low
          }
        ]}
        onScroll={handleSessionsListScroll}
      >
        <EventManager />
        <SessionsSpacer />

        {isMobile && (
          <>
            <Box sx={{ height: '86px', p: '16px', pb: '8px' }}>
              <ParkingInfo fullWidth />
            </Box>
            <Box
              sx={{
                height: openForm ? '327px' : '56px',
                py: '8px',
                borderBottom:
                  openForm && userType !== 'admin'
                    ? `1px solid ${colors.outline.surface}`
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
                    ? `1px solid ${colors.outline.surface}`
                    : 'none'
                }}
              >
                <Button
                  disableRipple
                  variant="contained"
                  fullWidth
                  sx={secondaryButtonStyle}
                  onClick={handleCloseSessionsClick}
                >
                  Закрыть сессии старше даты
                </Button>
              </Box>
            )}
          </>
        )}
        {!isMobile &&
          (userType === 'admin' ||
            (userType === 'operator' &&
              accessOptions.disableCloseSessionBeforeDate === false)) && (
            <Stack direction={'row'} sx={{ width: '100%', px: '16px' }}>
              <Button
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={secondaryButtonStyle}
                onClick={handleCloseSessionsClick}
              >
                Закрыть сессии старше даты
              </Button>
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
                  alt="нет сессий"
                />
                <Typography sx={titleTextStyle}>Нет сессий</Typography>
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
    </>
  );
};

export default SessionsPage;
