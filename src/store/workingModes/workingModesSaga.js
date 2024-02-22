import { call, put, select, takeEvery } from 'redux-saga/effects'
import {
  createWorkingModeRequest,
  deleteWorkingModeRequest,
  getWorkingModesRequest,
  updateWorkingModeRequest,
} from 'api/working-modes'
import {
  createModalHandler,
  workingModesFetch,
  editWorkingModeFetch,
  createWorkingModeFetch,
  deleteWorkingModeFetch,
  getWorkingModesSuccess,
  getWorkingModesError,
  editModalClose,
} from './workingModesSlice'

function* workWorkingModes() {
  try {
    const { data } = yield call(getWorkingModesRequest)
    yield put(getWorkingModesSuccess(data))
  } catch (e) {
    yield put(getWorkingModesError())
  }
}

function* workEditWorkingMode({ payload }) {
  try {
    const workingModeEdit = yield select(
      (state) => state.workingModes.workingModeEdit
    )
    payload.id = workingModeEdit.id
    yield call(updateWorkingModeRequest, payload)
    const { data } = yield call(getWorkingModesRequest)
    yield put(getWorkingModesSuccess(data))
    yield put(editModalClose())
  } catch (e) {}
}

function* workCreateWorkingMode({ payload }) {
  try {
    yield call(createWorkingModeRequest, payload)
    const { data } = yield call(getWorkingModesRequest)
    yield put(getWorkingModesSuccess(data))
    yield put(createModalHandler())
  } catch (e) {}
}

function* workDeleteWorkingMode({ payload }) {
  try {
    yield call(deleteWorkingModeRequest, payload)
    const workingModes = yield select(
      (state) => state.workingModes.workingModes
    )
    const workingModesArr = [...workingModes].filter(
      (item) => item.id !== payload
    )
    yield put(getWorkingModesSuccess(workingModesArr))
  } catch (e) {}
}

export default function* workingModesSagaWatcher() {
  yield takeEvery(workingModesFetch.type, workWorkingModes)
  yield takeEvery(editWorkingModeFetch.type, workEditWorkingMode)
  yield takeEvery(createWorkingModeFetch.type, workCreateWorkingMode)
  yield takeEvery(deleteWorkingModeFetch.type, workDeleteWorkingMode)
}
