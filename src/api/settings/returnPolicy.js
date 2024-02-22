import {$api} from "../index";

export const setReturnPolicy = (file) =>{
    return $api.put('/settings/returnPolicy/', file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}