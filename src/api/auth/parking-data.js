import {$api} from "../index";

export const getParkingData = async () =>{
    return await $api.get('/parking/')
}

export default getParkingData