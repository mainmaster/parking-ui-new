import { $api } from '.';

export const getCamerasRequest = async () => {
  return $api.get('/cameras/', {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const createCameraRequest = async ({
  description,
  ip_address,
  login,
  password,
  mjpeg_url,
  snapshot_url,
  port
}) => {
  return $api.post('/cameras/', {
    description,
    ip_address,
    login,
    password,
    mjpeg_url,
    snapshot_url,
    port
  });
};

export const updateCameraRequest = async ({
  description,
  ip_address,
  login,
  password,
  id,
  mjpeg_url,
  snapshot_url,
  port
}) => {
  return $api.put('/cameras/' + id, {
    description,
    ip_address,
    login,
    password,
    mjpeg_url,
    snapshot_url,
    port
  });
};

export const deleteCameraRequest = async (id) => {
  return $api.delete('/cameras/' + id);
};
