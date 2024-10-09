/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import { FieldValues } from "react-hook-form";

import axiosInstance from "@/libs/axiosInstance";

export async function createArticle(payload: FieldValues) {
    try {
        const { data } = await axiosInstance.post('/articles', payload);
        return data


    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export async function updateArticle(payload: FieldValues, postId: string) {
    try {
        const { data } = await axiosInstance.patch(`/article?_id=${postId}`, payload);
        return data;

    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
    }
};