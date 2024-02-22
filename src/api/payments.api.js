import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQuery} from "./baseQuery";

export const paymentsApi = createApi({
    reducerPath: 'paymentsApi',
    baseQuery: baseQuery,
    tagTypes: ['Payments','Subscriptions'],
    endpoints: (builder) =>({
        subscriptions: builder.query({
            query: (id) => `/payment/buySubscription?parkingID=${id}`,
            providesTags: ['Subscriptions']
        }),
        buySubscription: builder.mutation({
            query: (body) =>({
                url: '/payment/buySubscription',
                method: 'POST',
                body
            })
        })
    })
})

export const {useSubscriptionsQuery, useBuySubscriptionMutation} = paymentsApi