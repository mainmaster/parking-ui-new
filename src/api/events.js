import { $api } from '.';
import { store } from '../store';
import { EVENTS_ON_PAGE } from '../constants';

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
  return $api.get(`/events/${id}`);
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
      createTimeTo
    }
  });
};

export const getEventCodesRequest = async () => {
  return $api.get('/events/eventCodes');
};
