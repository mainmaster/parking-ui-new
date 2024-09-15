import axios from 'axios'
import {enqueueSnackbar} from "notistack";
import i18n from "i18next";

const $api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
})

$api.interceptors.response.use((config)=>{
  return Promise.resolve(config)
},(error)=>{
    const config = error?.config;
    if (
        config.url !== '/accounts/login/' &&
        (error.response.status === 401)
    ){
      document.location.href = "/login"
    }

    if (error.response.status === 403) {
      enqueueSnackbar(i18n.t('api.noAccess'), {
        variant: 'error'
      })
    }

    if(error.response.status === 400){
        enqueueSnackbar(JSON.stringify(error.response.data), {
            variant: 'error'
        })
    }
  return Promise.reject(error)
})

export { $api }