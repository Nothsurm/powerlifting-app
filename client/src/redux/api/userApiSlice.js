import { apiSlice } from "./apiSlice.js";
import { USERS_URL } from "../constants.js";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/signup`,
                method: 'POST',
                body: data
            })
        })
    })
})

export const {
    useRegisterMutation
} = userApiSlice