import { $api } from './index';

export const getReports = (data) => {
  return $api.get('/reports', { params: data });
};

export const downloadReport = (name) => {
  return $api.get('/reports/download/' + name + '.xlsx', {
    responseType: 'blob'
  });
};

export const updateReport = async (data) => {
  return $api.put(`/reports/${data.id}/`, data);
};

export const deleteReport = async (id) => {
  return $api.delete(`/reports/${id}`);
}
