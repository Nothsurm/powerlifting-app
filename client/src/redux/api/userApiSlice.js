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
        }),

        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/signin`,
                method: 'POST',
                body: data
            })
        }),

        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/signout`,
                method: 'POST',
            })
        }),

        resendEmail: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/resendEmail`,
                method: 'POST',
                body: data
            })
        }),

    })
})

export const {
    useRegisterMutation,
    useResendEmailMutation,
    useLoginMutation,
    useLogoutMutation
} = userApiSlice