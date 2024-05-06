import { call, put, takeEvery } from 'redux-saga/effects';

import { getPageNum } from 'utils';
import { store } from '../index';
import {
  createApplicationRequest,
  deleteApplicationRequest,
  editApplicationRequest,
  getApplicationsRequest
} from '../../api/applications';
import {
  applicationsChangePageFetch,
  applicationsFetch,
  changePages,
  getApplicationsSuccess,
  getApplicationsError,
  changeCurrentPage,
  deleteApplicationFetch,
  editApplicationFetch,
  createApplicationsFetch
} from './applicationSlice';

function* workApplications({ payload }) {
  try {
    const { data } = yield call(getApplicationsRequest, {
      offset: 0,
      ...payload,
      ...store.getState().applications.filters
    });
    const applications = data;
    yield put(getApplicationsSuccess(applications));
    yield put(changePages(data.count));
  } catch (e) {
    yield put(getApplicationsError());
  }
}

function* workDeleteApplication({ payload }) {
  try {
    yield call(deleteApplicationRequest, payload);
    const { data } = yield call(getApplicationsRequest, payload);
    yield put(getApplicationsSuccess(data));
  } catch (e) {}
}

function* workCreateApplication({ payload }) {
  try {
    yield call(createApplicationRequest, payload);
    const { data } = yield call(getApplicationsRequest, payload);
    yield put(getApplicationsSuccess(data));
  } catch (e) {}
}

function* workEditApplication({ payload }) {
  try {
    yield call(editApplicationRequest, payload);
    const { data } = yield call(getApplicationsRequest, payload);
    yield put(getApplicationsSuccess(data));
  } catch (e) {}
}

function* workApplicationsPage({ payload }) {
  try {
    const { data } = yield call(getApplicationsRequest, {
      offset: getPageNum(payload) * 5,
      ...store.getState().applications.filters
    });
    yield put(getApplicationsSuccess(data));
    yield put(changePages(data.count));
    yield put(changeCurrentPage(payload));
  } catch (e) {
    yield put(getApplicationsError());
  }
}

export default function* applicationsSagaWatcher() {
  yield takeEvery(applicationsFetch.type, workApplications);
  yield takeEvery(deleteApplicationFetch.type, workDeleteApplication);
  yield takeEvery(editApplicationFetch.type, workEditApplication);
  yield takeEvery(createApplicationsFetch.type, workCreateApplication);
  yield takeEvery(applicationsChangePageFetch.type, workApplicationsPage);
}
