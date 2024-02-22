import { $api } from '.'

export const getAccessPointsRequest = async () => {
  return $api.get('/accessPoints/')

}
export const createAccessPointRequest = async (data) => {
  return $api.post('/accessPoints/', data)
}

export const updateAccessPointRequest = async (data) => {
  return $api.put('/accessPoints/' + data.id, data)
}

export const deleteAccessPointRequest = async (id) => {
  return $api.delete('/accessPoints/' + id)
}

export const openApRequest = async (accessPointid) => {
  return $api.post('/accessPoints/' + accessPointid + '/open')
}

export const getAccessPointById = async (id) =>{
  return $api.get('/accessPoints/' + id)
}

export const getAccessPointSnapshot = async(parkingID)=>{
  return $api.get('/accessPoints/'+parkingID+'/snapshot', {responseType: 'blob'})
}

export const openApByVehiclePlateRequest = async ({
  accessPointid,
  vehiclePlate,
}) => {
  return $api.post('/accessPoints/' + accessPointid + '/open/' + vehiclePlate)
}

export const closeApRequest = async ({ accessPointid }) => {
  return $api.post('/accessPoints/' + accessPointid + '/close')
}

export const openApWithTimeRequest = async ({ accessPointid, seconds }) => {
  return $api.post('/accessPoints/' + accessPointid + '/quickOpen/' + seconds)
}

export const apNormalRequest = async ({ accessPointid }) => {
  return $api.post('/accessPoints/' + accessPointid + '/workingMode')
}

export const apOpenAllRequest = async () => {
  return $api.post('/accessPoints/openAll')
}

export const apCloseAllRequest = async () => {
  return $api.post('/accessPoints/closeAll')
}

export const apNormalAllRequest = async () => {
  return $api.post('/accessPoints/workingModeAll')
}

export const getAccessPointStatusRequest = async ({ accessPointid }) => {
  return $api.get('/accessPoints/' + accessPointid + '/status')
}

export const postLedBoardMessage = async ({line1, line2, id}) => {
  return $api.post(`accessPoints/${id}/ledMessage`, {line1, line2})
}
export const clearLedBoardMessage = async (id) =>{
  return $api.post(`accessPoints/${id}/ledMessage/clear`)
}