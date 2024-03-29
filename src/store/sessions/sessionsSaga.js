import { call, put, select, takeEvery } from 'redux-saga/effects';
import {
  changePages,
  changeCurrentPage,
  getSessionsSuccess,
  sessionsFetch,
  sessionsChangePageFetch,
  getSessionsError,
  changeDataModal,
  paidSessionFetch,
  statusSessionFetch,
  closeOlderThanDateSessionsFetch,
  setSelectSession,
  statusSessionSelectFetch,
  sessionSelectFetch,
  paidSessionSelectFetch,
  getSessionSelectSuccess,
  getSessionSelectError
} from './sessionsSlice';
import { getPageNum } from 'utils';
import {
  getSessionsRequest,
  paidSessionRequest,
  resetDebtRequest,
  statusSessionRequest,
  closeOlderThanDateSessionsRequest
} from 'api/sessions';
import { store } from '../index';
import { getSession } from '../../api/sessions';
import { SESSIONS_ON_PAGE } from '../../constants';

function* workSessions({ payload }) {
  try {
    const { data } = yield call(getSessionsRequest, {
      offset: 0,
      ...payload
    });
    const sessions = data.sessions;
    yield put(changePages(data.count));
    yield put(changeDataModal(sessions[0]));
    yield put(getSessionsSuccess(sessions));
  } catch (e) {
    yield put(getSessionsError());
  }
}

function* workSelectSessionStatus({ payload }) {
  try {
    yield call(statusSessionRequest, payload);
    const { data } = yield call(getSession, payload.id);
    yield put(getSessionSelectSuccess(data));
  } catch (e) {}
}

function* workSelectSessionPaid({ payload }) {
  try {
    yield call(paidSessionRequest, payload);
    const { data } = yield call(getSession, payload.id);
    yield put(getSessionSelectSuccess(data));
  } catch (e) {}
}

function* workSelectSession({ payload }) {
  try {
    const { data } = yield call(getSession, payload);
    yield put(getSessionSelectSuccess(data));
  } catch (e) {
    yield put(getSessionSelectError());
  }
}

function* workSessionsPage({ payload }) {
  try {
    const { data } = yield call(getSessionsRequest, {
      offset: (getPageNum(payload) * SESSIONS_ON_PAGE) / 10,
      ...store.getState().sessions.filters
    });
    yield put(getSessionsSuccess(data.sessions));
    yield put(changePages(data.count));
    yield put(changeCurrentPage(payload));
  } catch (e) {
    yield put(getSessionsError());
  }
}

function* workCloseOlderThanDate({ payload }) {
  try {
    const currentPage = yield select((state) => state.sessions.currentPage);
    yield call(closeOlderThanDateSessionsRequest, payload);
    const { data } = yield call(getSessionsRequest, {
      offset: (getPageNum(currentPage) * SESSIONS_ON_PAGE) / 10,
      ...store.getState().sessions.filters
    });
    yield put(getSessionsSuccess(data.sessions));
  } catch (e) {}
}

function* workSessionPaid({ payload }) {
  try {
    const currentPage = yield select((state) => state.sessions.currentPage);
    yield call(paidSessionRequest, payload);
    const { data } = yield call(getSessionsRequest, {
      offset: (getPageNum(currentPage) * SESSIONS_ON_PAGE) / 10,
      ...store.getState().sessions.filters
    });
    yield put(getSessionsSuccess(data.sessions));
  } catch (e) {}
}

function* workSessionStatus({ payload }) {
  try {
    const currentPage = yield select((state) => state.sessions.currentPage);
    yield call(statusSessionRequest, payload);
    const { data } = yield call(getSessionsRequest, {
      offset: (getPageNum(currentPage) * SESSIONS_ON_PAGE) / 10,
      ...store.getState().sessions.filters
    });
    yield put(getSessionsSuccess(data.sessions));
  } catch (e) {}
}

export default function* sessionsSagaWatcher() {
  yield takeEvery(sessionsFetch.type, workSessions);
  yield takeEvery(sessionsChangePageFetch.type, workSessionsPage);
  yield takeEvery(paidSessionFetch.type, workSessionPaid);
  yield takeEvery(statusSessionFetch.type, workSessionStatus);
  yield takeEvery(sessionSelectFetch.type, workSelectSession);
  yield takeEvery(statusSessionSelectFetch.type, workSelectSessionStatus);
  yield takeEvery(paidSessionSelectFetch.type, workSelectSessionPaid);
  yield takeEvery(closeOlderThanDateSessionsFetch.type, workCloseOlderThanDate);
}
