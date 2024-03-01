import { $api } from '.';
import { store } from '../store';

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
  offset = 30,
  limit = 30,
  vehiclePlate = undefined,
  accessPoint,
  createDateTo,
  createDateFrom,
  eventCode
}) => {
  return $api.get('/events/', {
    params: {
      offset,
      limit,
      vehiclePlate,
      accessPoint,
      createDateTo,
      createDateFrom,
      eventCode
    }
  });
};
