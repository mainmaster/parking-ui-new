import { $api } from '.';
import moment from 'moment';
import { SESSIONS_ON_PAGE } from '../constants';

export const getSessionsRequest = async ({
  offset = 0,
  limit = SESSIONS_ON_PAGE,
  vehiclePlate,
  isPaid,
  status,
  createDateTo,
  createDateFrom
}) => {
  return $api.get('/sessions/', {
    params: {
      offset,
      limit,
      vehiclePlate,
      isPaid,
      status,
      createDateTo,
      createDateFrom
    }
  });
};

export const paidSessionRequest = async ({ id, is_paid }) => {
  return $api.patch('/sessions/' + id, { is_paid });
};

export const closeOlderThanDateSessionsRequest = async (data) => {
  return $api.post('/sessions/closeOlderThanDate/', {
    date: data
  });
};

export const getOpenedSessionsRequest = async () => {
  return $api.get('/sessions/openedSessions/');
};

export const statusSessionRequest = async ({ id, status }) => {
  return $api.patch('/sessions/' + id, { status });
};

export const getSession = async (id) => {
  return $api.get(`/sessions/${id}`);
};

export const resetDebtRequest = async (carNumber) => {
  return $api.patch('/sessions/debtReset/' + carNumber, {});
};
