import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import css from './Cameras.module.scss';
import Skeleton from 'react-loading-skeleton';
import { Tooltip } from 'react-tooltip';
import { QuestionCircle } from 'react-bootstrap-icons';
import ReactDOMServer from 'react-dom/server';
import cn from 'classnames';
import _ from 'lodash';
// Store
import {
  closeApAllFetch,
  openApAllFetch,
  getStatusesAccessPointsFetch
} from 'store/events/eventsSlice';
import {
  changeActiveOpenApModal,
  changeActiveOpenApTimeModal
} from 'store/cameras/camerasSlice';
// Components
import OpenApByVehiclePlateModal from 'components/Modals/OpenApByVehiclePlateModal';
import Camera from 'components/Camera';
import OpenApByTimeModal from 'components/Modals/OpenApByTimeModal';
import { camerasFetch } from '../../store/cameras/camerasSlice';
import { Formik } from 'formik';
import {
  clearLedBoardMessage,
  postLedBoardMessage
} from '../../api/access-points';
import { useSnackbar } from 'notistack';
import {
  ArrowLeftSquareFill,
  ArrowRightSquareFill
} from 'react-bootstrap-icons';
import { useParkingInfoQuery } from '../../api/settings/settings';
import { Box, Button, Stack } from '@mui/material';
import React from 'react';
import {
  listStyle,
  positiveButtonStyle,
  secondaryButtonStyle
} from '../../theme/styles';
import { colors } from '../../theme/colors';
import ParkingInfo from '../ParkingInfo/ParkingInfo';
import CameraManagementItem from '../CameraManagementItem/CameraManagementItem';
import HeaderSpacer from '../Header/HeaderSpacer';
import FooterSpacer from '../Header/FooterSpacer';

const Cameras = () => {
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
  const isMobile = window.orientation > 1;

  useEffect(() => {
    dispatch(camerasFetch());
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    }
    wsLedMessages.current = new WebSocket(
      address + `/wsLedMessages/?parkingID=${parkingData.parkingID}`
    );

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
      dispatch(getStatusesAccessPointsFetch());
    }
  }, [isFetched, dispatch, isChangedStatus]);

  return (
    <Box
      sx={[
        listStyle,
        {
          backgroundColor: colors.surface.low,
          width: '100%'
        }
      ]}
    >
      <HeaderSpacer />
      {isMobile && (
        <Box sx={{ height: '86px', p: '16px', pb: '8px' }}>
          <ParkingInfo />
        </Box>
      )}
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
        <Stack direction={'row'} gap={'16px'} width={'100%'} minWidth={'260px'}>
          <Button
            disableRipple
            variant="contained"
            fullWidth={isMobile ? true : false}
            sx={secondaryButtonStyle}
            onClick={() => dispatch(openApAllFetch())}
          >
            Открыть все
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth={isMobile ? true : false}
            sx={secondaryButtonStyle}
            onClick={() => dispatch(closeApAllFetch())}
          >
            Закрыть все
          </Button>
        </Stack>
        {!isMobile && <ParkingInfo />}
      </Stack>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: isMobile ? '16px' : 0
        }}
      >
        {_.sortBy(accessPoints, ['id']).map((camera, index) => (
          <>
            <CameraManagementItem
              camera={camera}
              key={camera.id}
              src={
                cameras.find((item) => item.id === camera.cameras[0])?.mjpeg_url
              }
              titlesLed={titlesLed}
              setTitlesLed={setTitlesLed}
            />
          </>
        ))}
        <OpenApByTimeModal
          show={isOpenApTimeModal}
          handleClose={() => dispatch(changeActiveOpenApTimeModal())}
        />
      </Box>
      <FooterSpacer />
    </Box>
  );
};

export default Cameras;
