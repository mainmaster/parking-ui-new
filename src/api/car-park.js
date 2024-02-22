import { $api } from '.'

export const getCarParksRequest = async ({
  offset = 50,
  limit = 50,
  companyName,
  is_subscribe,
  vehiclePlate,
  isSubscribe,
  status,
}) => {
  return $api.get(`/carPark/`, {
    params: {
      offset,
      limit,
      vehiclePlate,
      isSubscribe,
      companyName,
      is_subscribe,
      status,
    },
  })
}

export const createCarParkRequest = async (data) => {
  return $api.post('/carPark/', data)
}

export const updateCarParkRequest = async (data) => {
  return $api.put('/carPark/' + data.id, data)
}

export const deleteCarParkRequest = async (id) => {
  return $api.delete('/carPark/' + id)
}
