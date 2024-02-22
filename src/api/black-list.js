import { $api } from '.'

export const getBlackListRequest = async ({
  offset = 50,
  limit = 50,
  vehiclePlate,
  status
}) => {
  return $api.get(`/blackList/`,{
    params: {
      offset,
      limit,
      vehiclePlate,
      status
    },
  })
}

export const createBlackListRequest = async ({
  vehicle_plate,
  description,
  valid_until,
}) => {
  return $api.post('/blackList/', {
    vehicle_plate,
    description,
    valid_until,
  })
}

export const updateBlackListRequest = async ({
  vehicle_plate,
  description,
  valid_until,
  id,
}) => {
  return $api.put('/blackList/' + id, {
    vehicle_plate,
    description,
    valid_until,
  })
}

export const deleteBlackListRequest = async (id) => {
  return $api.delete('/blackList/' + id)
}
