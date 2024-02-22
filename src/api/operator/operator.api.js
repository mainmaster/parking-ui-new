import {$api} from "../index";

export const createOperator = (data) =>{
    return $api.post(`/parking/operator`, data, {
        method: 'POST'
    })
}
export const getAllOperators = () =>{
    return $api.get(`/parking/operator`)
}

export const deleteOperator = (id) =>{
    return $api.delete(`/parking/operator/${id}`)
}