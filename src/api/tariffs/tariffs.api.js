import {$api} from "../index";

export const getAllTariffs = (id) =>{
    return $api.get(`/payment/tariffs/?parkingID=${id}`)
}