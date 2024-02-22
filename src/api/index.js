import axios from 'axios'
import {enqueueSnackbar} from "notistack";

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
        (error.response.status === 401 ||  error.response.status === 403)
    ){
      document.location.href = "/login"
    }

    if(error.response.status === 400){
        enqueueSnackbar(JSON.stringify(error.response.data), {
            variant: 'error'
        })
    }
  return Promise.reject(error)
})

export { $api }