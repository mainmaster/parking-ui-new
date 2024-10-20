import { $api } from '.';

export const getPaymentsRequest = async ({
  offset = 50,
  limit = 50,
  vehiclePlate = undefined,
  createDateTo,
  createDateFrom,
  paymentType,
  isRefund,
  paymentFor
}) => {
  return $api.get('/payment/', {
    params: {
      offset,
      limit,
      vehiclePlate,
      createDateTo,
      createDateFrom,
      isRefund,
      paymentType,
      paymentFor
    }
  });
};

export const getPaymentInfoRequest = async ({
  number = undefined,
  parkingID
}) => {
  return $api.get('/payment/getInfo', {
    params: {
      number,
      parkingID
    }
  });
};

export const registerOrderRequest = async (data) => {
  return $api.post('/payment/registerOrder', data);
};

export const getPayment = async (id) => {
  return $api.get(`/payment/${id}`);
};

export const getPaymentsReport = async ({
  vehiclePlate = undefined,
  createDateTo,
  createDateFrom,
  paymentType,
  isRefund,
  paymentFor
}) => {
  return $api.get('/payment/report', {
    params: {
      vehiclePlate,
      createDateTo,
      createDateFrom,
      isRefund,
      paymentType,
      paymentFor
    },
    responseType: 'blob'
  });
};

export const createPaymentOrder = (data) => {
  return $api.post('/payment/registerAnyOrder', data);
};

export const unloadPayment = (data) => {
  return $api.get('/payment/report', {
    params: data
  });
};
