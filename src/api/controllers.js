import { $api } from '.'

export const getControllersRequest = async () => {
  return $api.get('/laurent2/')
}

export const createControllerRequest = async (data) => {
  return $api.post('/laurent2/', data)
}

export const updateControllerRequest = async (data) => {
  return $api.put('/laurent2/' + data.id, data)
}

export const deleteControllerRequest = async (id) => {
  return $api.delete('/laurent2/' + id)
}
