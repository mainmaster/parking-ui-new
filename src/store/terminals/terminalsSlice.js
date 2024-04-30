import { createSlice } from '@reduxjs/toolkit';

export const terminalsSlice = createSlice({
  name: 'terminals',
  initialState: {
    createTerminal: false,
    editTerminal: null
  },
  reducers: {
    setCreateTerminal: (state, action) => {
      return {
        ...state,
        createTerminal: action.payload
      };
    },
    setEditTerminal: (state, action) => {
      return {
        ...state,
        editTerminal: action.payload
      };
    }
  }
});

export const { setCreateTerminal, setEditTerminal } = terminalsSlice.actions;

export default terminalsSlice.reducer;
