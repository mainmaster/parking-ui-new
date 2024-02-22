import { createSlice } from '@reduxjs/toolkit'

export const controllersSlice = createSlice({
  name: 'controllers',
  initialState: {
    controllers: [],
    isLoadingFetch: false,
    isErrorFetch: false,
    isCreateModal: false,
    isEditModal: false,
    controllerEdit: {},
  },
  reducers: {
    controllersFetch: (state, action) => {
      return { ...state, isLoadingFetch: true, isErrorFetch: false }
    },
    editControllerFetch: (state, action) => {},
    createControllerFetch: (state, action) => {},
    deleteControllerFetch: (state, action) => {},
    editModalHandler: (state, action) => {
      const controller = [...state.controllers].find(
        (item) => item.id === action.payload
      )
      return {
        ...state,
        isEditModal: !state.isEditModal,
        controllerEdit: controller,
      }
    },
    createModalHandler: (state, action) => {
      return { ...state, isCreateModal: !state.isCreateModal }
    },
    getControllersSuccess: (state, action) => {
      return { ...state, controllers: action.payload, isLoadingFetch: false }
    },
    getControllersError: (state, action) => {
      return {
        ...state,
        isLoadingFetch: false,
        isErrorFetch: true,
      }
    },
  },
})

export const {
  controllersFetch,
  editControllerFetch,
  createControllerFetch,
  deleteControllerFetch,
  editModalHandler,
  createModalHandler,
  getControllersSuccess,
  getControllersError,
} = controllersSlice.actions

export default controllersSlice.reducer
