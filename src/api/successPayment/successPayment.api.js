import {$api} from "../index";

export const getSuccessPayment = (id) =>{
    return $api.get(`/payment/successPayment?parkingID=${id}`)
}
export const getSuccessPaymentSubs = (id) =>{
    return $api.get(`/payment/successPayment?parkingID=${id}&paymentFor=subscription`)
}