import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Routes,
  Route
} from 'react-router-dom';
// Pages
import ClientPaymentPage from 'pages/ClientPaymentPage';
import SuccessPaymentPage from 'pages/SuccessPaymentPage';
import LoginPage from 'pages/LoginPage/LoginPage';
import { Home } from 'pages/Home/Home';
import EventsPage from 'pages/EventsPage';
import SessionsPage from 'pages/SessionsPage';
import PaymentsPage from 'pages/PaymentsPage';
import CarParkPage from 'pages/CarParkPage';
import BlackListPage from 'pages/BlackListPage';
import AccessPointsPage from 'pages/AccessPointsPage';
import WorkingModesPage from 'pages/WorkingModesPage';
import CamerasPage from 'pages/CamerasPage';
import ControllersPage from 'pages/ControllersPage';
import LedPage from 'pages/LedPage';
import Settings from 'pages/Settings/Settings';
import { Applications } from 'pages/Applications/Applications';
import { Renters } from 'pages/Renters/Renters';
import { Operators } from 'pages/Operators/Operators';
import { Terminals } from 'pages/Terminals/Terminals';
import { EventPage } from 'pages/EventsPage/EventPage';
import { SessionPage } from 'pages/SessionsPage/SessionPage';
import { PaymentPage } from 'pages/PaymentsPage/PaymentPage';
import { SearchLogsPage } from 'pages/SearchLogs/SearchLogs';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<ClientPaymentPage />} path="/clientPayment" />
      <Route element={<SuccessPaymentPage />} path="/successPayment" />
      <Route element={<LoginPage />} path="/login" />
      <Route index element={<Home />} />
      <Route element={<Home />}>
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
      </Route>
    </>
  )
);

export default function Router() {
  return <RouterProvider router={router} />;
}

// const Root = () => (
//   <Routes>
//     <Route index element={<Home />} />
//     <Route element={<ClientPaymentPage />} path="/clientPayment" />
//     <Route element={<SuccessPaymentPage />} path="/successPayment" />
//     <Route element={<LoginPage />} path="/login" />
//     <Route path="*" element={<Home />} />
//   </Routes>
// );
