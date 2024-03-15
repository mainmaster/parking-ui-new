import { createSlice } from '@reduxjs/toolkit';

export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    pages: 1,
    filters: {},
    currentPage: 1,
    dataModal: {},
    isLoadingFetch: true,
    isAccessPointsFetched: false,
    isChangedStatus: false,
    selectedEventId: null
  },
  reducers: {
    eventsFetch: (state, action) => {
      return {
        ...state,
        isLoadingFetch: true
      };
    },
    eventsOnlyFetch: (state, action) => {
      return {
        ...state,
        isLoadingFetch: true
      };
    },
    eventsChangePageFetch: (state, action) => {},
    openApFetch: (state, action) => {},
    openApByVehiclePlateFetch: (state, action) => {},
    getEventsSuccess: (state, action) => {
      return {
        ...state,
        events: action.payload,
        isLoadingFetch: false
      };
    },
    setAccessPoint: (state, action) => {
      return {
        ...state,
        filters: {
          ...state.filters,
          accessPoint: action.payload
        }
      };
    },
    setFilters: (state, action) => {
      return {
        ...state,
        filters: action.payload
      };
    },
    putEvent: (state, action) => {
      return {
        ...state,
        events: [action.payload, ...state.events]
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
    changeDataModal: (state, action) => {
      return {
        ...state,
        dataModal: action.payload
      };
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
        isAccessPointsFetched: true
      };
    },
    changeAccessPointsStatus: (state, action) => {
      return {
        ...state,
        isChangedStatus: !state.isChangedStatus
      };
    },
    setSelectedEventId: (state, action) => {
      return {
        ...state,
        selectedEventId: action.payload
      };
    }
  }
});

export const {
  eventsFetch,
  eventsOnlyFetch,
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
  setFilters,
  setSelectedEventId
} = eventsSlice.actions;

export default eventsSlice.reducer;
