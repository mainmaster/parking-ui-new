import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
// Store
import {
  closeApAllFetch,
  openApAllFetch,
  normalApAllFetch,
  getStatusesAccessPointsFetch
} from 'store/events/eventsSlice';
import {
  changeActiveOpenApTimeModal
} from 'store/cameras/camerasSlice';
// Components
import OpenApByTimeModal from 'components/Modals/OpenApByTimeModal';
import { camerasFetch } from '../../store/cameras/camerasSlice';
import { useParkingInfoQuery } from '../../api/settings/settings';
import { AppBar, Box, Button, Stack, Typography } from '@mui/material';
import React from 'react';
import {
  listStyle,
  secondaryButtonStyle
} from '../../theme/styles';
import { spacers } from '../../theme/spacers';
import ParkingInfo from '../ParkingInfo/ParkingInfo';
import CameraManagementItem from '../CameraManagementItem/CameraManagementItem';
import HeaderSpacer from '../Header/HeaderSpacer';
import CameraSpacer from './CameraSpacer';
import FooterSpacer from '../Header/FooterSpacer';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import cameraEmptyIcon from '../../assets/svg/camera_empty_icon.svg';
import { useTranslation } from 'react-i18next';

const titleTextStyle = {
  fontSiza: '1.5rem',
  fontWeight: 500,
  lineSize: '1.75rem'
};

