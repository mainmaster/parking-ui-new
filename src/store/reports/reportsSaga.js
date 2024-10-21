import { call, put, select, takeEvery } from 'redux-saga/effects';
import { getReports } from '../../api/reports.api';
import {
  changePages,
  reportFetch,
  getReportsSuccess,
  getReportsError, changeCurrentPage, reportsChangePageFetch
} from './reportsSlice';
import {REPORTS_ON_PAGE,} from "../../constants";
import {getPageNum} from "../../utils";

function* workReports({ payload }) {
  try {
    const { data } = yield call(getReports, {
      offset: 0,
      limit: REPORTS_ON_PAGE,
      ...payload
    });
    const reports = data.reports;
    yield put(changePages(data.count));
    yield put(getReportsSuccess(reports));
  } catch (e) {
    yield put(getReportsError());
  }
}

function* workReportsPage({ payload }) {
  try {
    const { data } = yield call(getReports, {
      offset: (getPageNum(payload) * REPORTS_ON_PAGE) / 10,
      limit: REPORTS_ON_PAGE,
    });
    yield put(getReportsSuccess(data.sessions));
    yield put(changePages(data.count));
    yield put(changeCurrentPage(payload));
  } catch (e) {
    yield put(getReportsError());
  }
}

export default function* reportsSagaWatcher() {
  yield takeEvery(reportFetch.type, workReports);
  yield takeEvery(reportsChangePageFetch.type, workReportsPage);
}
