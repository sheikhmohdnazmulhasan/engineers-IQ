"use client";
import axios, { AxiosError } from "axios";
import useSWR from "swr";

import { IUserResponse } from "@/interface/user.response.interface";

interface UseUserResponse {
    data: IUserResponse[]; // Assuming you're expecting an array of users
    error: AxiosError | null;
    isLoading: boolean; // Renamed loading to isLoading
}

const useUser = (): UseUserResponse => {
    const email = 'nazmulofficial@outlook.com'
    const fetcher = async (url: string): Promise<IUserResponse[]> => {
        const response = await axios.get(url);
        return response.data;
    };

    // Use SWR to fetch data
    const { data = [], error, isValidating } = useSWR<IUserResponse[]>(
        email ? `/api/users?email=${email}` : null,
        fetcher
    );

    // Determine loading state using SWR's isValidating
    const isLoading = !data && !error && isValidating;

    return { data, error: error as AxiosError, isLoading };
};

export default useUser;
