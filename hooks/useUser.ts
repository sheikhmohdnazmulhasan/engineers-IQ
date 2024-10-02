"use client";
import axios, { AxiosError } from "axios";
import useSWR from "swr";

import { IUserResponse } from "@/interface/user.response.interface";

interface UseUserResponse {
    currentUser: IUserResponse | null;
    error: AxiosError | null;
    isLoading: boolean;
    revalidate: () => void
}

const useUser = (): UseUserResponse => {
    const signed_email = localStorage.getItem('signed_email');

    const fetcher = async (url: string): Promise<IUserResponse> => {
        const response = await axios.get(url);
        return response.data.data;
    };

    const { data, error, isValidating, mutate } = useSWR<IUserResponse>(
        signed_email ? `/api/users?email=${signed_email}` : null,
        fetcher
    );

    const isLoading = isValidating;

    return { currentUser: data || null, error: error as AxiosError, isLoading, revalidate: () => mutate() };
};

export default useUser;
