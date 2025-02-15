import { $api } from './index';

export const getActionLogs = ({ id, data, limit, offset }) => {
  return $api.get(`/logs/list/${id}`, { params: { ...data, limit, offset } });
};

export const getActionLog = async (id) => {
  return $api.get(`/logs/${id}`);
};
