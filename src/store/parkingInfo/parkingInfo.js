import { createSlice } from '@reduxjs/toolkit';

export const parkingInfo = createSlice({
  name: 'parkingInfo',
  initialState: {
    parkingID: 0,
    userType: ''
  },
  reducers: {
    setParkingID: (state, action) => {
      return { ...state, parkingID: action.payload };
    },
    setParkingUserType: (state, action) => {
      return { ...state, userType: action.payload };
    }
  }
});

export const { setParkingID, setParkingUserType } = parkingInfo.actions;
export default parkingInfo.reducer;
