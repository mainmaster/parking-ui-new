import {fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {enqueueSnackbar} from "notistack";
import i18n from "i18next";

const basicQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    credentials: 'include'
})

export const baseQuery = async (args,api,extraOptions) => {
    let result = await basicQuery(args, api, extraOptions);

    if(result.error){
        if(result.meta?.response?.status === 400){
            enqueueSnackbar(JSON.stringify(result.error.data), {
                variant: 'error'
            })
        }
        if (result.error?.status === 401 || result.error?.status === 403) {
            document.location.href = "/login"
        }
        // if (result.error?.status === 403) {
        //     enqueueSnackbar(i18n.t('api.noAccess'), {variant: 'error'})
        // }
    }
    return result;
};