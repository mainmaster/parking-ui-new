import { call, put, select, takeEvery } from 'redux-saga/effects'
import {
  createAccessPointRequest,
  deleteAccessPointRequest,
  getAccessPointsRequest,
  updateAccessPointRequest,
} from 'api/access-points'
import { getControllersRequest } from 'api/controllers'
import { getCamerasRequest } from 'api/cameras'
import { getWorkingModesRequest } from 'api/working-modes'
import { getLedsRequest } from 'api/led'
import {
  createModalHandler,
  editModalHandler,
  accessPointsFetch,
  editAccessPointFetch,
  createAccessPointFetch,
  deleteAccessPointFetch,
  getAccessPointsSuccess,
  getAccessPointsError,
  accessPointsCamerasFetch,
} from './accessPointsSlice'
import { getCamerasSuccess } from '../cameras/camerasSlice'
import { getControllersSuccess } from '../controllers/controllersSlice'
import { getWorkingModesSuccess } from '../workingModes/workingModesSlice'
import { getLedsSuccess } from '../led/ledSlice'

function* workAccessPoints() {
  try {
    const { data } = yield call(getAccessPointsRequest)
    const responseCameras = yield call(getCamerasRequest)
    const responseControllers = yield call(getControllersRequest)
    const responseWorkingModes = yield call(getWorkingModesRequest)
    const responseLeds = yield call(getLedsRequest)
    yield put(getWorkingModesSuccess(responseWorkingModes.data))
    yield put(getCamerasSuccess(responseCameras.data))
    yield put(getControllersSuccess(responseControllers.data))
    yield put(getAccessPointsSuccess(data))
    yield put(getLedsSuccess(responseLeds.data))
  } catch (e) {
    yield put(getAccessPointsError())
  }
}

function* workAccessPointsCameras() {
  try {
    const { data } = yield call(getAccessPointsRequest)
    yield put(getAccessPointsSuccess(data))
  } catch (e) {}
}

function* workEditAccessPoint({ payload }) {
  try {
    const accessPointEdit = yield select(
      (state) => state.accessPoints.accessPointEdit
    )
    payload.id = accessPointEdit.id
    yield call(updateAccessPointRequest, payload)
    const { data } = yield call(getAccessPointsRequest)
    yield put(getAccessPointsSuccess(data))
    yield put(editModalHandler())
  } catch (e) {}
}

function* workCreateAccessPoint({ payload }) {
  try {
    yield call(createAccessPointRequest, payload)
    const { data } = yield call(getAccessPointsRequest)
    yield put(getAccessPointsSuccess(data))
    yield put(createModalHandler())
  } catch (e) {}
}

function* workDeleteAccessPoint({ payload }) {
  try {
    yield call(deleteAccessPointRequest, payload)
    const accessPoints = yield select(
      (state) => state.accessPoints.accessPoints
    )
    const accessPointsArr = [...accessPoints].filter(
      (item) => item.id !== payload
    )
    yield put(getAccessPointsSuccess(accessPointsArr))
  } catch (e) {}
}

export default function* accessPointsSagaWatcher() {
  yield takeEvery(accessPointsFetch.type, workAccessPoints)
  yield takeEvery(editAccessPointFetch.type, workEditAccessPoint)
  yield takeEvery(createAccessPointFetch.type, workCreateAccessPoint)
  yield takeEvery(deleteAccessPointFetch.type, workDeleteAccessPoint)
  yield takeEvery(accessPointsCamerasFetch.type, workAccessPointsCameras)
}
