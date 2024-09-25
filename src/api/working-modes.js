import { $api } from '.'

export const getWorkingModesRequest = async () => {
  return $api.get('/workingModes/')
}

export const createWorkingModeRequest = async ({
  description,
  price,
  free_time_min,
  transit_block_time_min,
  pass_mode,
  time_gte_min,
  time_lte_min,
  time_gte_hour,
  time_lte_hour,
  entry_fee,
  interval,
  not_include_free_time_in_estimation,
}) => {
  return $api.post('/workingModes/', {
    time_lte_hour,
    time_gte_hour,
    time_lte_min,
    time_gte_min,
    pass_mode,
    transit_block_time_min,
    free_time_min,
    price,
    description,
    entry_fee,
    interval,
    not_include_free_time_in_estimation
  })
}

export const updateWorkingModeRequest = async (data) => {
  return $api.put('/workingModes/' + data.id, data)
}

export const deleteWorkingModeRequest = async (id) => {
  return $api.delete('/workingModes/' + id)
}
