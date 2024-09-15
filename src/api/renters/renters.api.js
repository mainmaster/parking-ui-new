import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../baseQuery'

export const rentersApi = createApi({
  reducerPath: 'rentersApi',
  baseQuery: baseQuery,
  tagTypes: ['Renters'],
  endpoints: (builder) => ({
    renters: builder.query({
      query: (params) => {
        return {
          url: '/parking/renter',
          params: params,
        }
      },
      providesTags: ['Renters'],
    }),
    createRenters: builder.mutation({
      query: (data) => ({
        url: '/parking/renter',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Renters'],
    }),
    updateRenter: builder.mutation({
      query: (data) => ({
        url: `/parking/renter/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Renters'],
    }),
    activateRenter: builder.mutation({
      query: (id) => ({
        url: `parking/renter/${id}/activate`,
        method: 'POST',
      }),
      invalidatesTags: ['Renters'],
    }),
    deactivateRenter: builder.mutation({
      query: (id)=>({
        url: `parking/renter/${id}/deactivate`,
        method: 'POST',
      }),
      invalidatesTags: ['Renters'],
    }),
    deleteRenter: builder.mutation({
      query: (id) => ({
        url: `parking/renter/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Renters'],
    })
  }),
})

export const {
  useRentersQuery,
  useLazyRentersQuery,
  useCreateRentersMutation,
  useUpdateRenterMutation,
  useActivateRenterMutation,
  useDeactivateRenterMutation,
  useDeleteRenterMutation,
} = rentersApi
