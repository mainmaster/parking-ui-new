import { $api } from "../../api"

export const getSearchLogsRequest = async ({
    offset = 0,
    limit = 50,
  }) => {
    return $api.get('/payment/searchLog', {
      params: {
        offset,
        limit,
      },
    })
  }