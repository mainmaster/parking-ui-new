import { createSlice } from '@reduxjs/toolkit'

export const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    applications: {

    },
    pages: 1,
    filters: {},
    currentPage: 1,
    isLoadingFetch: false,
    isErrorFetch: false,

    editApplication:{
      edit: false,
      application: null
    },
  },
  reducers: {
    setEditApplication: (state, action)=>{
      return{
        ...state,
        editApplication: action.payload
      }
    },
    deleteApplicationFetch:()=>{},
    editApplicationFetch: ()=>{},
    createApplicationsFetch: ()=>{},
    applicationsFetch: (state) => {
      return {
        ...state,
        isLoadingFetch: true,
        isErrorFetch: false,
      }
    },
    changePages: (state, action) => {
      return {
        ...state,
        pages: action.payload,
      }
    },
    setFilters: (state, action)=>{
      return{
        ...state,
        filters: action.payload
      }
    },
    applicationsChangePageFetch: (state, action) => {},
    changeCurrentPage: (state, action) => {
      return {
        ...state,
        currentPage: action.payload,
      }
    },
    getApplicationsSuccess: (state, action) => {
      return {
        ...state,
        applications: action.payload,
        isLoadingFetch: false,
      }
    },
    getApplicationsError: (state) => {
      return {
        ...state,
        isLoadingFetch: false,
        isErrorFetch: true,
      }
    },
  }
})

export const {
  setEditApplication,
  applicationsFetch,
  getApplicationsError,
  changeCurrentPage,
  changePages,
  applicationsChangePageFetch,
  getApplicationsSuccess,
  deleteApplicationFetch,
  editApplicationFetch,
  createApplicationsFetch,
  setFilters
} = applicationsSlice.actions

export default applicationsSlice.reducer
