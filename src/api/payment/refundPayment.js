import {$api} from "../index";

export const refundPayment = (id) =>{
    return $api.post(`/payment/refund/${id}`)
}