import Layout from '../../components/Layout';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useParkingInfoQuery } from '../../api/settings/settings';
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import soundNotification from '../EventsPage/notofication.mp3';
import {useDispatch, useSelector} from 'react-redux';
import { putEvent, changeDataModal } from 'store/events/eventsSlice';
import {
  setParkingUserType,
  setOperator,
  setUsername,
  setIsNeedFetch
} from '../../store/parkingInfo/parkingInfo';
import { getUserData } from '../../api/auth/login';
import { operatorAccessOptions } from '../../constants';
import React from 'react';
import {getStatusesAccessPointsFetch} from "../../store/events/eventsSlice";
import {useTranslation} from "react-i18next";

export const Home = () => {
  const userType = useSelector((state) => state?.parkingInfo?.userType);
  const { data: parkingData, error: parkingInfoError } = useParkingInfoQuery();
  const { t, i18n } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [disableEvents, setDisableEvents] = useState(false);
  const dispatch = useDispatch();
  const [isError, setIsError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const ws = useRef(null);
  let location = useLocation();
  let navigate = useNavigate();

  let fourNumbersInRow = useRef([]);

  useEffect(() => {
    if (!userType) {
      return;
    }

    getUserData()
      .then((res) => {
        setUserData(res.data);
        if (res.data?.username) {
          dispatch(setUsername(res.data.username));
        } else {
          dispatch(setUsername(''));
        }
      })
      .catch((e) => {
        console.log(e);
        enqueueSnackbar('Ошибка подключения');
      });
  }, [userType]);

  useEffect(() => {
    if (parkingData) {
      dispatch(setParkingUserType(parkingData.userType));
      if (userData && parkingData?.userType === 'operator') {
        if (userData.operator) {
          dispatch(setOperator(userData.operator));
        } else {
          dispatch(setOperator({}));
        }
        const eventsOption = operatorAccessOptions.find(
          (option) => option.route === '/events'
        );
        if (
          userData.operator &&
          eventsOption.value in userData.operator &&
          userData.operator[eventsOption] === true
        ) {
          setDisableEvents(false);
        } else {
          setDisableEvents(true);
        }
      }
    }
  }, [userData, parkingData]);

  useEffect(() => {
    if (location.pathname === '/' && parkingData) {
      navigate(parkingData?.userType === 'renter' ? 'events-logs' : 'events', {
        replace: true
      });
    }
  }, [location, parkingData]);

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

    if (
      parkingData &&
      !ws.current &&
      parkingData?.userType !== 'renter' &&
      !(parkingData?.userType === 'operator' && disableEvents)
    ) {
      ws.current = new WebSocket(
        address + `/wsEvents?parkingID=${parkingData.parkingID}&lang=${i18n.language}`
      );

      ws.current.onopen = () => {
        setIsError(false);
      };

      ws.current.onmessage = (event) => {
        let data = JSON.parse(event.data);

        switch (data?.event_code) {
          case 1007:
            dispatch(getStatusesAccessPointsFetch());
            break;
          case 1014:
          case 1015:
          case 1016:
          case 1017:
          case 1018:
          case 1019:
            dispatch(setIsNeedFetch(true))
            break;
          default:
            break;
        }

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
        ws.current = null;
      }
    };
  }, [parkingData, i18n.language]);

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
