import { createSlice } from '@reduxjs/toolkit'

export const sessionsSlice = createSlice({
  name: 'sessions',
  initialState: {
    sessions: [],
    pages: 1,
    filters: {},
    selectSession: null,
    isLoadingSelect: false,
    isErrorSelect: false,
    isLoadingFetch: false,
    isErrorFetch: false,
    currentPage: 1,
    dataModal: {},
    ledTitles: {
      line1: "",
      line2: ""
    }
  },
  reducers: {
    sessionsFetch: (state) => {
      return {
        ...state,
        isLoadingFetch: true,
        isErrorFetch: false,
      }
    },
    setSelectSession: (state, action) =>{
      return{
        ...state,
        selectSession: action.payload,
        isLoadingSelect: true,
        isErrorSelect: false
      }
    },
    sessionSelectFetch: (state, action) => {
      return {
        ...state,
        isLoadingSelect: true,
        isErrorSelect: false
      }
    },
    paidSessionSelectFetch: (state, action) => {
      return {
        ...state,
      }
    },
    statusSessionSelectFetch: (state, action) => {
      return {
        ...state,
      }
    },
    getSessionSelectSuccess: (state, action)=>{
      return {
        ...state,
        selectSession: action.payload,
        isLoadingSelect: false,
      }
    },
    getSessionSelectError: (state, action)=>{
      return {
        ...state,
        selectSession: action.payload,
        isLoadingSelect: false,
        isErrorSelect: true
      }
    },
    setFilters: (state, action)=>{
      return{
        ...state,
        filters: action.payload
      }
    },
    sessionsChangePageFetch: (state, action) => {},
    getSessionsSuccess: (state, action) => {
      return {
        ...state,
        sessions: action.payload,
        isLoadingFetch: false,
      }
    },
    setLedTitles: (state, action) =>{
      return{
        ...state,
        ledTitles: action.payload
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
    getSessionsError: (state) => {
      return {
        ...state,
        isLoadingFetch: false,
        isErrorFetch: true,
      }
    },
    changeDataModal: (state, action) => {
      return {
        ...state,
        dataModal: action.payload,
      }
    },
    paidSessionFetch: (state, action) => {
      return {
        ...state,
      }
    },
    closeOlderThanDateSessionsFetch: (state, action) => {
      return {
        ...state,
      }
    },
    statusSessionFetch: (state, action) => {
      return {
        ...state,
      }
    },
    setCreateDateFrom: (state, action)=>{
      return{
        ...state,
        filters: {
          ...state.filters,
          createDateFrom: action.payload
        }
      }
    },
    setCreateDateTo: (state, action)=>{
      return{
        ...state,
        filters: {
          ...state.filters,
          createDateTo: action.payload
        }
      }
    },
    setPaid: (state, action)=>{
      return{
        ...state,
        filters: {
          ...state.filters,
          isPaid: action.payload
        }
      }
    },
    setStatus: (state, action)=>{
      return{
        ...state,
        filters: {
          ...state.filters,
          status: action.payload
        }
      }
    },
    setActiveFilter: (state, action)=>{
      return{
        ...state,
        filters: {
          ...state.filters,
          activeFilters: action.payload
        }
      }
    },
  },
})

export const {
    sessionsFetch,
    sessionsChangePageFetch,
    getSessionsSuccess,
    changePages,
    changeCurrentPage,
    getSessionsError,
    changeDataModal,
    setSelectSession,
    paidSessionSelectFetch,
    statusSessionSelectFetch,
    sessionSelectFetch,
    getSessionSelectError,
    getSessionSelectSuccess,
    paidSessionFetch,
    statusSessionFetch,
    setFilters,
    setActiveFilter,
    setCreateDateFrom,
    setPaid,
    setStatus,
    setLedTitles,
    setCreateDateTo,
    closeOlderThanDateSessionsFetch
} = sessionsSlice.actions

export default sessionsSlice.reducer
