import Layout from '../../components/Layout';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useParkingInfoQuery } from '../../api/settings/settings';
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import soundNotification from '../EventsPage/notofication.mp3';
import { useDispatch } from 'react-redux';
import { putEvent, changeDataModal } from 'store/events/eventsSlice';
import { setParkingUserType } from '../../store/parkingInfo/parkingInfo';
import { getUserData } from '../../api/auth/login';
import React from 'react';

export const Home = () => {
  const { data: parkingData, error: parkingInfoError } = useParkingInfoQuery();
  const dispatch = useDispatch();
  const [isError, setIsError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const ws = useRef(null);
  let location = useLocation();
  let navigate = useNavigate();

  let fourNumbersInRow = useRef([]);

  useEffect(() => {
    getUserData().catch((e) => {
      console.log(e);
      enqueueSnackbar('Ошибка подключения');
    });
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      navigate(parkingData?.userType === 'renter' ? 'events-logs' : 'events', {
        replace: true
      });
    }
  }, [location]);

  if (parkingInfoError) {
    enqueueSnackbar('Ошибка подключения', { variant: 'error' });
  }

  useEffect(() => {
    let typeWS = process.env.REACT_APP_API_URL.toString().split('/');
    let address = process.env.REACT_APP_API_URL;

    if (typeWS[0] === 'https:') {
      address = address.replace('https:', 'wss:');
    } else {
      address = address.replace('http:', 'ws:');
    }

    if (parkingData && !ws.current) {
      dispatch(setParkingUserType(parkingData.userType));
      ws.current = new WebSocket(
        address + `/wsEvents?parkingID=${parkingData.parkingID}`
      );

      ws.current.onopen = () => {
        setIsError(false);
      };

      ws.current.onmessage = (event) => {
        let data = JSON.parse(event.data);
        let vehicle_plate =
          data.vehicle_plate.number + data.vehicle_plate?.region;

        if (localStorage.getItem('notificationsSound') === 'true') {
          if (
            fourNumbersInRow.current.length === 0 ||
            fourNumbersInRow.current[fourNumbersInRow.current.length - 1] ===
              vehicle_plate
          ) {
            if (fourNumbersInRow.current.length >= 3) {
              new Audio(soundNotification).play();
            } else {
              fourNumbersInRow.current = [
                ...fourNumbersInRow.current,
                vehicle_plate
              ];
            }
          } else {
            fourNumbersInRow.current = [vehicle_plate];
          }
        }

        if (data.message !== 'PING') {
          dispatch(putEvent(data));
          dispatch(changeDataModal(data));
        }
      };

      ws.current.onerror = () => {
        setIsError(true);
      };
    }
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [parkingData]);

  return (
    <>
      {parkingData && (
        <Layout userType={parkingData.userType}>
          <Outlet />
        </Layout>
      )}
    </>
  );
};