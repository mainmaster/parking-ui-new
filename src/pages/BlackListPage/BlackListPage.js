import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import PaginationCustom from 'components/Pagination';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
import CreateCarParkModal from 'components/Modals/CreateCarParkModal';
import EditCarParkModal from 'components/Modals/EditCarParkModal';
// Store
import {
  blackListFetch,
  createModalHandler,
  editModalHandler,
  blackListChangePageFetch
} from 'store/blackList/blackListSlice';
// Utils
import { CarNumberCard } from '../../components/CarNumberCard/CarNumberCard';
import { useNavigate, useParams } from 'react-router-dom';
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
import BlackListFilter from '../../components/BlackListFilter/BlackListFilter';
import FooterSpacer from '../../components/Header/FooterSpacer';
import BlackListSpacer from './BlackListSpacer';
import blackListEmptyIcon from '../../assets/svg/blacklist_empty_icon.svg';
import { CARS_ON_PAGE, ITEM_MIN_WIDTH, ITEM_MAX_WIDTH } from '../../constants';
import LogBlackListCard from '../../components/LogBlackListCard/LogBlackListCard';
import EventManager from '../../components/EventManager/EventManager';
import AddCarDialog from '../../components/BlackListAddCarDialog/BlackListAddCarDialog';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  whiteSpace: 'nowrap'
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

const BlackListPage = () => {
  const dispatch = useDispatch();
  const blackList = useSelector((state) => state.blackList.blackList);
  const pages = useSelector((state) => state.blackList.pages);
  const currentPage = useSelector((state) => state.blackList.currentPage);
  const isLoading = useSelector((state) => state.blackList.isLoadingFetch);
  const isError = useSelector((state) => state.blackList.isErrorFetch);
  const isEditModal = useSelector((state) => state.blackList.isEditModal);
  const isCreateModal = useSelector((state) => state.blackList.isCreateModal);
  const [blackListScrolled, setBlackListScrolled] = useState(false);
  const blackListRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const urlStatus = useParams();
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
    dispatch(blackListFetch());
  }, [urlStatus]);

  const changePage = (event, value) => {
    dispatch(blackListChangePageFetch(value));
    if (blackListRef.current) {
      blackListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setBlackListScrolled(false);
    }
  };

  const handleBlackListScroll = () => {
    if (blackListRef.current) {
      const { scrollTop } = blackListRef.current;
      if (scrollTop > 0) {
        setBlackListScrolled(true);
      } else if (blackListScrolled) {
        setBlackListScrolled(false);
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
            boxShadow: !blackListScrolled && 'none',
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
            <Typography sx={titleTextStyle}>Чёрный список</Typography>
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
                Добавить в ЧС
              </Button>

              <BlackListFilter />
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
            </Tabs>
          </Stack>
        </AppBar>
      )}
      <Stack
        ref={blackListRef}
        sx={[
          listWithScrollStyle,
          {
            width: '100%',
            backgroundColor: colors.surface.low
          }
        ]}
        onScroll={handleBlackListScroll}
      >
        <EventManager />
        <BlackListSpacer />
        {isMobile && (
          <>
            <AppBar
              sx={{
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: colors.surface.low,
                boxShadow: !blackListScrolled && 'none',
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
                <Typography sx={titleTextStyle}>Чёрный список</Typography>
                <Button
                  disableRipple
                  variant="contained"
                  fullWidth={false}
                  sx={closeButtonStyle}
                  onClick={handleAddCarClick}
                >
                  Добавить в ЧС
                </Button>
              </Stack>
              <Box
                sx={{
                  height: '56px',
                  py: '8px'
                }}
              >
                <BlackListFilter />
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
                </Tabs>
              </Stack>
            </AppBar>
          </>
        )}

        {blackList &&
        blackList.black_list &&
        blackList.black_list.length > 0 ? (
          <>
            <Box
              ref={containerRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {blackList.black_list.map((item, index) => (
                <LogBlackListCard key={item.id} car={item} />
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
              {blackList.count > CARS_ON_PAGE && (
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
                  src={blackListEmptyIcon}
                  alt="Нет машин в чёрном списке"
                />
                <Typography sx={[titleTextStyle, { whiteSpace: 'wrap' }]}>
                  {currentTab === 0
                    ? 'Нет машин в чёрном списке'
                    : 'Нет машин с истёкшим запретом на доступ'}
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

export default BlackListPage;
