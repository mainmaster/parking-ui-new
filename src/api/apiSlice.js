import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    credentials: 'include'
  }),
  tagTypes: ['Tariffs'],
  endpoints: (builder) => ({
    getInfoFooter: builder.query({
      query: (id) =>  `/payment/companyInfo?parkingID=${id}`,
    }),
    getWorkingModes: builder.query({
      query: (id) => `/workingModes?parkingID=${id}`,
    }),
    getImagePayments: builder.query({
      query: (id) => `/settings/paymentsPageImage/?parkingID=${id}`,
    }),
    postPaymentRefund: builder.mutation({
      query: (id)=> ({
        url: `/payment/refund/${id}`,
        method: 'POST',
        invalidatesTags: ['Payments']
      })
    }),
    getAllTariffs: builder.query({
      query: (id) => `/payment/tariffs?parkingID=${id}`,
      providesTags: ['Tariffs']
    })
  }),
})

export const {
  useGetInfoFooterQuery,
  useGetWorkingModesQuery,
  useGetAllTariffsQuery,
  useGetImagePaymentsQuery,
  usePostPaymentRefundMutation } = apiSlice
