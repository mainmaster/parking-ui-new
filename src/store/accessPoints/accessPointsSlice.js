import { createSlice } from '@reduxjs/toolkit';

export const accessPointsSlice = createSlice({
  name: 'access-points',
  initialState: {
    accessPoints: [],
    isLoadingFetch: false,
    isErrorFetch: false,
    isCreateModal: false,
    isEditModal: false,
    accessPointEdit: {}
  },
  reducers: {
    accessPointsFetch: (state, action) => {
      return { ...state, isLoadingFetch: true, isErrorFetch: false };
    },
    accessPointsOnlyFetch: (state, action) => {
      return { ...state, isLoadingFetch: true, isErrorFetch: false };
    },
    accessPointsCamerasFetch: () => {},
    editAccessPointFetch: (state, action) => {},
    createAccessPointFetch: (state, action) => {},
    deleteAccessPointFetch: (state, action) => {},
    editModalHandler: (state, action) => {
      const accessPoint = [...state.accessPoints].find(
        (item) => item.id === action.payload
      );
      return {
        ...state,
        isEditModal: !state.isEditModal,
        accessPointEdit: accessPoint
      };
    },
    createModalHandler: (state, action) => {
      return { ...state, isCreateModal: !state.isCreateModal };
    },
    getAccessPointsSuccess: (state, action) => {
      return { ...state, accessPoints: action.payload, isLoadingFetch: false };
    },
    getAccessPointsError: (state, action) => {
      return {
        ...state,
        isLoadingFetch: false,
        isErrorFetch: true
      };
    }
  }
});

export const {
  accessPointsFetch,
  accessPointsOnlyFetch,
  editAccessPointFetch,
  createAccessPointFetch,
  deleteAccessPointFetch,
  editModalHandler,
  createModalHandler,
  getAccessPointsSuccess,
  getAccessPointsError,
  accessPointsCamerasFetch
} = accessPointsSlice.actions;

export default accessPointsSlice.reducer;
