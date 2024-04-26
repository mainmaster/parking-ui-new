import { createSlice } from '@reduxjs/toolkit';

export const operatorSlice = createSlice({
  name: 'operator',
  initialState: {
    createOperator: false,
    editOperator: null
  },
  reducers: {
    setCreateOperator: (state, action) => {
      return {
        ...state,
        createOperator: action.payload
      };
    },
    setEditOperator: (state, action) => {
      return {
        ...state,
        editOperator: action.payload
      };
    }
  }
});

export const { setCreateOperator, setEditOperator } = operatorSlice.actions;

export default operatorSlice.reducer;
