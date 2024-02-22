import { createSlice } from "@reduxjs/toolkit";

export const rentersSlice = createSlice({
    name: 'renters',
    initialState: {
        editRenter:{
          edit: false,
          renter: null
        },
      },
      reducers: {
        setEditRenter: (state, action)=>{
          return{
            ...state,
            editRenter: action.payload
          }
        }
      }
})

export const {setEditRenter} = rentersSlice.actions
  
export default rentersSlice.reducer
  