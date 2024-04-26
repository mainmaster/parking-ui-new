import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';

export const operatorApi = createApi({
  reducerPath: 'operatorApi',
  baseQuery: baseQuery,
  tagTypes: ['Operators'],
  endpoints: (builder) => ({
    operators: builder.query({
      query: (params) => {
        return {
          url: '/parking/operator',
          params: params
        };
      },
      providesTags: ['Operators']
    }),
    createOperator: builder.mutation({
      query: (data) => ({
        url: '/parking/operator',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Operators']
    }),
    updateOperator: builder.mutation({
      query: (data) => ({
        url: `/parking/operator/${data.id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Operators']
    }),
    deleteOperator: builder.mutation({
      query: (id) => ({
        url: `parking/operator/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Operators']
    })
  })
});

export const {
  useOperatorsQuery,
  useLazyOperatorsQuery,
  useCreateOperatorMutation,
  useUpdateOperatorMutation,
  useDeleteOperatorMutation
} = operatorApi;
