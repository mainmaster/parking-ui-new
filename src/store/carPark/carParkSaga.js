import { call, put, select, takeEvery } from 'redux-saga/effects';
import {
  createCarParkRequest,
  deleteCarParkRequest,
  getCarParksRequest,
  updateCarParkRequest
} from 'api/car-park';
import {
  carParkFetch,
  createCarParkFetch,
  deleteCarParkFetch,
  editCarParkFetch,
  getCarParkError,
  getCarParkSuccess,
  createModalHandler,
  changePages,
  editModalHandler,
  changeCurrentPage,
  carParkChangePageFetch
} from './carParkSlice';

import { getPageNum } from 'utils';
import { store } from '../index';

const urlPath = () => {
  const href = document.location.href;

  if (href.includes('subscribe')) {
    return {
      isSubscribe: 'True',
      status: 'active'
    };
  }

  if (href.includes('inactive')) {
    return {
      status: 'inactive'
    };
  }

  return {
    isSubscribe: 'False',
    status: 'active'
  };
};

function* workCarParks({ payload }) {
  try {
    const { data } = yield call(getCarParksRequest, {
      offset: 0,
      ...urlPath(),
      ...store.getState().carPark.filters
    });
    yield put(changePages(data.count));
    yield put(getCarParkSuccess(data));
  } catch (e) {
    yield put(getCarParkError());
  }
}

function* workCarParkPage({ payload }) {
  try {
    const { data } = yield call(getCarParksRequest, {
      offset: getPageNum(payload) * 5,
      ...urlPath(),
      ...store.getState().carPark.filters
    });
    yield put(getCarParkSuccess(data));
    yield put(changePages(data.count));
    yield put(changeCurrentPage(payload));
  } catch (e) {
    yield put(getCarParkError());
  }
}

function* workEditCarPark({ payload }) {
  try {
    const carParkEdit = yield select((state) => state.carPark.carParkEdit);
    payload.id = carParkEdit.id;
    yield call(updateCarParkRequest, payload);
    const { data } = yield call(getCarParksRequest, {
      offset: 0,
      ...urlPath(),
      ...store.getState().carPark.filters
    });
    yield put(getCarParkSuccess(data));
    yield put(editModalHandler());
  } catch (e) {}
}

function* workCreateCarPark({ payload }) {
  try {
    yield call(createCarParkRequest, payload);
    const { data } = yield call(getCarParksRequest, {
      offset: 0,
      ...urlPath(),
      ...store.getState().carPark.filters
    });
    yield put(getCarParkSuccess(data));
    yield put(createModalHandler());
  } catch (e) {}
}

function* workDeleteCarPark({ payload }) {
  try {
    yield call(deleteCarParkRequest, payload.id);
    const { data } = yield call(getCarParksRequest, {
      offset: 0,
      ...urlPath(),
      ...store.getState().carPark.filters
    });
    yield put(getCarParkSuccess(data));
  } catch (e) {}
}

export default function* carParkSagaWatcher() {
  yield takeEvery(carParkFetch.type, workCarParks);
  yield takeEvery(editCarParkFetch.type, workEditCarPark);
  yield takeEvery(carParkChangePageFetch.type, workCarParkPage);
  yield takeEvery(createCarParkFetch.type, workCreateCarPark);
  yield takeEvery(deleteCarParkFetch.type, workDeleteCarPark);
}
