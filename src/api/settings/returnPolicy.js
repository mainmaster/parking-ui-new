import { $api } from '../index';

export const getReturnPolicy = (parkingId) => {
  return $api.get(`/settings/returnPolicy?parkingID=${parkingId}`, {
    responseType: 'blob'
  });
};

export const setReturnPolicy = (file) => {
  return $api.put('/settings/returnPolicy/', file, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
