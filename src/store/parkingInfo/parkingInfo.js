import {createSlice} from "@reduxjs/toolkit";

export const parkingInfo = createSlice({
    name: 'parkingInfo',
    initialState:{
        parkingID: 0,
        userType: ''
    },
    reducers: {
        setParkingID: (state, action)=>{
            return{...state, parkingID: action.payload}
        }
    }
})

export const {setParkingID} = parkingInfo.actions
export default parkingInfo.reducer