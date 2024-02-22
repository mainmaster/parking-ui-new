import { createSlice } from '@reduxjs/toolkit'

export const paymentsSlice = createSlice({
  name: 'payments',
  initialState: {
    payments: [],
    pages: 1,
    currentPage: 1,
    totalPayment: 0,
    filters: {},
    selectPayment: null,
    isLoadingFetch: false,
    isErrorFetch: false,
    isLoadingInfoFetch: false,
    isErrorInfoFetch: false,
    paymentInfo: [],
    isLoadingRegisterOrderFetch: false,
    isErrorRegisterOrderFetch: false,
  },
  reducers: {
    setSelectPayment: (state, action) =>{
      return{
        ...state,
        selectPayment: action.payload,
        isLoadingSelect: true,
        isErrorSelect: false
      }
    },
    paymentSelectFetch: (state, action) => {
      return {
        ...state,
        isLoadingSelect: true,
        isErrorSelect: false
      }
    },
    getPaymentSelectSuccess: (state, action)=>{
      return {
        ...state,
        selectPayment: action.payload,
        isLoadingSelect: false,
      }
    },
    getPaymentSelectError: (state, action)=>{
      return {
        ...state,
        selectPayment: action.payload,
        isLoadingSelect: false,
        isErrorSelect: true
      }
    },
    setTotalPayment: (state, action) =>{
      return {
        ...state,
        totalPayment: action.payload
      }
    },
    paymentsFetch: (state) => {
      return {
        ...state,
        isLoadingFetch: true,
        isErrorFetch: false,
      }
    },
    setFilters: (state, action)=>{
      return{
        ...state,
        filters: action.payload
      }
    },
    paymentInfoFetch: (state) => {
      return {
        ...state,
        isLoadingInfoFetch: true,
        isErrorInfoFetch: false,
      }
    },
    paymentsChangePageFetch: (state, action) => {},
    getPaymentsSuccess: (state, action) => {
      return {
        ...state,
        payments: action.payload,
        isLoadingFetch: false,
      }
    },
    changePages: (state, action) => {
      return {
        ...state,
        pages: action.payload,
      }
    },
    changeCurrentPage: (state, action) => {
      return {
        ...state,
        currentPage: action.payload,
      }
    },
    getPaymentsError: (state) => {
      return {
        ...state,
        isLoadingFetch: false,
        isErrorFetch: true,
      }
    },
    getPaymentInfoError: (state) => {
      return {
        ...state,
        isLoadingInfoFetch: false,
        isErrorInfoFetch: true,
      }
    },
    getPaymentInfoSuccess: (state, action) => {
      return {
        ...state,
        paymentInfo: action.payload,
        isLoadingInfoFetch: false,
      }
    },
    registerOrderFetch: (state) => {
      return {
        ...state,
        isLoadingRegisterOrderFetch: true,
        isErrorRegisterOrderFetch: false,
      }
    },

  },
})

export const {
  paymentsFetch,
  paymentsChangePageFetch,
  paymentSelectFetch,
  setSelectPayment,
  getPaymentSelectError,
  getPaymentSelectSuccess,
  getPaymentsSuccess,
  changePages,
  changeCurrentPage,
  getPaymentsError,
  paymentInfoFetch,
  getPaymentInfoError,
  getPaymentInfoSuccess,
  registerOrderFetch,
  setTotalPayment,
  setFilters
} = paymentsSlice.actions

export default paymentsSlice.reducer
