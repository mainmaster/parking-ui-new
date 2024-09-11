import { call, put, takeEvery } from 'redux-saga/effects'
import {
  paymentsChangePageFetch,
  paymentsFetch,
  getPaymentsSuccess,
  changePages,
  changeCurrentPage,
  getPaymentsError,
  paymentInfoFetch,
  getPaymentInfoError,
  getPaymentInfoSuccess,
  registerOrderFetch,
  setTotalPayment,
  getPaymentSelectSuccess,
  getPaymentSelectError,
  paymentSelectFetch,
  paymentCreateOrder,
} from './paymentsSlice'
import { getPageNum } from 'utils'
import {
  getPaymentsRequest,
  getPaymentInfoRequest,
  registerOrderRequest,
} from 'api/payment'
import {store} from "../index";
import {createPaymentOrder, getPayment} from '../../api/payment';
import {createApplicationRequest} from "../../api/applications";

function* workPayments({ payload }) {
  try {
    const { data } = yield call(getPaymentsRequest, {
      offset: 0,
      ...payload,
    })
    yield put(changePages(data.count))
    yield put(getPaymentsSuccess(data.payments))
    yield put(setTotalPayment(data.totalPayment))
  } catch (e) {
    yield put(getPaymentsError())
  }
}

function* workPaymentsPage({ payload }) {
  try {
    const { data } = yield call(getPaymentsRequest, {
      offset: getPageNum(payload) * 5,
      ...store.getState().payments.filters
    })
    yield put(getPaymentsSuccess(data.payments))
    yield put(changePages(data.count))
    yield put(changeCurrentPage(payload))
    yield put(setTotalPayment(data.totalPayment))
  } catch (e) {
    yield put(getPaymentsError())
  }
}

function* workSelectPayment({payload}){
  try{
    const { data } = yield call(getPayment, payload)
    yield put(getPaymentSelectSuccess(data))
  }catch(e){
    yield put(getPaymentSelectError())
  }
}

function* workPaymentInfoPage({ payload }) {
  try {
    const { data } = yield call(getPaymentInfoRequest, payload)
    yield put(getPaymentInfoSuccess(data.Products || 0))
  } catch (e) {
    yield put(getPaymentInfoError())
  }
}

function* workRegisterOrderPage({ payload }) {
  try {
    const { data } = yield call(registerOrderRequest, payload)
    if(data){
      window.open(data.redirectURL, '_blank')
    }
  } catch (e) {}
}

// function* workDeletePayment({ payload }) {
//   try {
//     yield call(, payload)
//     const controllers = yield select((state) => state.controllers.controllers)
//     const controllersArr = [...controllers].filter(
//         (item) => item.id !== payload
//     )
//     yield put(getControllersSuccess(controllersArr))
//   } catch (e) {}
// }

function* workPaymentCreateOrder({ payload }) {
  try {
    yield call(createPaymentOrder, payload);
  } catch (e) {}
}

export default function* paymentsSagaWatcher() {
  yield takeEvery(paymentsFetch.type, workPayments)
  yield takeEvery(paymentsChangePageFetch.type, workPaymentsPage)
  yield takeEvery(paymentSelectFetch.type, workSelectPayment)
  yield takeEvery(paymentInfoFetch.type, workPaymentInfoPage)
  yield takeEvery(registerOrderFetch.type, workRegisterOrderPage)
  yield takeEvery(paymentCreateOrder.type, workPaymentCreateOrder)
}
