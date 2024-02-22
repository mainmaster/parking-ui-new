import { call, put, select, takeEvery } from 'redux-saga/effects'
import {
  createLedRequest,
  deleteLedRequest,
  getLedsRequest,
  updateLedRequest,
} from 'api/led'
import {
  createLedFetch,
  deleteLedFetch,
  editLedFetch,
  ledsFetch,
  createModalHandler,
  editModalHandler,
  getLedsSuccess,
  getLedsError,
} from './ledSlice'

function* workLeds() {
  try {
    const { data } = yield call(getLedsRequest)
    yield put(getLedsSuccess(data))
  } catch (e) {
    yield put(getLedsError())
  }
}

function* workEditLed({ payload }) {
  try {
    const ledEdit = yield select((state) => state.leds.ledEdit)
    payload.id = ledEdit.id
    yield call(updateLedRequest, payload)
    const { data } = yield call(getLedsRequest)
    yield put(getLedsSuccess(data))
    yield put(editModalHandler())
  } catch (e) {}
}

function* workCreateLed({ payload }) {
  try {
    yield call(createLedRequest, payload)
    const { data } = yield call(getLedsRequest)
    yield put(getLedsSuccess(data))
    yield put(createModalHandler())
  } catch (e) {}
}

function* workDeleteLed({ payload }) {
  try {
    yield call(deleteLedRequest, payload)
    const leds = yield select((state) => state.leds.leds)
    const ledsArr = [...leds].filter((item) => item.id !== payload)
    yield put(getLedsSuccess(ledsArr))
  } catch (e) {}
}

export default function* ledsSagaWatcher() {
  yield takeEvery(ledsFetch.type, workLeds)
  yield takeEvery(editLedFetch.type, workEditLed)
  yield takeEvery(createLedFetch.type, workCreateLed)
  yield takeEvery(deleteLedFetch.type, workDeleteLed)
}
