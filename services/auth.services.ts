/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { FieldValues } from "react-hook-form"

import axiosInstance from "@/libs/axiosInstance"

export const registerUser = async (userData: FieldValues) => {

    try {
        const { data } = await axiosInstance.post('/auth/register', userData);
        return data;

    } catch (error: any) {
        throw new Error(error);
    }
} 