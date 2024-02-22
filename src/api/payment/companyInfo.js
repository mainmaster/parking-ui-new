import {$api} from "../index";

export const getCompanyInfo = (id) =>{
    return $api.get(`/payment/companyInfo?parkingID=${id}`)
}