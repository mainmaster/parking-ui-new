import { call, put, select, takeEvery } from 'redux-saga/effects';
import {
  getCamerasRequest,
  createCameraRequest,
  deleteCameraRequest,
  updateCameraRequest
} from 'api/cameras';
import {
  camerasFetch,
  getCamerasError,
  getCamerasSuccess,
  editCameraFetch,
  createCameraFetch,
  deleteCameraFetch,
  createModalHandler,
  editModalHandler
} from './camerasSlice';

function* workCameras() {
  try {
    const { data } = yield call(getCamerasRequest);
    yield put(getCamerasSuccess(data));
  } catch (e) {
    yield put(getCamerasError());
  }
}

function* workEditCamera({ payload }) {
  try {
    const cameraEdit = yield select((state) => state.cameras.cameraEdit);
    payload.id = cameraEdit.id;
    yield call(updateCameraRequest, payload);
    const { data } = yield call(getCamerasRequest);
    yield put(getCamerasSuccess(data));
    yield put(editModalHandler());
  } catch (e) {}
}

function* workCreateCamera({ payload }) {
  try {
    yield call(createCameraRequest, payload);
    const { data } = yield call(getCamerasRequest);
    yield put(getCamerasSuccess(data));
    yield put(createModalHandler());
  } catch (e) {}
}

function* workDeleteCamera({ payload }) {
  try {
    yield call(deleteCameraRequest, payload);
    const cameras = yield select((state) => state.cameras.cameras);
    const camerasArr = [...cameras].filter((item) => item.id !== payload);
    yield put(getCamerasSuccess(camerasArr));
  } catch (e) {}
}

export default function* camerasSagaWatcher() {
  yield takeEvery(camerasFetch.type, workCameras);
  yield takeEvery(editCameraFetch.type, workEditCamera);
  yield takeEvery(createCameraFetch.type, workCreateCamera);
  yield takeEvery(deleteCameraFetch.type, workDeleteCamera);
}
