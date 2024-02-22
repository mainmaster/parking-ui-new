import { createSlice } from '@reduxjs/toolkit'

export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    pages: 1,
    filters: {
    },
    currentPage: 1,
    dataModal: {},
    isLoadingFetch: true,
    isAccessPointsFetched: false,
    isChangedStatus: false,
  },
  reducers: {
    eventsFetch: (state, action) => {
      return {
        ...state,
        isLoadingFetch: true,
      }
    },
    eventsChangePageFetch: (state, action) => {},
    openApFetch: (state, action) => {},
    openApByVehiclePlateFetch: (state, action) => {},
    getEventsSuccess: (state, action) => {
      return {
        ...state,
        events: action.payload,
        isLoadingFetch: false,
      }
    },
    setAccessPoint: (state, action)=>{
      return{
        ...state,
        filters: {
          ...state.filters,
          accessPoint: action.payload
        }
      }
    },
    setFilters: (state, action)=>{
      return{
        ...state,
        filters: action.payload
      }
    },
    putEvent: (state, action) => {
      return {
        ...state,
        events: [action.payload, ...state.events],
      }
    },
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
    changeDataModal: (state, action) => {
      return {
        ...state,
        dataModal: action.payload,
      }
    },
    closeApFetch: (state, action) => {},
    normalApFetch: (state, action) => {},
    openApTimeFetch: (state, action) => {},
    openApAllFetch: (state, action) => {},
    closeApAllFetch: (state, action) => {},
    normalApAllFetch: (state, action) => {},
    getStatusesAccessPointsFetch: (state, action) => {},
    changeAccessPointsLoading: (state, action) => {
      return {
        ...state,
        isAccessPointsFetched: true,
      }
    },
    changeAccessPointsStatus: (state, action) => {
      return {
        ...state,
        isChangedStatus: !state.isChangedStatus,
      }
    },
  },
})

export const {
  eventsFetch,
  getEventsSuccess,
  putEvent,
  changePages,
  eventsChangePageFetch,
  changeCurrentPage,
  changeDataModal,
  openApFetch,
  openApByVehiclePlateFetch,
  closeApFetch,
  normalApFetch,
  openApTimeFetch,
  openApAllFetch,
  closeApAllFetch,
  normalApAllFetch,
  getStatusesAccessPointsFetch,
  changeAccessPointsLoading,
  changeAccessPointsStatus,
  setFilters
} = eventsSlice.actions

export default eventsSlice.reducer
