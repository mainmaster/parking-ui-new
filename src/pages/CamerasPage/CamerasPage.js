import { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Store
import {
  camerasFetch,
  editModalHandler,
  createModalHandler
} from 'store/cameras/camerasSlice';
import _ from 'lodash';
import { AppBar, Box, Stack, Typography, Button } from '@mui/material';
import { listWithScrollStyle, primaryButtonStyle } from '../../theme/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import FooterSpacer from '../../components/Header/FooterSpacer';
import CamerasSpacer from './CamerasSpacer';
import cameraEmptyIcon from '../../assets/svg/camera_empty_icon.svg';
import EventManager from '../../components/EventManager/EventManager';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
import AddCameraDialog from '../../components/AddCameraDialog/AddCameraDialog';
import LogCameraCard from '../../components/LogCameraCard/LogCameraCard';
import { ITEM_MIN_WIDTH, ITEM_MAX_WIDTH } from '../../constants';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  whiteSpace: 'nowrap'
};

const CamerasPage = () => {
  const dispatch = useDispatch();
  const cameras = useSelector((state) => state.cameras.cameras);
  const isLoading = useSelector((state) => state.cameras.isLoadingFetch);
  const isError = useSelector((state) => state.cameras.isErrorFetch);
  const isEditModal = useSelector((state) => state.cameras.isEditModal);
  const isCreateModal = useSelector((state) => state.cameras.isCreateModal);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [camerasListScrolled, setCamerasListScrolled] = useState(false);
  const camerasListRef = useRef(null);
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
    dispatch(camerasFetch());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCamerasListScroll = () => {
    if (camerasListRef.current) {
      const { scrollTop } = camerasListRef.current;
      if (scrollTop > 0) {
        setCamerasListScrolled(true);
      } else if (camerasListScrolled) {
        setCamerasListScrolled(false);
      }
    }
  };

  const handleEditCameraClick = () => {
    dispatch(editModalHandler());
  };

  const handleAddCameraClick = () => {
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
            boxShadow: !camerasListScrolled && 'none',
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
            <Typography sx={titleTextStyle}>Камеры</Typography>
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
                onClick={handleAddCameraClick}
              >
                Добавить камеру
              </Button>
            </Stack>
          </Stack>
        </AppBar>
      )}
      <Stack
        ref={camerasListRef}
        sx={[
          listWithScrollStyle({ ...theme }),
          {
            width: '100%',
            backgroundColor: theme.colors.surface.low
          }
        ]}
        onScroll={handleCamerasListScroll}
      >
        <EventManager />
        <CamerasSpacer />
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
            <Typography sx={titleTextStyle}>Камеры</Typography>
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              sx={primaryButtonStyle({ ...theme })}
              onClick={handleAddCameraClick}
            >
              Добавить камеру
            </Button>
          </Stack>
        )}

        {cameras && cameras.length > 0 ? (
          <>
            <Box
              ref={containerRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {_.sortBy(cameras, ['id']).map((item) => (
                <LogCameraCard key={item.id} camera={item} />
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
                  src={cameraEmptyIcon}
                  alt="Нет камер"
                />
                <Typography sx={[titleTextStyle, { whiteSpace: 'wrap' }]}>
                  Нет камер
                </Typography>
              </>
            )}
          </Stack>
        )}

        <FooterSpacer />
      </Stack>
      <AddCameraDialog
        show={isCreateModal}
        handleClose={handleAddCameraClick}
      />
      <AddCameraDialog
        show={isEditModal}
        handleClose={handleEditCameraClick}
        edit={true}
      />
    </>
  );
};

export default CamerasPage;
