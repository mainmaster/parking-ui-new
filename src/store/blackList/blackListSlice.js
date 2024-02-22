import { createSlice } from '@reduxjs/toolkit'

export const blackListSlice = createSlice({
  name: 'blackList',
  initialState: {
    blackList: [],
    isLoadingFetch: false,
    isErrorFetch: false,
    isCreateModal: false,
    isEditModal: false,
    blackListEdit: {},
    filters: {},
    pages: 1,
    currentPage: 1,
  },
  reducers: {
    blackListFetch: (state, action) => {
      return { ...state, isLoadingFetch: true, isErrorFetch: false }
    },
    editBlackListFetch: (state, action) => {},
    createBlackListFetch: (state, action) => {},
    deleteBlackListFetch: (state, action) => {},
    editModalHandler: (state, action) => {
      const blackList = [...state.blackList.black_list].find(
        (item) => item.id === action.payload
      )
      return {
        ...state,
        isEditModal: !state.isEditModal,
        blackListEdit: blackList,
      }
    },
    createModalHandler: (state, action) => {
      return { ...state, isCreateModal: !state.isCreateModal }
    },
    getBlackListSuccess: (state, action) => {
      return { ...state, blackList: action.payload, isLoadingFetch: false }
    },
    getBlackListError: (state, action) => {
      return {
        ...state,
        isLoadingFetch: false,
        isErrorFetch: true,
      }
    },
    setFilters: (state, action)=>{
      return{
        ...state,
        filters: action.payload
      }
    },
    blackListChangePageFetch: (state, action) => {},
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
  },
})

export const {
  blackListFetch,
  editBlackListFetch,
  createBlackListFetch,
  deleteBlackListFetch,
  editModalHandler,
  createModalHandler,
  blackListChangePageFetch,
  changeCurrentPage,
  changePages,
  getBlackListSuccess,
  getBlackListError,
  setFilters
} = blackListSlice.actions

export default blackListSlice.reducer
