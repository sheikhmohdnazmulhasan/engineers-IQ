"use server"
import { FieldValues } from "react-hook-form";

import axiosInstance from "@/libs/axiosInstance";

export async function createArticle(payload: FieldValues) {
    try {
        const { data } = await axiosInstance.post('/articles', payload);
        return data

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
    }
}