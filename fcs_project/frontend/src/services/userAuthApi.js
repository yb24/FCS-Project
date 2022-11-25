import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints - `${process.env.REACT_APP_BACKEND}/`
export const userAuthApi = createApi({
  reducerPath: 'userAuthApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BACKEND}),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
        query:(user)=>{
            return{
                url: 'register/',
                method: 'POST',
                body: user,
                headers: {
                    'Content-type': 'application/json',
                }
            }
        }
    }),
    loginUser: builder.mutation({
        query:(user)=>{
            return{
                url: 'login/',
                method: 'POST',
                body: user,
                headers: {
                    'Content-type': 'application/json',
                }
            }
        }
    }),
    profileUser: builder.mutation({
        query:(user)=>{
            return{
                url: 'profile/',
                method: 'POST',
                body: user,
                headers: {
                    'Content-type': 'application/json',
                }
            }
        }
    }),
    ChangeUserPassword: builder.mutation({
        query:(user)=>{
            return{
                url: 'changepassword/',
                method: 'POST',
                body: user,
                headers: {
                    'Content-type': 'application/json',
                }
            }
        }
    }),
    otpGenerator: builder.mutation({
        query:(user)=>{
            return{
                url: 'generate_otp_registration',
                method: 'POST',
                body: user,
                headers: {
                    'Content-type': 'application/json',
                }
            }
        }
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useRegisterUserMutation, useLoginUserMutation, useProfileUserMutation, useChangeUserPasswordMutation, useOtpGeneratorMutation } = userAuthApi