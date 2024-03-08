import Layout from '../../components/Layout';
import { Tabs, Tab } from 'react-bootstrap';
import EventsPage from '../EventsPage';
import SessionsPage from '../SessionsPage';
import PaymentsPage from '../PaymentsPage';
import CarParkPage from '../CarParkPage';
import BlackListPage from '../BlackListPage';
import AccessPointsPage from '../AccessPointsPage';
import WorkingModesPage from '../WorkingModesPage';
import CamerasPage from '../CamerasPage';
import ControllersPage from '../ControllersPage';
import LedPage from '../LedPage';
import Settings from '../Settings/Settings';
import { Operators } from '../Operators/Operators';
import { Terminals } from '../Terminals/Terminals';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';
import { Renters } from '../Renters/Renters';
import { adminRoutes, operatorRoutes, renterRoutes } from '../../router/routes';
import { useParkingInfoQuery } from '../../api/settings/settings';
import { Applications } from '../Applications/Applications';
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import soundNotification from '../EventsPage/notofication.mp3';
import { useDispatch } from 'react-redux';
import {
  eventsFetch,
  putEvent,
  changeDataModal
} from 'store/events/eventsSlice';
import { getUserData } from '../../api/auth/login';
import { toast } from 'react-toastify';
import { CarNumberCard } from '../../components/CarNumberCard/CarNumberCard';
import { EventPage } from '../EventsPage/EventPage';
import { SessionPage } from '../SessionsPage/SessionPage';
import { PaymentPage } from '../PaymentsPage/PaymentPage';
import { SearchLogsPage } from '../SearchLogs/SearchLogs';
import React from 'react';

export const Home = () => {
  const { data: parkingData, error: parkingInfoError } = useParkingInfoQuery();
  const dispatch = useDispatch();
  const [isError, setIsError] = useState(false);
  const [countToasts, setCountToasts] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const navigation = useNavigate();
  const location = useLocation();
  const ws = useRef(null);

  let fourNumbersInRow = useRef([]);

  useEffect(() => {
    getUserData().catch((e) => {
      console.log(e);
      enqueueSnackbar('Ошибка подключения');
    });
  }, []);

  if (parkingInfoError) {
    enqueueSnackbar('Ошибка подключения', { variant: 'error' });
  }

  // window.addEventListener("focus", () => {
  //     toast.clearWaitingQueue();
  // });

  useEffect(() => {
    let typeWS = process.env.REACT_APP_API_URL.toString().split('/');
    let address = process.env.REACT_APP_API_URL;

    if (typeWS[0] === 'https:') {
      address = address.replace('https:', 'wss:');
    } else {
      address = address.replace('http:', 'ws:');
    }

    if (parkingData) {
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

        // setCountToasts((prevState) => {
        //   if (prevState >= 2) {
        //     toast.dismiss();
        //     toast.clearWaitingQueue();
        //     return 1;
        //   } else {
        //     console.log(prevState + 1);
        //     return prevState + 1;
        //   }
        // });
        // toast.success(
        //   <div>
        //     {data.vehicle_plate.number === '' ? null : (
        //       <CarNumberCard carNumber={data.vehicle_plate} isTable />
        //     )}

        //     <span>{data.access_point_description}</span>
        //     <br />
        //     <span>{data.description}</span>
        //   </div>,
        //   {
        //     position: toast.POSITION.TOP_RIGHT,
        //     containerId: 'eventsVehicle',
        //     icon: false
        //   }
        // );
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
  }, [parkingData]);

  return (
    <>
      {parkingData && (
        <Layout userType={parkingData.userType}>
          {/* {parkingData?.userType === 'admin' && (
            <Tabs defaultActiveKey={location.pathname}>
              {adminRoutes.map(({ eventKey, title }) => {
                return (
                  <Tab
                    onEnter={() => navigation(eventKey)}
                    eventKey={eventKey}
                    title={title}
                  ></Tab>
                );
              })}
            </Tabs>
          )}
          {parkingData?.userType === 'operator' && (
            <Tabs defaultActiveKey={location.pathname}>
              {operatorRoutes.map(({ eventKey, title }) => {
                return (
                  <Tab
                    onEnter={() => navigation(eventKey)}
                    eventKey={eventKey}
                    title={title}
                  ></Tab>
                );
              })}
            </Tabs>
          )}
          {parkingData?.userType === 'renter' && (
            <Tabs defaultActiveKey={location.pathname}>
              {renterRoutes.map(({ eventKey, title }) => {
                return (
                  <Tab
                    onEnter={() => navigation(eventKey)}
                    eventKey={eventKey}
                    title={title}
                  ></Tab>
                );
              })}
            </Tabs>
          )} */}
          <Routes>
            <Route
              path="/"
              element={
                <Navigate
                  to={
                    parkingData?.userType === 'renter'
                      ? 'events-logs'
                      : 'events'
                  }
                  replace
                />
              }
            />
            <Route path="events-logs" element={<EventsPage onlyLog />} />

            <Route path="events">
              <Route path="" element={<EventsPage onlyLog={false} />} />
              <Route path=":id" element={<EventPage />} />
            </Route>

            <Route path="sessions">
              <Route path="" element={<SessionsPage />} />
              <Route path=":id" element={<SessionPage />} />
            </Route>

            <Route path="payments">
              <Route path="" element={<PaymentsPage />} />
              <Route path=":id" element={<PaymentPage />} />
            </Route>

            <Route path="renters" element={<Renters />} />
            <Route path="requests" element={<Applications />} />
            <Route path="auto-park/*" element={<CarParkPage />} />
            <Route path="black-list/*" element={<BlackListPage />} />
            <Route path="access-points" element={<AccessPointsPage />} />
            <Route path="working-modes" element={<WorkingModesPage />} />
            <Route path="cameras" element={<CamerasPage />} />
            <Route path="controllers" element={<ControllersPage />} />
            <Route path="led" element={<LedPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="operator" element={<Operators />} />
            <Route path="terminals" element={<Terminals />} />
            <Route path="search-logs" element={<SearchLogsPage />} />
          </Routes>
        </Layout>
      )}
    </>
  );
};
