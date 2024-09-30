/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { FieldValues } from "react-hook-form"

import axiosInstance from "@/libs/axiosInstance"

export const registerUser = async (userData: FieldValues) => {

    try {
        const { data } = await axiosInstance.post('/auth/register', userData);
        return data;

    } catch (error: any) {
        // Check if it's an Axios error with a response
        if (error.response) {
            // Extract the error message from the response
            const errorMessage = error.response.data.message;
            throw new Error(errorMessage);
        }
    }
} 