const Cameras = ({ accessOptions }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const accessPoints = useSelector((state) => state.accessPoints.accessPoints);
  const isFetched = useSelector((state) => state.events.isAccessPointsFetched);
  const isChangedStatus = useSelector((state) => state.events.isChangedStatus);
  const isOpenApModal = useSelector((state) => state.cameras.isOpenApModal);
  const isOpenApTimeModal = useSelector(
    (state) => state.cameras.isOpenApTimeModal
  );
  const { data: parkingData } = useParkingInfoQuery();
  const cameras = useSelector((state) => state.cameras.cameras);
  const wsLedMessages = useRef(null);
  const [titlesLed, setTitlesLed] = useState({});
  const [cameraListScrolled, setCameraListScrolled] = useState(false);
  const camerasListRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const intervalAccessStatus = useRef(null);

  useEffect(() => {
    dispatch(camerasFetch());
  }, []);

  useEffect(() => {
    let typeWS = process.env.REACT_APP_API_URL.toString().split('/');
    let address = process.env.REACT_APP_API_URL;

    if (typeWS[0] === 'https:') {
      address = address.replace('https:', 'wss:');
    } else {
      address = address.replace('http:', 'ws:');
    }
    if (parkingData) {
      wsLedMessages.current = new WebSocket(
        address + `/wsLedMessages/?parkingID=${parkingData.parkingID}`
      );
    }

    wsLedMessages.current.onmessage = (event) => {
      let data = JSON.parse(event.data);
      let newTitles = titlesLed;

      newTitles[`access_point${data.access_point}`] = {
        line1: data.lines[0],
        line2: data.lines[1]
      };

      setTitlesLed({ ...titlesLed, ...newTitles });
    };
    wsLedMessages.current.open = (event) => {};

    return () => {
      if (wsLedMessages.current?.close) {
        return wsLedMessages.current.close();
      } else {
        return wsLedMessages.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isFetched) {
      if (!intervalAccessStatus.current) {
        dispatch(getStatusesAccessPointsFetch());
      }

      intervalAccessStatus.current = setInterval(() => {
        dispatch(getStatusesAccessPointsFetch());
      }, 5000)
    }

    return () => {
      clearInterval(intervalAccessStatus.current);
    }
  }, [isFetched, dispatch, isChangedStatus]);

  const handleCamerasListScroll = () => {
    if (camerasListRef.current) {
      const { scrollTop } = camerasListRef.current;
      if (scrollTop > 0) {
        setCameraListScrolled(true);
      } else if (cameraListScrolled) {
        setCameraListScrolled(false);
      }
    }
  };

  return (
    <>
      {!isMobile && (
        <AppBar
          sx={{
            width: `calc(100% - 72px - ${spacers.events})`,
            position: 'absolute',
            top: 0,
            left: '72px',
            backgroundColor: theme.colors.surface.low,
            boxShadow: !cameraListScrolled && 'none',
            zIndex: 1
          }}
        >
          <Stack
            direction={'row'}
            gap={'16px'}
            justifyContent={'space-between'}
            sx={{
              height: isMobile ? '56px' : '64px',
              width: '100%',
              p: '16px',
              pb: '8px',
              pt: isMobile ? '8px' : '16px'
            }}
          >
            <Stack
              direction={'row'}
              gap={'8px'}
              width={'100%'}
              minWidth={'260px'}
            >
              <Button
                disableRipple
                disabled={accessOptions.disableOpenAP}
                variant="contained"
                sx={[
                  secondaryButtonStyle({ ...theme }),
                  { width: '120px', px: '4px !important' }
                ]}
                onClick={() => dispatch(openApAllFetch())}
              >
                <Typography noWrap sx={{ color: 'inherit' }}>
                  {t('components.cameras.openAll')}
                </Typography>
              </Button>
              <Button
                disableRipple
                disabled={accessOptions.disableCloseAP}
                variant="contained"
                sx={[
                  secondaryButtonStyle({ ...theme }),
                  { width: '120px', px: '4px !important' }
                ]}
                onClick={() => dispatch(closeApAllFetch())}
              >
                <Typography noWrap sx={{ color: 'inherit' }}>
                  {t('components.cameras.closeAll')}
                </Typography>
              </Button>
              <Button
                disableRipple
                disabled={accessOptions.disableWorkAP}
                variant="contained"
                sx={[
                  secondaryButtonStyle({ ...theme }),
                  { width: '120px', px: '4px !important' }
                ]}
                onClick={() => dispatch(normalApAllFetch())}
              >
                <Typography noWrap sx={{ color: 'inherit' }}>
                  {t('components.cameras.autoAll')}
                </Typography>
              </Button>
            </Stack>
            <ParkingInfo />
          </Stack>
        </AppBar>
      )}

      <Box
        ref={camerasListRef}
        sx={[
          listStyle({ ...theme }),
          {
            backgroundColor: theme.colors.surface.low,
            width: '100%'
          }
        ]}
        onScroll={handleCamerasListScroll}
      >
        <CameraSpacer />
        <HeaderSpacer />
        {isMobile && (
          <>
            <ParkingInfo fullWidth={true} />

            <Stack
              direction={'row'}
              gap={'16px'}
              justifyContent={'space-between'}
              sx={{
                height: '56px',
                width: '100%',
                p: '16px',
                pb: '8px',
                pt: '8px'
              }}
            >
              <Stack
                direction={'row'}
                gap={'16px'}
                width={'100%'}
                minWidth={'260px'}
              >
                <Button
                  disableRipple
                  disabled={accessOptions.disableOpenAP}
                  variant="contained"
                  fullWidth
                  sx={secondaryButtonStyle({ ...theme })}
                  onClick={() => dispatch(openApAllFetch())}
                >
                  <Typography noWrap sx={{ color: 'inherit' }}>
                    {t('components.cameras.openAll')}
                  </Typography>
                </Button>
                <Button
                  disableRipple
                  disabled={accessOptions.disableCloseAP}
                  variant="contained"
                  fullWidth
                  sx={secondaryButtonStyle({ ...theme })}
                  onClick={() => dispatch(closeApAllFetch())}
                >
                  <Typography noWrap sx={{ color: 'inherit' }}>
                    {t('components.cameras.closeAll')}
                  </Typography>
                </Button>
                <Button
                  disableRipple
                  disabled={accessOptions.disableWorkAP}
                  variant="contained"
                  fullWidth
                  sx={secondaryButtonStyle({ ...theme })}
                  onClick={() => dispatch(normalApAllFetch())}
                >
                  <Typography noWrap sx={{ color: 'inherit' }}>
                    {t('components.cameras.autoAll')}
                  </Typography>
                </Button>
              </Stack>
            </Stack>
          </>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: isMobile ? '16px' : 0
          }}
        >
          {_.sortBy(accessPoints, ['id']).map((camera, index) => {
            const oldCameras = cameras.filter((item) => camera.cameras.includes(item.id));
            return (
              <>
                {
                  oldCameras.map((findCamera) => (
                    <>
                      {(findCamera?.is_display === undefined || findCamera?.is_display) && (
                        <CameraManagementItem
                          camera={camera}
                          key={findCamera.id}
                          src={
                            findCamera
                              ?.mjpeg_url
                          }
                          titlesLed={titlesLed}
                          setTitlesLed={setTitlesLed}
                          accessOptions={accessOptions}
                        />
                      )}
                    </>
                  ))
                }

              </>
            )
          }) || (
            <Stack
              justifyContent={'center'}
              alignItems={'center'}
              height={'100%'}
              gap={'16px'}
            >
              <img
                style={{ height: '40px' }}
                src={cameraEmptyIcon}
                alt="нет камер"
              />
              <Typography sx={titleTextStyle}>{t('components.cameras.noCameras')}</Typography>
            </Stack>
          )}
          <OpenApByTimeModal
            show={isOpenApTimeModal}
            handleClose={() => dispatch(changeActiveOpenApTimeModal())}
          />
        </Box>
        <FooterSpacer />
      </Box>
    </>
  );
};

export default Cameras;
