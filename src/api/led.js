import { $api } from '.'

export const getLedsRequest = async () => {
  return $api.get('/ledBoard/')
}

export const createLedRequest = async (data) => {
  return $api.post('/ledBoard/', data)
}

export const updateLedRequest = async (data) => {
  return $api.put('/ledBoard/' + data.id, data)
}

export const deleteLedRequest = async (id) => {
  return $api.delete('/ledBoard/' + id)
}
