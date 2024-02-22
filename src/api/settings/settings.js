import { createApi } from '@reduxjs/toolkit/query/react'
import {baseQuery} from "../baseQuery";

export const settingSlice = createApi({
    reducerPath: 'settingSlice',
    baseQuery: baseQuery,
    tagTypes: ['Settings', 'ParkingInfo'],
    endpoints: (builder) => ({
        globalSettings: builder.query({
            query: () => '/settings/',
            providesTags: ['Settings'],
        }),
        editGlobalSettings: builder.mutation({
            query: (data)=>({
                url: '/settings/',
                method: "PUT",
                body: {...data}
            }),
            invalidatesTags: ['Settings'],
        }),
        parkingInfo: builder.query({
           query: () => '/parking/' ,
            providesTags: ['ParkingInfo']
        }),
        putParkingInfo: builder.mutation({
            query: (data)=>({
                url: "/parking/",
                method: "PUT",
                body: data,
            }),
            invalidatesTags:['ParkingInfo']
        })
    }),
})

export const { useGlobalSettingsQuery, useEditGlobalSettingsMutation, usePutParkingInfoMutation, useParkingInfoQuery } = settingSlice
