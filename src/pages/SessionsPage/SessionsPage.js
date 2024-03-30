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
import { AppBar, Box, Stack, Typography } from '@mui/material';
import { colors } from '../../theme/colors';
import { listWithScrollStyle } from '../../theme/styles';
import ParkingInfo from '../../components/ParkingInfo/ParkingInfo';
import SessionsFilter from '../../components/SessionsFilter/SessionsFilter';
import FooterSpacer from '../../components/Header/FooterSpacer';
import SessionsSpacer from './SessionsSpacer';
import sessionsListIcon from '../../assets/svg/sessions_list_icon.svg';
import { SESSIONS_ON_PAGE } from '../../constants';
import LogSessionCard from '../../components/LogSessionCard/LogSessionCard';
import EventManager from '../../components/EventManager/EventManager';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

const SessionsPage = () => {
  const [openForm, setOpenForm] = useState(false);
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.sessions.sessions);
  const pages = useSelector((state) => state.sessions.pages);
  const currentPage = useSelector((state) => state.sessions.currentPage);
  const isLoading = useSelector((state) => state.sessions.isLoadingFetch);
  const isError = useSelector((state) => state.sessions.isErrorFetch);
  const [sessionsListScrolled, setSessionsListScrolled] = useState(false);
  const sessionsListRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
                borderBottom: openForm
                  ? `1px solid ${colors.outline.surface}`
                  : 'none'
              }}
            >
              <SessionsFilter openForm={openForm} setOpenForm={setOpenForm} />
            </Box>
          </>
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
                  key={index}
                  session={item}
                  onClickImage={changeActiveImageModal}
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
