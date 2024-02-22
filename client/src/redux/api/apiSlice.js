import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { PROXY_URL } from '../constants.js'

const baseQuery = fetchBaseQuery({baseUrl: PROXY_URL})

export const apiSlice = createApi({
    baseQuery,
    endpoints: () => ({})
})