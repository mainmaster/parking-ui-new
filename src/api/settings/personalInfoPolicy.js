import { $api } from '../index';

export const getPersonalInfoPolicy = (parkingId) => {
  return $api.get(`/settings/personalInfoPolicy?parkingID=${parkingId}`, {
    responseType: 'blob'
  });
};
export const setPersonalInfoPolicy = (file) => {
  return $api.put('/settings/personalInfoPolicy/', file, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
