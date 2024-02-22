import { createSlice } from '@reduxjs/toolkit'

export const searchLogsSlice = createSlice({
  name: 'searchlogs',
  initialState: {
    searchLogs: {},
    pages: 1,
    filters: {},
    currentPage: 1,
    isLoadingFetch: false,
    isErrorFetch: false,
  },
  reducers: {
    // deleteSearchLogFetch:()=>{},
    searchLogsFetch: (state) => {
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
    searchLogsChangePageFetch: (state, action) => {},
    changeCurrentPage: (state, action) => {
      return {
        ...state,
        currentPage: action.payload,
      }
    },
    getSearchLogsSuccess: (state, action) => {
      return {
        ...state,
        searchLogs: action.payload,
        isLoadingFetch: false,
      }
    },
    getSearchLogsError: (state) => {
      return {
        ...state,
        isLoadingFetch: false,
        isErrorFetch: true,
      }
    },
  }
})

export const {
  searchLogsFetch,
  getSearchLogsError,
  changeCurrentPage,
  changePages,
  searchLogsChangePageFetch,
  getSearchLogsSuccess,
  setFilters
} = searchLogsSlice.actions

export default searchLogsSlice.reducer
