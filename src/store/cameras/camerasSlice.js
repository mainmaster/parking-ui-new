import { createSlice } from '@reduxjs/toolkit'

export const camerasSlice = createSlice({
  name: 'cameras',
  initialState: {
    cameras: [],
    isLoadingFetch: false,
    isErrorFetch: false,
    isCreateModal: false,
    isEditModal: false,
    cameraEdit: {},
    isOpenApModal: false,
    accessPointId: null,
    previewCameras: [],
    isOpenApTimeModal: false,
  },
  reducers: {
    camerasFetch: (state, action) => {
      return { ...state, isLoadingFetch: true, isErrorFetch: false }
    },
    editCameraFetch: (state, action) => {},
    createCameraFetch: (state, action) => {},
    deleteCameraFetch: (state, action) => {},
    previewCamerasPut: (state, action) => {
      const preview = {
        id: action.payload.access_point_id,
        preview_img: action.payload.image_b64,
      }
      const filteredPreviews = [...state.previewCameras].filter(
        (item) => item.id !== preview.id
      )
      filteredPreviews.push(preview)
      return { ...state, previewCameras: filteredPreviews }
    },
    editModalHandler: (state, action) => {
      const camera = [...state.cameras].find(
        (item) => item.id === action.payload
      )
      return { ...state, isEditModal: !state.isEditModal, cameraEdit: camera }
    },
    createModalHandler: (state, action) => {
      return { ...state, isCreateModal: !state.isCreateModal }
    },
    getCamerasSuccess: (state, action) => {
      return { ...state, cameras: action.payload, isLoadingFetch: false }
    },
    getCamerasError: (state, action) => {
      return {
        ...state,
        isLoadingFetch: false,
        isErrorFetch: true,
      }
    },
    changeActiveOpenApModal: (state, action) => {
      return {
        ...state,
        isOpenApModal: !state.isOpenApModal,
        accessPointId: action.payload,
      }
    },
    changeActiveOpenApTimeModal: (state, action) => {
      return {
        ...state,
        isOpenApTimeModal: !state.isOpenApTimeModal,
        accessPointId: action.payload,
      }
    },
  },
})

export const {
  camerasFetch,
  getCamerasSuccess,
  getCamerasError,
  editModalHandler,
  createModalHandler,
  editCameraFetch,
  createCameraFetch,
  deleteCameraFetch,
  changeActiveOpenApModal,
  getPreviewCamerasSuccess,
  previewCamerasPut,
  changeActiveOpenApTimeModal,
} = camerasSlice.actions

export default camerasSlice.reducer
