import { call, put, select, takeEvery } from 'redux-saga/effects'
import {
  createControllerRequest,
  deleteControllerRequest,
  updateControllerRequest,
  getControllersRequest,
} from 'api/controllers'
import {
  controllersFetch,
  getControllersError,
  getControllersSuccess,
  createModalHandler,
  editModalHandler,
  editControllerFetch,
  createControllerFetch,
  deleteControllerFetch,
} from './controllersSlice'

function* workControllers() {
  try {
    const { data } = yield call(getControllersRequest)
    yield put(getControllersSuccess(data))
  } catch (e) {
    yield put(getControllersError())
  }
}

function* workEditController({ payload }) {
  try {
    const controllerEdit = yield select(
      (state) => state.controllers.controllerEdit
    )
    payload.id = controllerEdit.id
    yield call(updateControllerRequest, payload)
    const { data } = yield call(getControllersRequest)
    yield put(getControllersSuccess(data))
    yield put(editModalHandler())
  } catch (e) {}
}

function* workCreateController({ payload }) {
  try {
    yield call(createControllerRequest, payload)
    const { data } = yield call(getControllersRequest)
    yield put(getControllersSuccess(data))
    yield put(createModalHandler())
  } catch (e) {}
}

function* workDeleteController({ payload }) {
  try {
    yield call(deleteControllerRequest, payload)
    const controllers = yield select((state) => state.controllers.controllers)
    const controllersArr = [...controllers].filter(
      (item) => item.id !== payload
    )
    yield put(getControllersSuccess(controllersArr))
  } catch (e) {}
}

export default function* controllersSagaWatcher() {
  yield takeEvery(controllersFetch.type, workControllers)
  yield takeEvery(editControllerFetch.type, workEditController)
  yield takeEvery(createControllerFetch.type, workCreateController)
  yield takeEvery(deleteControllerFetch.type, workDeleteController)
}
