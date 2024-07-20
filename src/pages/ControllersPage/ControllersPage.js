import { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Store
import {
  controllersFetch,
  editModalHandler,
  createModalHandler
} from 'store/controllers/controllersSlice';
import _ from 'lodash';
import { AppBar, Box, Stack, Typography, Button } from '@mui/material';
import { listWithScrollStyle, primaryButtonStyle } from '../../theme/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import FooterSpacer from '../../components/Header/FooterSpacer';
import ControllersSpacer from './ControllersSpacer';
import controllerEmptyIcon from '../../assets/svg/controller_empty_icon.svg';
import EventManager from '../../components/EventManager/EventManager';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
import AddControllerDialog from '../../components/AddControllerDialog/AddControllerDialog';
import LogControllerCard from '../../components/LogControllerCard/LogControllerCard';
import { ITEM_MIN_WIDTH, ITEM_MAX_WIDTH } from '../../constants';
import {useTranslation} from "react-i18next";

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  whiteSpace: 'nowrap'
};

const ControllersPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const controllers = useSelector((state) => state.controllers.controllers);
  const isLoading = useSelector((state) => state.controllers.isLoadingFetch);
  const isError = useSelector((state) => state.controllers.isErrorFetch);
  const isEditModal = useSelector((state) => state.controllers.isEditModal);
  const isCreateModal = useSelector((state) => state.controllers.isCreateModal);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [controllersListScrolled, setControllersListScrolled] = useState(false);
  const controllersListRef = useRef(null);
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
    dispatch(controllersFetch());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleControllersListScroll = () => {
    if (controllersListRef.current) {
      const { scrollTop } = controllersListRef.current;
      if (scrollTop > 0) {
        setControllersListScrolled(true);
      } else if (controllersListScrolled) {
        setControllersListScrolled(false);
      }
    }
  };

  const handleEditControllerClick = () => {
    dispatch(editModalHandler());
  };

  const handleAddControllerClick = () => {
    dispatch(createModalHandler());
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
            boxShadow: !controllersListScrolled && 'none',
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
            <Typography sx={titleTextStyle}>{t('pages.controllerPage.controllers')}</Typography>
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
                onClick={handleAddControllerClick}
              >
                {t('pages.controllerPage.addController')}
              </Button>
            </Stack>
          </Stack>
        </AppBar>
      )}
      <Stack
        ref={controllersListRef}
        sx={[
          listWithScrollStyle({ ...theme }),
          {
            width: '100%',
            backgroundColor: theme.colors.surface.low
          }
        ]}
        onScroll={handleControllersListScroll}
      >
        <EventManager />
        <ControllersSpacer />
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
            <Typography sx={titleTextStyle}>{t('pages.controllerPage.controllers')}</Typography>
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              sx={primaryButtonStyle({ ...theme })}
              onClick={handleAddControllerClick}
            >
              {t('pages.controllerPage.addController')}
            </Button>
          </Stack>
        )}

        {controllers && controllers.length > 0 ? (
          <>
            <Box
              ref={containerRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {_.sortBy(controllers, ['id']).map((item) => (
                <LogControllerCard key={item.id} controller={item} />
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
                  src={controllerEmptyIcon}
                  alt={t('pages.controllerPage.noController')}
                />
                <Typography sx={[titleTextStyle, { whiteSpace: 'wrap' }]}>
                  {t('pages.controllerPage.noController')}
                </Typography>
              </>
            )}
          </Stack>
        )}

        <FooterSpacer />
      </Stack>
      <AddControllerDialog
        show={isCreateModal}
        handleClose={handleAddControllerClick}
      />
      <AddControllerDialog
        show={isEditModal}
        handleClose={handleEditControllerClick}
        edit={true}
      />
    </>
  );
};

export default ControllersPage;
