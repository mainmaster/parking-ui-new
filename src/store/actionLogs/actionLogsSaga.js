import { call, put, takeEvery } from 'redux-saga/effects';
import {
  changePages,
  changeCurrentPage,
  getActionLogsSuccess,
  getActionLogsError,
  actionLogsFetch,
  actionLogsChangePageFetch, actionLogSelectFetch, getActionLogSelectSuccess, getActionLogSelectError
} from './actionLogsSlice';
import { ACTION_LOGS_ON_PAGE } from '../../constants';
import { getPageNum } from '../../utils';
import { getActionLog, getActionLogs } from '../../api/action-logs.api';

function* workActionLogs({ payload }) {
  try {
    console.log(payload);
    const { data } = yield call(getActionLogs, {
      offset: 0,
      limit: ACTION_LOGS_ON_PAGE,
      ...payload
    });

    yield put(changePages(data.count));
    yield put(getActionLogsSuccess(data.logs));
  } catch (e) {
    yield put(getActionLogsError());
  }
}

function* workActionLogsPage({ payload }) {
  try {
    console.log({payload});
    const { data } = yield call(getActionLogs, {
      offset: (getPageNum(payload.num) * ACTION_LOGS_ON_PAGE) / 10,
      limit: ACTION_LOGS_ON_PAGE,
      data: payload.data,
      id: payload.id
    });
    yield put(getActionLogsSuccess(data.logs));
    yield put(changePages(data.count));
    yield put(changeCurrentPage(payload));
  } catch (e) {
    yield put(getActionLogsError());
  }
}

function* workSelectActionLog({ payload }) {
  try {
    const { data } = yield call(getActionLog, payload);
    yield put(getActionLogSelectSuccess(data));
  } catch (e) {
    yield put(getActionLogSelectError());
  }
}

export default function* actionLogsSagaWatcher() {
  yield takeEvery(actionLogsFetch.type, workActionLogs);
  yield takeEvery(actionLogsChangePageFetch.type, workActionLogsPage);
  yield takeEvery(actionLogSelectFetch.type, workSelectActionLog);
}
