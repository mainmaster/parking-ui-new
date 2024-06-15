import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';

export const terminalsApi = createApi({
  reducerPath: 'terminalsApi',
  baseQuery: baseQuery,
  tagTypes: ['Terminals'],

  endpoints: (builder) => ({
    terminals: builder.query({
      query: () => '/terminal/',
      providesTags: ['Terminals']
    }),
    createTerminal: builder.mutation({
      query: (data) => ({
        url: '/terminal/',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Terminals']
    }),
    editTerminal: builder.mutation({
      query: (data) => ({
        url: `/terminal/${data.id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Terminals']
    }),
    activateTerminal: builder.mutation({
      query: (id) => ({
        url: `/terminal/${id}/test`,
        method: 'POST',
        body: {}
      })
    }),
    deleteTerminal: builder.mutation({
      query: (id) => ({
        url: `terminal/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Terminals']
    }),
    rebootTerminal: builder.mutation({
      query:(id) => ({
        url: `terminal/${id}/reboot`,
        method: 'POST'
      })
    })
  })
});

export const {
  useTerminalsQuery,
  useCreateTerminalMutation,
  useDeleteTerminalMutation,
  useEditTerminalMutation,
  useActivateTerminalMutation,
  useRebootTerminalMutation
} = terminalsApi;
