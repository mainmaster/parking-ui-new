import { createSlice } from '@reduxjs/toolkit'

export const carParkSlice = createSlice({
  name: 'carPark',
  initialState: {
    carParks: [],
    isLoadingFetch: false,
    isErrorFetch: false,
    isCreateModal: false,
    isEditModal: false,
    carParkEdit: {},
    filters: {},
    pages: 1,
    currentPage: 1,
  },
  reducers: {
    carParkFetch: (state, action) => {
      return { ...state, isLoadingFetch: true, isErrorFetch: false }
    },
    editCarParkFetch: (state, action) => {},
    createCarParkFetch: (state, action) => {},
    deleteCarParkFetch: (state, action) => {},
    editModalHandler: (state, action) => {
      const carPark = [...state.carParks.car_park].find(
        (item) => item.id === action.payload
      )
      return {
        ...state,
        isEditModal: !state.isEditModal,
        carParkEdit: carPark,
      }
    },
    setFilters: (state, action)=>{
      return{
        ...state,
        filters: action.payload
      }
    },
    carParkChangePageFetch: (state, action) => {},
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

    createModalHandler: (state, action) => {
      return { ...state, isCreateModal: !state.isCreateModal }
    },
    getCarParkSuccess: (state, action) => {
      return { ...state, carParks: action.payload, isLoadingFetch: false }
    },
    getCarParkError: (state, action) => {
      return {
        ...state,
        isLoadingFetch: false,
        isErrorFetch: true,
      }
    },
  },
})

export const {
  carParkFetch,
  editCarParkFetch,
  createCarParkFetch,
  deleteCarParkFetch,
  editModalHandler,
  createModalHandler,
  getCarParkSuccess,
  carParkChangePageFetch,
  setFilters,
  changePages,
  changeCurrentPage,
  getCarParkError,
} = carParkSlice.actions

export default carParkSlice.reducer
