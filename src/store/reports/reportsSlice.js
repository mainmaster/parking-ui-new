import {createSlice} from "@reduxjs/toolkit";

export const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    reports: [],
    pages: 1,
    isLoadingSelect: false,
    isErrorSelect: false,
    isLoadingFetch: false,
    isErrorFetch: false,
    currentPage: 1,
    dataModal: {},
  },
  reducers: {
    reportFetch: (state) => {
      return {
        ...state,
        isLoadingFetch: true,
        isErrorFetch: false
      };
    },
    changePages: (state, action) => {
      return {
        ...state,
        pages: action.payload
      };
    },
    changeCurrentPage: (state, action) => {
      return {
        ...state,
        currentPage: action.payload
      };
    },
    getReportsSuccess: (state, action) => {
      return {
        ...state,
        reports: action.payload,
        isLoadingFetch: false
      };
    },
    getReportsError: (state) => {
      return {
        ...state,
        isLoadingFetch: false,
        isErrorFetch: true
      };
    },
    reportsChangePageFetch: (state, action) => {},

  }
});

export const {
  reportFetch,
  changePages,
  changeCurrentPage,
  getReportsSuccess,
  getReportsError,
  reportsChangePageFetch
} = reportsSlice.actions;

export default reportsSlice.reducer;