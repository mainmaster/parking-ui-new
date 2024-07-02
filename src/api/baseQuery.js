import {fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {enqueueSnackbar} from "notistack";

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
    }
    return result;
};