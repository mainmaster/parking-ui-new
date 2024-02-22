import { createSlice } from '@reduxjs/toolkit'

export const workingModesSlice = createSlice({
  name: 'working-modes',
  initialState: {
    workingModes: [],
    isLoadingFetch: false,
    isErrorFetch: false,
    isCreateModal: false,
    isEditModal: false,
    workingModeEdit: {},
  },
  reducers: {
    workingModesFetch: (state, action) => {
      return { ...state, isLoadingFetch: true, isErrorFetch: false }
    },
    editWorkingModeFetch: (state, action) => {},
    createWorkingModeFetch: (state, action) => {},
    deleteWorkingModeFetch: (state, action) => {},
    editModalHandler: (state, action) => {
      const workingMode = [...state.workingModes].find(
        (item) => item.id === action.payload
      )

      return {
        ...state,
        isEditModal: !state.isEditModal,
        workingModeEdit: workingMode,
      }
    },
    editModalClose: (state) => {
      return {
        ...state,
        isEditModal: false,
      }
    },
    createModalHandler: (state, action) => {
      return { ...state, isCreateModal: !state.isCreateModal }
    },
    getWorkingModesSuccess: (state, action) => {
      return { ...state, workingModes: action.payload, isLoadingFetch: false }
    },
    getWorkingModesError: (state, action) => {
      return {
        ...state,
        isLoadingFetch: false,
        isErrorFetch: true,
      }
    },
  },
})

export const {
  workingModesFetch,
  editWorkingModeFetch,
  createWorkingModeFetch,
  deleteWorkingModeFetch,
  editModalHandler,
  createModalHandler,
  getWorkingModesSuccess,
  getWorkingModesError,
  editModalClose,
} = workingModesSlice.actions

export default workingModesSlice.reducer
