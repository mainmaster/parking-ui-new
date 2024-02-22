import { createSlice } from '@reduxjs/toolkit'

export const ledSlice = createSlice({
  name: 'led',
  initialState: {
    leds: [],
    isLoadingFetch: false,
    isErrorFetch: false,
    isCreateModal: false,
    isEditModal: false,
    ledEdit: {},
  },
  reducers: {
    ledsFetch: (state, action) => {
      return { ...state, isLoadingFetch: true, isErrorFetch: false }
    },
    editLedFetch: (state, action) => {},
    createLedFetch: (state, action) => {},
    deleteLedFetch: (state, action) => {},
    editModalHandler: (state, action) => {
      const led = [...state.leds].find((item) => item.id === action.payload)
      return { ...state, isEditModal: !state.isEditModal, ledEdit: led }
    },
    createModalHandler: (state, action) => {
      return { ...state, isCreateModal: !state.isCreateModal }
    },
    getLedsSuccess: (state, action) => {
      return { ...state, leds: action.payload, isLoadingFetch: false }
    },
    getLedsError: (state, action) => {
      return {
        ...state,
        isLoadingFetch: false,
        isErrorFetch: true,
      }
    },
  },
})

export const {
  ledsFetch,
  editLedFetch,
  createLedFetch,
  deleteLedFetch,
  editModalHandler,
  createModalHandler,
  getLedsSuccess,
  getLedsError,
} = ledSlice.actions

export default ledSlice.reducer
