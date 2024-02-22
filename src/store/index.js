import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
// Api
import { apiSlice } from 'api/apiSlice'
import { settingSlice } from 'api/settings/settings'
import { paymentsApi } from "api/payments.api";
import {terminalsApi} from "api/terminal/terminal.api";
import {rentersApi} from "api/renters/renters.api";
// Saga
import { rootWatcher } from './saga'
// Reducers
import camerasSlice from './cameras/camerasSlice'
import controllersSlice from './controllers/controllersSlice'
import workingModesSlice from './workingModes/workingModesSlice'
import accessPointsSlice from './accessPoints/accessPointsSlice'
import eventsSlice from './events/eventsSlice'
import sessionsSlice from './sessions/sessionsSlice'
import carParkSlice from './carPark/carParkSlice'
import blackListSlice from './blackList/blackListSlice'
import ledSlice from './led/ledSlice'
import paymentsSlice from './payments/paymentsSlice'
import parkingInfo from "./parkingInfo/parkingInfo";
import applicationSlice from './applications/applicationSlice';
import rentersSlice from './renters/rentersSlice';
import searchLogsSlice from '../pages/SearchLogs/searchLogs.slice';

const saga = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [settingSlice.reducerPath]: settingSlice.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [terminalsApi.reducerPath]: terminalsApi.reducer,
    [rentersApi.reducerPath]: rentersApi.reducer,
    cameras: camerasSlice,
    renters: rentersSlice,
    searchLogs: searchLogsSlice,
    controllers: controllersSlice,
    workingModes: workingModesSlice,
    accessPoints: accessPointsSlice,
    applications: applicationSlice,
    events: eventsSlice,
    sessions: sessionsSlice,
    carPark: carParkSlice,
    blackList: blackListSlice,
    leds: ledSlice,
    payments: paymentsSlice,
    parkingInfo: parkingInfo
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      immutableCheck: true,
      serializableCheck: true,
      thunk: true,
    }),
      apiSlice.middleware,
      settingSlice.middleware,
      paymentsApi.middleware,
      terminalsApi.middleware,
      rentersApi.middleware,
      saga,
  ],
})

saga.run(rootWatcher)
