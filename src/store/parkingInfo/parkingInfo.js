import { createSlice } from '@reduxjs/toolkit';

export const parkingInfo = createSlice({
  name: 'parkingInfo',
  initialState: {
    parkingID: 0,
    userType: '',
    username: '',
    operator: {},
    isNeedFetch: false,
  },
  reducers: {
    setParkingID: (state, action) => {
      return { ...state, parkingID: action.payload };
    },
    setParkingUserType: (state, action) => {
      return { ...state, userType: action.payload };
    },
    setOperator: (state, action) => {
      return { ...state, operator: action.payload };
    },
    setUsername: (state, action) => {
      return { ...state, username: action.payload };
    },
    setIsNeedFetch: (state, action) => {
      return { ...state, isNeedFetch: action.payload };
    }
  }
});

export const { setParkingID, setParkingUserType, setOperator, setUsername, setIsNeedFetch } =
  parkingInfo.actions;
export default parkingInfo.reducer;
