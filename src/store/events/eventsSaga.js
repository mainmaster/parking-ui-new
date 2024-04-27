import { all, call, delay, put, select, takeEvery } from 'redux-saga/effects';
import {
  eventsFetch,
  eventsOnlyFetch,
  getEventsSuccess,
  setFilteredEvents,
  changePages,
  eventsChangePageFetch,
  changeCurrentPage,
  changeDataModal,
  openApFetch,
  openApByVehiclePlateFetch,
  closeApFetch,
  normalApFetch,
  openApTimeFetch,
  openApAllFetch,
  closeApAllFetch,
  normalApAllFetch,
  getStatusesAccessPointsFetch,
  changeAccessPointsLoading,
  changeAccessPointsStatus
} from './eventsSlice';
import { getEventsRequest } from 'api/events';
import {
  getAccessPointsRequest,
  apNormalRequest,
  closeApRequest,
  openApWithTimeRequest,
  apCloseAllRequest,
  apNormalAllRequest,
  apOpenAllRequest
} from 'api/access-points';
import { getPageNum } from 'utils';
import {
  changeActiveOpenApModal,
  changeActiveOpenApTimeModal
} from '../cameras/camerasSlice';
import { openApByVehiclePlateRequest, openApRequest } from 'api/access-points';
import { getAccessPointsSuccess } from '../accessPoints/accessPointsSlice';
import { getAccessPointStatusRequest } from '../../api/access-points';
import { store } from '../index';
import { EVENTS_ON_PAGE } from '../../constants';
import _ from 'lodash';

function* workEvents({ payload }) {
  try {
    const { data } = yield call(getEventsRequest, {
      offset: 0,
      ...payload
    });
    const responseAccessPoints = yield call(getAccessPointsRequest);
    yield put(getAccessPointsSuccess(responseAccessPoints.data));
    yield put(changePages(data.count));
    yield put(changeDataModal(data.events[0]));
    yield put(getEventsSuccess(data.events));
    if (!_.isEmpty(store.getState().events.filters)) {
      yield put(setFilteredEvents(data.events));
    } else {
      yield put(setFilteredEvents([]));
    }
    yield put(changeAccessPointsLoading());
  } catch (e) {}
}

function* workOnlyEvents({ payload }) {
  try {
    const { data } = yield call(getEventsRequest, {
      offset: 0,
      ...payload
    });
    yield put(changePages(data.count));
    yield put(changeDataModal(data.events[0]));
    yield put(getEventsSuccess(data.events));
    if (!_.isEmpty(store.getState().events.filters)) {
      yield put(setFilteredEvents(data.events));
    } else {
      yield put(setFilteredEvents([]));
    }
  } catch (e) {}
}

function* workEventsPage({ payload }) {
  try {
    const { data } = yield call(getEventsRequest, {
      offset: (getPageNum(payload) * EVENTS_ON_PAGE) / 10,
      ...store.getState().events.filters
    });

    yield put(getEventsSuccess(data.events));
    yield put(changePages(data.count));
    yield put(changeCurrentPage(payload));
  } catch (e) {}
}

function* workOpenAp({ payload }) {
  try {
    yield call(openApRequest, payload);
    // toast.success('Успешно открылось!', {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // })
    yield put(changeAccessPointsStatus());
  } catch (e) {
    // toast.error('Что-то пошло не так', {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // })
  }
}

function* workOpenApByVehiclePlateFetch({ payload }) {
  try {
    yield call(openApByVehiclePlateRequest, payload);
    yield put(changeActiveOpenApModal());
    // toast.success('Успешно открылось!', {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // })
    yield put(changeAccessPointsStatus());
  } catch (e) {
    yield put(changeActiveOpenApModal());
    // toast.error('Что-то пошло не так', {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // })
  }
}

function* workCloseApFetch({ payload }) {
  try {
    yield call(closeApRequest, payload);
    // toast.success('Успешно закрылось!', {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // })
    yield put(changeAccessPointsStatus());
  } catch (e) {
    // toast.error('Что-то пошло не так', {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // })
  }
}

function* workNormalApFetch({ payload }) {
  try {
    yield call(apNormalRequest, payload);
    // toast.success('Переведено в нормальный режим!', {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // })
    yield put(changeAccessPointsStatus());
  } catch (e) {
    // toast.error('Что-то пошло не так', {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // })
  }
}

function* workOpenApTimeFetch({ payload }) {
  try {
    yield call(openApWithTimeRequest, payload);
    yield put(changeActiveOpenApTimeModal());
    // toast.success('Шлагбаум открыт на  ' + payload.seconds + ' с.', {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // })
    yield put(changeAccessPointsStatus());
  } catch (e) {
    yield put(changeActiveOpenApTimeModal());
    // toast.error('Что-то пошло не так', {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // })
  }
}

function* workOpenApAllFetch() {
  try {
    yield call(apOpenAllRequest);
    // toast.success('Все шлагбаумы открыты!', {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // })
    yield put(changeAccessPointsStatus());
  } catch (e) {
    yield put(changeActiveOpenApTimeModal());
    // toast.error('Что-то пошло не так', {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // })
  }
}

function* workCloseApAllFetch() {
  try {
    yield call(apCloseAllRequest);
    // toast.success('Все шлагбаумы закрыты!', {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // })
    yield put(changeAccessPointsStatus());
  } catch (e) {
    yield put(changeActiveOpenApTimeModal());
    // toast.error('Что-то пошло не так', {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // })
  }
}

function* workNormalApAllFetch() {
  try {
    yield call(apNormalAllRequest);
    // toast.success('Все шлагбаумы переведены в нормальный режим!', {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // })
    yield put(changeAccessPointsStatus());
  } catch (e) {
    yield put(changeActiveOpenApTimeModal());
    // toast.error('Что-то пошло не так', {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // })
  }
}

function* workAccessPointsStatusesFetch() {
  try {
    yield delay(500);
    const accessPoints = yield select(
      (state) => state.accessPoints.accessPoints
    );
    const data = yield all(
      accessPoints?.map((item) =>
        call(getAccessPointStatusRequest, { accessPointid: item.id })
      )
    );
    const transformData = data.map((item) => {
      const id = Number(item.config.url.split('/')[2]);
      const findedItem = accessPoints.find((point) => point.id === id);
      return {
        ...findedItem,
        status: item.data.status
      };
    });
    yield put(getAccessPointsSuccess(transformData));
  } catch (e) {}
}

export default function* eventsSagaWatcher() {
  yield takeEvery(eventsFetch.type, workEvents);
  yield takeEvery(eventsOnlyFetch.type, workOnlyEvents);
  yield takeEvery(eventsChangePageFetch.type, workEventsPage);
  yield takeEvery(openApFetch.type, workOpenAp);
  yield takeEvery(
    openApByVehiclePlateFetch.type,
    workOpenApByVehiclePlateFetch
  );
  yield takeEvery(closeApFetch.type, workCloseApFetch);
  yield takeEvery(normalApFetch.type, workNormalApFetch);
  yield takeEvery(openApTimeFetch.type, workOpenApTimeFetch);
  yield takeEvery(openApAllFetch.type, workOpenApAllFetch);
  yield takeEvery(closeApAllFetch.type, workCloseApAllFetch);
  yield takeEvery(normalApAllFetch.type, workNormalApAllFetch);
  yield takeEvery(
    getStatusesAccessPointsFetch.type,
    workAccessPointsStatusesFetch
  );
}
