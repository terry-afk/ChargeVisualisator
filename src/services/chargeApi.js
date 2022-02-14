import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseUrl = "http://localhost:8080"

const createRequest = (url) => ({url})

export const chargeApi = createApi({
    reducerPath: 'chargeApi',
    baseQuery: fetchBaseQuery({baseUrl}),
    endpoints: (builder) => ({
        getData: builder.query({
            query: () => createRequest("/data")
        })
    })
})

export const {
    useGetDataQuery
} = chargeApi