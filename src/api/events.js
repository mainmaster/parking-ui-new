import { $api } from '.';
import { store } from '../store';
import { EVENTS_ON_PAGE } from '../constants';
import i18n from '../translation/index';

export const createEventRequest = async ({
  access_point_id,
  vehicle_plate,
  img_path,
  is_recognition,
  description
}) => {
  return $api.post('/events', {
    access_point_id,
    vehicle_plate,
    img_path,
    is_recognition,
    description
  });
};

export const getEvent = async (id) => {
  return $api.get(`/events/${id}`, {
    params: {
      lang: i18n.language
    }
  });
};

export const getEventsRequest = async ({
  offset = EVENTS_ON_PAGE,
  limit = EVENTS_ON_PAGE,
  vehiclePlate = undefined,
  accessPoint,
  createDateTo,
  createDateFrom,
  eventCode,
  createTimeFrom,
  createTimeTo,
}) => {
  return $api.get('/events/', {
    params: {
      offset,
      limit,
      vehiclePlate,
      accessPoint,
      createDateTo,
      createDateFrom,
      eventCode,
      createTimeFrom,
      createTimeTo,
      lang: i18n.language
    }
  });
};

export const getEventCodesRequest = async () => {
  return $api.get('/events/eventCodes', { params: {lang: i18n.language}});
};

export const getEventReport = async (params) => {
  return $api.get('/events/report', { params });
}
