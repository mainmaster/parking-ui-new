import { $api } from '.'

export const getApplicationsRequest = async ({
  offset = 0,
  limit = 50,
  vehiclePlate,
  validForDateTo,
  validForDateFrom,
  companyID,
  isUsed
}) => {
  return $api.get('/requests/', {
    params: {
      offset,
      limit,
      vehiclePlate,
      validForDateTo,
      validForDateFrom,
      companyID,
      isUsed
    },
  })
}

export const editApplicationRequest = async(data) =>{
  return $api.put(`/requests/${data.id}`, data)
}

export const createApplicationRequest = async(data)=>{
  return $api.post('requests/',data)
}

export const deleteApplicationRequest = async(data) =>{
  return $api.delete(`/requests/${data}`, data)
}