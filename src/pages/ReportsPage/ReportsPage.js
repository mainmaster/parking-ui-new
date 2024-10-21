import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { AppBar, Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {REPORTS_ON_PAGE} from '../../constants';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
import reportIcon from '../../assets/svg/reptor.svg';
import { useDispatch, useSelector } from 'react-redux';
import {useEffect, useRef, useState} from 'react';
import PaginationCustom from '../../components/Pagination';
import { listWithScrollStyle } from '../../theme/styles';
import {reportsChangePageFetch, reportFetch, changeCurrentPage} from "../../store/reports/reportsSlice";
import {ReportCard} from "../../components/ReportCard/ReportCard";
import EventManager from "../../components/EventManager/EventManager";
import TerminalSpacer from "../Terminals/TerminalSpacer";

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  whiteSpace: 'nowrap'
};

const ReportsPage = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.reports.reports);
  const pages = useSelector((state) => state.reports.pages);
  const currentPage = useSelector((state) => state.reports.currentPage);
  const isLoading = useSelector((state) => state.reports.isLoadingFetch);
  const sessionsListRef = useRef(null);
  const [sessionsListScrolled, setSessionsListScrolled] = useState(false);

  useEffect(() => {
    dispatch(reportFetch());
    return () => dispatch(changeCurrentPage(1));
  }, [dispatch]);

  const changePage = (event, value) => {
    dispatch(reportsChangePageFetch(value));
    if (sessionsListRef.current) {
      sessionsListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
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
              {t('pages.reports.title')}
            </Typography>
          </Stack>
        </AppBar>
      )}
      {isMobile && (
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
            {t('pages.reports.title')}
          </Typography>
        </Stack>
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
        <EventManager />
        <TerminalSpacer />
        {reports.length > 0 ? (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {reports.map((item, index) => (
                <ReportCard key={item.id} report={item} />
              ))}
            </Box>
            <Box
              sx={{
                height: '48px'
              }}
            >
              <PaginationCustom
                pages={Math.ceil(pages / REPORTS_ON_PAGE)}
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
                  src={reportIcon}
                  alt={t('pages.reports.noItem')}
                />
                <Typography sx={titleTextStyle}>
                  {t('pages.reports.noItem')}
                </Typography>
              </>
            )}
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default ReportsPage;
