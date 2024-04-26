import { createSlice } from '@reduxjs/toolkit';

export const rentersSlice = createSlice({
  name: 'renters',
  initialState: {
    createRenter: false,
    editRenter: null
  },
  reducers: {
    setCreateRenter: (state, action) => {
      return {
        ...state,
        createRenter: action.payload
      };
    },
    setEditRenter: (state, action) => {
      return {
        ...state,
        editRenter: action.payload
      };
    }
  }
});

export const { setCreateRenter, setEditRenter } = rentersSlice.actions;

export default rentersSlice.reducer;
