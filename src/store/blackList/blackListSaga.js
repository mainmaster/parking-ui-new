import { call, put, select, takeEvery } from 'redux-saga/effects'
import {
  createModalHandler,
  editModalHandler,
  getBlackListSuccess,
  getBlackListError,
  blackListFetch,
  editBlackListFetch,
  createBlackListFetch,
  deleteBlackListFetch,
  changeCurrentPage,
  changePages,
  blackListChangePageFetch
} from './blackListSlice'
import {
  createBlackListRequest,
  deleteBlackListRequest,
  getBlackListRequest,
  updateBlackListRequest,
} from 'api/black-list'

import { getPageNum } from 'utils'
import {store} from "../index";

function* workBlackList({payload}) {
  try {
    const { data } = yield call(getBlackListRequest, {
      offset: 0,
      status: document.location.href.split('/')[document.location.href.split('/').length - 1],
      ...payload,
    })
    yield put(changePages(data.count))
    yield put(getBlackListSuccess(data))
  } catch (e) {
    yield put(getBlackListError())
  }
}

function* workBlackListPage({ payload }) {
  try {
    const { data } = yield call(getBlackListRequest, {
      offset: getPageNum(payload) * 5,
      status: document.location.href.split('/')[document.location.href.split('/').length - 1],
      ...store.getState().carPark.filters
    })
    yield put(getBlackListSuccess(data))
    yield put(changePages(data.count))
    yield put(changeCurrentPage(payload))
  } catch (e) {
    yield put(getBlackListError())
  }
}

function* workEditBlackList({ payload }) {
  try {
    const blackListEdit = yield select((state) => state.blackList.blackListEdit)
    payload.id = blackListEdit.id
    yield call(updateBlackListRequest, payload)
    const { data } = yield call(getBlackListRequest, {
      offset: 0,
      status: document.location.href.split('/')[document.location.href.split('/').length - 1],
      ...store.getState().carPark.filters
    })
    yield put(getBlackListSuccess(data))
    yield put(editModalHandler())
  } catch (e) {}
}

function* workCreateBlackList({ payload }) {
  try {
    yield call(createBlackListRequest, payload)
    const { data } = yield call(getBlackListRequest, {
      offset: 0,
      status: document.location.href.split('/')[document.location.href.split('/').length - 1],
      ...store.getState().carPark.filters
    })
    yield put(getBlackListSuccess(data))
    yield put(createModalHandler())
  } catch (e) {}
}

function* workDeleteBlackList({ payload }) {
  try {
    yield call(deleteBlackListRequest, payload.id)
    const { data } = yield call(getBlackListRequest, {
      offset: 0,
      status: document.location.href.split('/')[document.location.href.split('/').length - 1],
      ...store.getState().carPark.filters
    })
    yield put(getBlackListSuccess(data))
    
  } catch (e) {}
}

export default function* blackListSagaWatcher() {
  yield takeEvery(blackListFetch.type, workBlackList)
  yield takeEvery(blackListChangePageFetch.type, workBlackListPage)
  yield takeEvery(editBlackListFetch.type, workEditBlackList)
  yield takeEvery(createBlackListFetch.type, workCreateBlackList)
  yield takeEvery(deleteBlackListFetch.type, workDeleteBlackList)
}
