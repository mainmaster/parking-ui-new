import {$api} from "../index";

export const setPaymentsPageImage = (file) =>{
    return $api.put('/settings/paymentsPageImage/', file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const getPaymentsPageImage = (id) =>{
    return $api.get(`/settings/paymentsPageImage/?parkingID=${id}`)
}