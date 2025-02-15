import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { AppBar, Box, Stack, Typography } from '@mui/material';
import { listWithScrollStyle } from '../../theme/styles';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
import { useDispatch, useSelector } from 'react-redux';
import {useEffect, useRef, useState} from 'react';
import {
  actionLogsChangePageFetch,
  actionLogsFetch,
  changeCurrentPage
} from '../../store/actionLogs/actionLogsSlice';
import { useParkingInfoQuery } from '../../api/settings/settings';
import actionLogsIcon from 'src/assets/svg/action_logs_icon.svg';
import ActionLogCard from '../../components/ActionLogCard';
import ActionLogFilter from '../../components/ActionLogFilter/ActionLogFilter';
import OpenFormSpacer from '../PaymentsPage/OpenformSpacer';
import {ACTION_LOGS_ON_PAGE} from "../../constants";
import PaginationCustom from "../../components/Pagination";
import {useLocation, useNavigate} from "react-router-dom";
import EventManager from "../../components/EventManager/EventManager";
import ActionLogsSpacer from "./ActionLogsSpacer";

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  whiteSpace: 'nowrap'
};

const ActionLogsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data: parkingData } = useParkingInfoQuery();
  const actionLogs = useSelector((state) => state.actionLogs.actionLogs);
  const pages = useSelector((state) => state.actionLogs.pages);
  const currentPage = useSelector((state) => state.actionLogs.currentPage);
  const isLoading = useSelector((state) => state.actionLogs.isLoadingFetch);
  const actionLogsListRef = useRef(null);
  const [actionLogsListScrolled, setActionLogsListScrolled] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const containerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!parkingData) {
  //     return;
  //   }
  //
  //   dispatch(actionLogsFetch({ id: parkingData.parkingID }));
  //   return () => dispatch(changeCurrentPage(1));
  // }, [dispatch, parkingData, isMobile]);


  const changePage = (event, value) => {
    dispatch(actionLogsChangePageFetch(value));
    const values = {
      page: value
    };
    updateURL(values);
    if (actionLogsListRef.current) {
      actionLogsListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setActionLogsListScrolled(false);
    }
  };

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
  const handleActionLogsListScroll = () => {
    if (actionLogsListRef.current) {
      const { scrollTop } = actionLogsListRef.current;
      if (scrollTop > 0) {
        setActionLogsListScrolled(true);
      } else if (actionLogsListScrolled) {
        setActionLogsListScrolled(false);
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
            backgroundColor: theme.colors.surface.low,
            // boxShadow: !terminalListScrolled && 'none',
            zIndex: 10
            //borderBottom: `1px solid ${colors.outline.separator}`
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
            <Typography sx={titleTextStyle}>
              {t('pages.actionLogs.title')}
            </Typography>
            <ActionLogFilter openForm={openForm} setOpenForm={setOpenForm} />
          </Stack>
        </AppBar>
      )}
      <Stack
        ref={actionLogsListRef}
        sx={[
          listWithScrollStyle({ ...theme }),
          {
            width: '100%',
            backgroundColor: theme.colors.surface.low
          }
        ]}
        onScroll={handleActionLogsListScroll}
      >
        <EventManager offset={!openForm ? 0 : isMobile ? 0 : 336} />
        <ActionLogsSpacer />
        {isMobile && (
          <>
            <AppBar
              sx={{
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: theme.colors.surface.low,
                boxShadow: !actionLogsListScrolled && 'none',
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
                <Typography sx={titleTextStyle}>
                  {t('pages.actionLogs.title')}
                </Typography>

              </Stack>
              <Box
                sx={{
                  height: openForm ? '100px' : '56px',
                  py: '8px'
                }}
              >
                <ActionLogFilter
                  openForm={openForm}
                  setOpenForm={setOpenForm}
                />
              </Box>
            </AppBar>
            {openForm && <OpenFormSpacer />}
          </>
        )}
        {actionLogs?.length > 0 ? (
          <>
            <Box
              ref={containerRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {actionLogs.map((item, index) => (
                <ActionLogCard key={item.id} actionLog={item} />
              ))}
            </Box>
            <Box
              sx={{
                height: '48px'
              }}
            >
              {pages > ACTION_LOGS_ON_PAGE && (
                <PaginationCustom
                  pages={Math.ceil(pages / ACTION_LOGS_ON_PAGE)}
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
                  src={actionLogsIcon}
                  alt={t('pages.actionLogs.noItem')}
                />
                <Typography sx={titleTextStyle}>
                  {t('pages.actionLogs.noItem')}
                </Typography>
              </>
            )}
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default ActionLogsPage;
