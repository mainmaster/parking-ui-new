import { createSlice } from '@reduxjs/toolkit';

export const parkingInfo = createSlice({
  name: 'parkingInfo',
  initialState: {
    parkingID: 0,
    userType: '',
    username: '',
    operator: {}
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
    }
  }
});

export const { setParkingID, setParkingUserType, setOperator, setUsername } =
  parkingInfo.actions;
export default parkingInfo.reducer;
