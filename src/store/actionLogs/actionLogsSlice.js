import {createSlice} from "@reduxjs/toolkit";

export const actionLogsSlice = createSlice({
  name: 'action-logs',
  initialState: {
    actionLogs: [],
    pages: 1,
    isLoadingSelect: false,
    isErrorSelect: false,
    isLoadingFetch: false,
    isErrorFetch: false,
    currentPage: 1,
    dataModal: {},
    filter: {},
    selectActionLog: null,
  },
  reducers: {
    actionLogsFetch: (state) => {
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
    setFilters: (state, action)=>{
      return{
        ...state,
        filters: action.payload
      }
    },
    getActionLogsSuccess: (state, action) => {
      return {
        ...state,
        actionLogs: action.payload,
        isLoadingFetch: false
      };
    },
    getActionLogsError: (state) => {
      return {
        ...state,
        isLoadingFetch: false,
        isErrorFetch: true
      };
    },
    setSelectActionLog: (state, action) =>{
      return{
        ...state,
        selectActionLog: action.payload,
        isLoadingSelect: true,
        isErrorSelect: false
      }
    },

    actionLogSelectFetch: (state, action) => {
      return {
        ...state,
        isLoadingSelect: true,
        isErrorSelect: false
      }
    },
    getActionLogSelectSuccess: (state, action)=>{
      return {
        ...state,
        selectActionLog: action.payload,
        isLoadingSelect: false,
      }
    },
    getActionLogSelectError: (state, action)=>{
      return {
        ...state,
        selectActionLog: action.payload,
        isLoadingSelect: false,
        isErrorSelect: true
      }
    },
    actionLogsChangePageFetch: (state, action) => {},

  }
});

export const {
  actionLogsFetch,
  changePages,
  changeCurrentPage,
  getActionLogsSuccess,
  getActionLogsError,
  actionLogsChangePageFetch,
  setFilters,
  setSelectActionLog,
  getActionLogSelectError,
  getActionLogSelectSuccess,
  actionLogSelectFetch
} = actionLogsSlice.actions;

export default actionLogsSlice.reducer;