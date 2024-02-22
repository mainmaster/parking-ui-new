import { call, put, takeEvery } from 'redux-saga/effects'

import { getPageNum } from 'utils'
import {store} from "../../store/index";
import { changeCurrentPage, changePages, getSearchLogsError, getSearchLogsSuccess, searchLogsChangePageFetch, searchLogsFetch } from './searchLogs.slice';
import { getSearchLogsRequest } from './searchLogs.api';

function* workSearchLogs({ payload }) {
  try {
    const { data } = yield call(getSearchLogsRequest, {
      offset: 0,
      ...payload,
    })
    const applications = data
    yield put(getSearchLogsSuccess(applications))
    yield put(changePages(data.count))

  } catch (e) {
    yield put(getSearchLogsError())
  }
}

function* workSearchLogsPage({ payload }) {
  try {
    const { data } = yield call(getSearchLogsRequest, {
      offset: getPageNum(payload) * 5,
      ...store.getState().searchLogs.filters
    })
    yield put(getSearchLogsSuccess(data))
    yield put(changePages(data.count))
    yield put(changeCurrentPage(payload))
  } catch (e) {
    yield put(getSearchLogsError())
  }
}

export default function* searchLogsSagaWatcher() {
  yield takeEvery(searchLogsFetch.type, workSearchLogs)
  yield takeEvery(searchLogsChangePageFetch.type, workSearchLogsPage)
}