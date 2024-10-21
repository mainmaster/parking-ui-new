import { all } from 'redux-saga/effects'
// Watchers
import camerasSagaWatcher from './cameras/camerasSaga'
import controllersSagaWatcher from './controllers/controllersSaga'
import workingModesSagaWatcher from './workingModes/workingModesSaga'
import accessPointsSagaWatcher from './accessPoints/accessPointsSaga'
import eventsSagaWatcher from './events/eventsSaga'
import sessionsSagaWatcher from './sessions/sessionsSaga'
import carParkSagaWatcher from './carPark/carParkSaga'
import blackListSagaWatcher from './blackList/blackListSaga'
import ledsSagaWatcher from './led/ledSaga'
import paymentsSagaWatcher from './payments/paymentsSaga'
import applicationsSagaWatcher from './applications/applicationSaga'
import searchLogsSagaWatcher from '../pages/SearchLogs/searchLogs.saga'
import reportsSagaWatcher from "./reports/reportsSaga";

export function* rootWatcher() {
  yield all([
    camerasSagaWatcher(),
    controllersSagaWatcher(),
    workingModesSagaWatcher(),
    accessPointsSagaWatcher(),
    eventsSagaWatcher(),
    sessionsSagaWatcher(),
    applicationsSagaWatcher(),
    carParkSagaWatcher(),
    blackListSagaWatcher(),
    ledsSagaWatcher(),
    paymentsSagaWatcher(),
    searchLogsSagaWatcher(),
    reportsSagaWatcher(),
  ])
}
